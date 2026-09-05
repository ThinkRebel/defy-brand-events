import { NextResponse } from "next/server";

/**
 * Contact endpoint. Wire this to your mail provider (Resend, Postmark, SendGrid…)
 * by setting CONTACT_WEBHOOK_URL, or replace the fetch below with the provider SDK.
 * Without a webhook configured it returns 501 so the form falls back to mailto:.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.contact || !body.message) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, error: "not configured" }, { status: 501 });
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }) });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
