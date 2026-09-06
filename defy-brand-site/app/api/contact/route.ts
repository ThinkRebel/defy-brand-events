import { NextResponse } from "next/server";
import { CONTACT_EMAIL, COMPANY, SITE_URL, isLang, type Lang } from "@/content";

/**
 * Contact endpoint — two mails through Resend (RESEND_API_KEY, or DB_events_mail as the key is named in Vercel):
 *   1. internal, to marketing@ (CONTACT_TO): subject tagged [Website] so it can be filtered, reply-to = the sender
 *   2. confirmation, to the sender, in the language of the page (nl/fr/en), signed — only when they left an e-mail
 * Optional env: CONTACT_FROM (a verified sender on Resend), CONTACT_TO, CONTACT_WEBHOOK_URL (any JSON webhook,
 * used when no Resend key is set). Without either configured it returns 501 so the form falls back to mailto:.
 */

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const TAG = "[Website]";

/** who signs the confirmation */
const SIGNER = { name: "Njusja Orban", role: "Defy & Brand Events" };

const T: Record<Lang, { subject: string; hi: string; body: string; sent: string; subjectLabel: string; talk: string; bye: string }> = {
  nl: {
    subject: "Goed ontvangen — Defy & Brand Events",
    hi: "Dag",
    body: "Je bericht is aangekomen. We lezen het écht, en je hoort binnen twee werkdagen van een mens — niet van een autoresponder.",
    sent: "Dit stuurde je ons",
    subjectLabel: "Onderwerp",
    talk: "Liever meteen praten? Bel",
    bye: "Tot snel,",
  },
  fr: {
    subject: "Bien reçu — Defy & Brand Events",
    hi: "Bonjour",
    body: "Votre message est bien arrivé. Nous le lisons vraiment, et un humain vous répond sous deux jours ouvrables — pas un répondeur automatique.",
    sent: "Ce que vous nous avez envoyé",
    subjectLabel: "Sujet",
    talk: "Vous préférez parler tout de suite ? Appelez le",
    bye: "À très vite,",
  },
  en: {
    subject: "Received — Defy & Brand Events",
    hi: "Hi",
    body: "Your message has arrived. We actually read it, and you'll hear from a human within two working days — not an autoresponder.",
    sent: "What you sent us",
    subjectLabel: "Subject",
    talk: "Rather talk right now? Call",
    bye: "Speak soon,",
  },
};

const host = SITE_URL.replace(/^https?:\/\//, "");
const tel = COMPANY.phone.replace(/\s/g, "");
const signatureText = () => `${SIGNER.name}\n${SIGNER.role}\n${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}\n${COMPANY.phoneDisplay} · ${CONTACT_EMAIL}\n${host}`;
const signatureHtml = () =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;border-left:3px solid #e4ff2e;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#111"><tr><td style="padding:2px 0 2px 14px"><b>${esc(SIGNER.name)}</b><br>${esc(SIGNER.role)}<br><span style="color:#555">${esc(COMPANY.street)}, ${COMPANY.postalCode} ${esc(COMPANY.city)}</span><br><a href="tel:${tel}" style="color:#111;text-decoration:none">${COMPANY.phoneDisplay}</a> · <a href="mailto:${CONTACT_EMAIL}" style="color:#111;text-decoration:none">${CONTACT_EMAIL}</a><br><a href="${SITE_URL}" style="color:#111">${host}</a></td></tr></table>`;

async function send(key: string, payload: Record<string, unknown>) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) console.error("resend", r.status, await r.text().catch(() => ""));
  return r.ok;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.name || !body.contact || !body.message) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }
  const name = String(body.name).slice(0, 200).trim();
  const contact = String(body.contact).slice(0, 200).trim();
  const message = String(body.message).slice(0, 5000).trim();
  const service = body.service ? String(body.service).slice(0, 100) : "";
  const lang: Lang = isLang(String(body.lang || "")) ? (body.lang as Lang) : "nl";

  const key = process.env.RESEND_API_KEY || process.env.DB_events_mail;
  if (key) {
    const to = process.env.CONTACT_TO || CONTACT_EMAIL;
    const from = process.env.CONTACT_FROM || `Defy & Brand Events <${CONTACT_EMAIL}>`;
    const mail = isEmail(contact);

    // 1. internal — the lead itself; if this fails the form falls back to mailto:
    const ok = await send(key, {
      from,
      to: [to],
      ...(mail ? { reply_to: contact } : {}),
      subject: `${TAG} Nieuwe aanvraag — ${name}${service ? ` (${service})` : ""}`,
      text: `Naam: ${name}\nContact: ${contact}\nDienst: ${service || "-"}\nTaal: ${lang}\n\n${message}`,
      html: `<p><b>Naam:</b> ${esc(name)}<br><b>Contact:</b> ${esc(contact)}<br><b>Dienst:</b> ${esc(service || "-")}<br><b>Taal:</b> ${lang}</p><p>${nl2br(message)}</p>`,
      tags: [{ name: "source", value: "website" }],
    });
    if (!ok) return NextResponse.json({ ok: false }, { status: 502 });

    // 2. confirmation to the sender — never blocks the lead
    if (mail) {
      const t = T[lang];
      const quote = `${service ? `${t.subjectLabel}: ${service}\n` : ""}${message}`;
      await send(key, {
        from,
        to: [contact],
        reply_to: to,
        subject: t.subject,
        text: `${t.hi} ${name},\n\n${t.body}\n\n${t.sent}:\n${quote}\n\n${t.talk} ${COMPANY.phoneDisplay}.\n\n${t.bye}\n${signatureText()}`,
        html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#111;max-width:560px"><p>${t.hi} ${esc(name)},</p><p>${esc(t.body)}</p><p style="margin:22px 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#555">${esc(t.sent)}</p><blockquote style="margin:0;padding:12px 16px;background:#f4f4f2;border-radius:10px">${service ? `<b>${esc(t.subjectLabel)}:</b> ${esc(service)}<br>` : ""}${nl2br(message)}</blockquote><p>${esc(t.talk)} <a href="tel:${tel}" style="color:#111">${COMPANY.phoneDisplay}</a>.</p><p>${esc(t.bye)}</p>${signatureHtml()}</div>`,
        tags: [{ name: "source", value: "website-confirmation" }],
      });
    }
    return NextResponse.json({ ok: true, confirmed: mail });
  }

  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, error: "not configured" }, { status: 501 });
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, contact, service, message, lang, receivedAt: new Date().toISOString() }) });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
}
