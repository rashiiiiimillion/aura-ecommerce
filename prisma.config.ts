import "dotenv/config";
import { defineConfig } from "prisma/config";

// Detect if a Prisma CLI migration/schema command is running
const isCliCommand = 
  process.argv.some(arg => arg.includes("migrate")) || 
  process.argv.some(arg => arg.includes("db")) || 
  process.argv.some(arg => arg.includes("studio"));

// Read both URLs from .env
const poolerUrl = process.env.DATABASE_URL || "";
// Use the pooler domain (IPv4) but with Session mode (port 5432) for migrations to avoid IPv6 connectivity errors.
const directUrl = poolerUrl.replace("6543", "5432").replace("?pgbouncer=true", "");

// Ensure we use the Direct URL (port 5432) for schema migrations to prevent PgBouncer connection drops.
// Ensure we use the Pooler URL (port 6543) for runtime queries to scale transactions.
const activeUrl = isCliCommand ? directUrl : poolerUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: activeUrl,
  },
});
