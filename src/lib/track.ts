import { track as vercelTrack } from "@vercel/analytics";

// Conversion events, visible in Vercel Analytics → Events. Names stay stable so trends compare.
export type ConversionEvent =
  | "resume_download"
  | "booking_open"
  | "whatsapp_click"
  | "email_click"
  | "summary_copy"
  | "case_study_open"
  | "checklist_print"
  | "path_select";

export function track(event: ConversionEvent, props?: Record<string, string>) {
  try {
    vercelTrack(event, props);
  } catch {}
}
