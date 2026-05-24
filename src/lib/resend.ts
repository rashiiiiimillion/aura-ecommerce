import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  // We'll log a warning instead of throwing an error to allow local development without an API key
  console.warn("RESEND_API_KEY is missing from environment variables.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
