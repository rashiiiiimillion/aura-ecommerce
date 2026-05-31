import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, ctx: any) {
  return await handlers.GET(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  return await handlers.POST(req, ctx);
}

export const dynamic = "force-dynamic";
