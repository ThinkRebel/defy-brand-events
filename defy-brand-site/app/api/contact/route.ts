import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/content";

/**
 * Contact endpoint. Sends the form to marketing@ through Resend (RESEND_API_KEY in Vercel env).
 * Optional: CONTACT_FROM (a verified sender on Resend), CONTACT_TO (defaults to CONTACT_EMAIL),
 * CONTACT_WEBHOOK_URL (any JSON webhook, used when no Resend key is set).
 * Without either configured it returns 501 so the form falls back to mailto:.
 */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.contact || !body.message) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  const name = String(body.name).slice(0, 200), contact = String(body.contact).slice(0, 200), message = String(body.message).slice(0, 5000);
  const service = body.service ? String(body.service).slice(0, 100) : "";
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const to = process.env.CONTACT_TO || CONTACT_EMAIL;
    const from = process.env.CONTACT_FROM || "DB Events website <onboarding@resend.dev>";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from, to: [to], ...(isEmail ? { reply_to: contact } : {}),
        subject: `Nieuwe aanvraag via defyandbrandevents.be — ${name}${service ? ` (${service})` : ""}`,
        text: `Naam: ${name}\nContact: ${contact}\nDienst: ${service || "-"}\n\n${message}`,
        html: `<p><b>Naam:</b> ${esc(name)}<br><b>Contact:</b> ${esc(contact)}<br><b>Dienst:</b> ${esc(service || "-")}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });
    if (!r.ok) console.error("resend", r.status, await r.text().catch(() => ""));
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
  }
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, error: "not configured" }, { status: 501 });
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, contact, service, message, receivedAt: new Date().toISOString() }) });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
