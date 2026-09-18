import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const form = await request.formData();
  const fields = Object.fromEntries(["name", "organization", "email", "subject", "message"].map((key) => [key, String(form.get(key) || "").trim()]));
  if (Object.values(fields).some((value) => !value)) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) return NextResponse.json({ error: "mail_not_configured" }, { status: 503 });
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL || "AI Accelerator <onboarding@resend.dev>", to: [process.env.CONTACT_TO_EMAIL], reply_to: fields.email, subject: `[AI 가속기 문의] ${fields.subject}`, text: `이름: ${fields.name}\n소속: ${fields.organization}\n이메일: ${fields.email}\n\n${fields.message}` }) });
  if (!response.ok) return NextResponse.json({ error: "mail_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
