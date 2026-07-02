import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/schemas";
import { contactLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Rate limit (best-effort; a no-op until Redis env vars are set).
  const rl = contactLimiter();
  if (rl) {
    const { success } = await rl.limit(`contact:${getClientIp(request)}`);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Too many messages. Please try again in a few minutes." },
        { status: 429 },
      );
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const { name, email, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Validated successfully but delivery isn't configured yet — succeed honestly.
    return NextResponse.json({ ok: true, delivered: false }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject: `Portfolio message from ${name ?? email}`,
      text: `From: ${name ?? "(no name)"} <${email}>\n\n${message}`,
    });
    if (error) {
      return NextResponse.json({ ok: false, error: "Delivery failed. Try again later." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "Delivery failed. Try again later." }, { status: 502 });
  }
}
