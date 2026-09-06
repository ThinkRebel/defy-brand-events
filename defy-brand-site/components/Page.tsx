"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CONTACT_EMAIL, COMPANY, href, type Copy, type Service, type Lang } from "@/content";
import { MiniRing } from "./Rings";
import { Reveal } from "./Sections";
import TiltCard from "./TiltCard";
import { ServiceScene, ServiceFeature } from "./Visuals";
import { CompassSprite, HelixSprite, AgentSprite } from "./Props";
import Kinetic from "./Kinetic";
import Deck from "./Deck";
import FlowObject from "./FlowObject";
import SocialWall from "./SocialWall";
import p from "./page.module.css";

/** Sub-page hero with masked line reveal + drifting chrome object. */
const BAND = new Set(["copywriting"]);
const HANDOVER = new Set(["marketing", "seo", "agentic-workflow"]);
/** pages that keep the chrome object itself as hero prop (none right now: strategy got the king, see Visuals) */
const PLAIN = new Set<string>();

export function PageHero({ num, label, title, sub, obj = true, scene: sceneIn, lang = "nl", variant = 0 }: { num?: string; label?: string; title: string; sub?: string; obj?: boolean; scene?: string; lang?: Lang; variant?: number }) {
  const scene = sceneIn && PLAIN.has(sceneIn) ? undefined : sceneIn;
  const root = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(`.${p.psub}, .${p.pnum}`), { opacity: 0, y: 16, duration: 1, stagger: 0.1, ease: "expo.out", delay: 0.6 });
      if (obj) {
        if (!(scene && HANDOVER.has(scene))) gsap.from(q(`.${p.pobj}`), { scale: 0.6, opacity: 0, rotate: -40, duration: 1.8, ease: "expo.out", delay: 0.3 });
        gsap.to(q(`.${p.pobj}`), { y: -24, rotate: 8, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
        gsap.to(q(`.${p.pobj}`), { yPercent: 40, scale: 1.2, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.5 } });
      }
    },
    { scope: root }
  );
  return (
    <header ref={root} className={`${p.phero} ${p["v" + variant]} ${obj && scene && !BAND.has(scene) ? p.hasScene : ""}`}>
      <div className={p.pglow} aria-hidden="true" />
      {obj && !scene && (
        <div className={p.pobj} aria-hidden="true">
          <Image src="/assets/object.webp" alt="" width={624} height={670} priority />
        </div>
      )}
      {obj && scene && !BAND.has(scene) && (
        <div className={`${p.pobj} ${p.pscene} ${scene === "marketing" ? p.pdna : ""}`} aria-hidden="true">
          <ServiceScene slug={scene} lang={lang} slotRef={slotRef} />
          {HANDOVER.has(scene) && <div ref={slotRef} className={p.pslot} data-flow="hero" style={{ ["--reveal" as string]: scene === "marketing" ? 1 : 0 }} />}
        </div>
      )}
      {obj && scene && BAND.has(scene) && (
        <div className={p.pband} aria-hidden="true">
          <ServiceScene slug={scene} lang={lang} />
        </div>
      )}
      {num && (
        <div className={p.pnum}>
          <b>#</b>
          {num}
          {label && <span>{label}</span>}
        </div>
      )}
      <Kinetic as="h1" text={title} mode={variant === 1 ? "flip" : "slide"} start="top 95%" delay={0.2} className={`${p.ph1} ${title.length > 70 ? p.long : ""}`} />
      {sub && <p className={p.psub}>{sub}</p>}
    </header>
  );
}

export function ServiceBody({ service, copy, next, index = 0 }: { service: Service; copy: Copy; next: Service; index?: number }) {
  const sv = service;
  return (
    <>
      <section className={`${p.intro} ${index % 2 ? p.introFlip : ""}`}>
        <div className={p.introSide}>
          <span className="eyebrow">{sv.name}</span>
          <div className={p.introObj} data-flow="intro" aria-hidden="true" />
        </div>
        <div>
          {sv.intro.map((t, i) => (
            <Reveal key={i} as="p" className={p.lead} delay={i * 0.1}>
              {t}
            </Reveal>
          ))}
        </div>
      </section>

      <ServiceFeature slug={sv.slug} lang={copy.lang} />
      <FlowObject>{sv.slug === "seo" ? <CompassSprite /> : sv.slug === "marketing" ? <HelixSprite /> : sv.slug === "agentic-workflow" ? <AgentSprite /> : undefined}</FlowObject>

      {sv.list && (
        <section className={p.list} aria-label={sv.listTitle}>
          <span className="eyebrow">{sv.listTitle}</span>
          <ol className={p.listRow}>
            {sv.list.map((t, i) => (
              <li key={i}>
                <TiltCard delay={i * 0.06} from="up"><span className={p.listNum}>{String(i + 1).padStart(2, "0")}</span><p>{t}</p></TiltCard>
              </li>
            ))}
          </ol>
        </section>
      )}

      {sv.steps && <Steps steps={sv.steps} />}

      <Deck copy={copy} eyebrow={sv.blocksTitle} items={sv.blocks} flow={`svc-${sv.slug}`} />

      {sv.slug === "marketing" && <SocialWall eyebrow={sv.name} title={copy.lang === "fr" ? "Des canaux que nous gérons comme des marques" : copy.lang === "en" ? "Channels we run like brands" : "Kanalen die we runnen als merken"} />}

      {sv.product && (
        <section className={p.product}>
          <TiltCard from="left">
            <span className="eyebrow">DB Events product</span>
            <h2>{sv.product.h}</h2>
            <p>{sv.product.p}</p>
            <a className="arrow-link" href={sv.product.url} target="_blank" rel="noopener">{sv.product.cta}</a>
          </TiltCard>
        </section>
      )}

      {sv.honest && (
        <section className={p.honest}>
          <Reveal as="h2">{sv.honest.h}</Reveal>
          <TiltCard delay={0.1} from="right"><p>{sv.honest.p}</p></TiltCard>
        </section>
      )}

      <div className={p.next}>
        <span className="eyebrow">{copy.nav.services}</span>
        <a href={`/${copy.lang}/${copy.routes.services}/${next.slug}`}>
          <b>#{next.num}</b>
          {next.name} →
        </a>
      </div>
    </>
  );
}

function Steps({ steps }: { steps: { k: string; p: string }[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const els = q(`.${p.step}`);
      gsap.from(els, {
        opacity: 0, y: 24, duration: 0.9, stagger: 0.12, ease: "expo.out",
        scrollTrigger: {
          trigger: root.current, start: "top 75%", once: true,
          onEnter: () => els.forEach((el, i) => setTimeout(() => el.classList.add(p.on), 200 + i * 180)),
        },
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className={p.steps} aria-label="Trigger. Think. Decide. Act. Measure. Improve.">
      {steps.map((st) => (
        <div key={st.k} className={p.step}>
          <h3>{st.k}</h3>
          <p>{st.p}</p>
        </div>
      ))}
    </section>
  );
}

/** Contact: pick a service in the ring (it becomes the subject), then the form + the direct details. */
export function ContactPicker({ copy }: { copy: Copy }) {
  const c = copy.contact;
  const [service, setService] = useState("");
  const items = copy.services.map((sv) => ({ h: sv.name, p: sv.role.charAt(0).toUpperCase() + sv.role.slice(1) + ".", num: sv.num }));
  const pick = (it: { h: string }) => {
    setService(service === it.h ? "" : it.h);
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      <section className={p.pick}>
        <div className={p.pickHead}>
          <span className="eyebrow">{c.pickEyebrow}</span>
          <Kinetic as="h2" text={c.pickH} mode="slide" className={p.ph1} />
          <p className={p.pickP}>{c.pickP}</p>
        </div>
        <MiniRing items={items} slot onPick={pick} active={service} />
        <div className={p.chips} role="group" aria-label={c.subject}>
          {items.map((it) => (
            <button key={it.h} type="button" className={`${p.chip} ${service === it.h ? p.chipOn : ""}`} onClick={() => pick(it)} aria-pressed={service === it.h} data-cursor>
              <b>#{it.num}</b> {it.h}
            </button>
          ))}
        </div>
      </section>
      <section className={p.contact} id="form">
        <div>
          <span className="eyebrow">{copy.nav.contact}</span>
          <Kinetic as="h2" text={c.h} mode="flip" className={p.ph1} />
          <ul className={p.lines}>
            {c.lines.map((l, i) => (
              <Reveal key={i} as="li" delay={0.3 + i * 0.1}>{l}</Reveal>
            ))}
          </ul>
          <div className={p.details}>
            <span className="eyebrow">{c.detailsH}</span>
            <a href={`mailto:${CONTACT_EMAIL}`}><small>{c.mail}</small>{CONTACT_EMAIL}</a>
            <a href={`tel:${COMPANY.phone}`}><small>{c.phone}</small>{COMPANY.phoneDisplay}</a>
            <span><small>{c.visit}</small>{COMPANY.street}, {COMPANY.postalCode} {COMPANY.city}</span>
          </div>
          <div className={p.introObj} data-flow="contact" aria-hidden="true" style={{ marginTop: "2em" }} />
        </div>
        <ContactForm copy={copy} service={service} onService={setService} />
      </section>
    </>
  );
}

const DONE: Record<Lang, { h: string; mailed: string; noMail: string; again: string; home: string }> = {
  nl: { h: "Verzonden.", mailed: "Er is net een bevestiging naar je mailbox vertrokken — kijk ook even bij ongewenste mail.", noMail: "Je liet een telefoonnummer achter: we bellen of sturen een berichtje.", again: "Nog een bericht", home: "Terug naar de startpagina" },
  fr: { h: "Envoyé.", mailed: "Une confirmation vient de partir vers votre boîte mail — vérifiez aussi les indésirables.", noMail: "Vous avez laissé un numéro : on vous appelle ou on vous écrit.", again: "Un autre message", home: "Retour à l'accueil" },
  en: { h: "Sent.", mailed: "A confirmation just left for your inbox — check your spam folder too.", noMail: "You left a phone number: we'll call or text you.", again: "Send another", home: "Back to the homepage" },
};

type Sent = { name: string; contact: string; service: string; confirmed: boolean };

export function ContactForm({ copy, service = "", onService }: { copy: Copy; service?: string; onService?: (s: string) => void }) {
  const c = copy.contact;
  const [sent, setSent] = useState<Sent | null>(null);
  const [busy, setBusy] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

  // the confirmation replaces the form in the same spot: bring it into view and focus it (screen readers announce it)
  useEffect(() => {
    if (!sent) return;
    doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    doneRef.current?.focus({ preventScroll: true });
  }, [sent]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const body = {
      name: String(data.get("name") || ""),
      contact: String(data.get("contact") || ""),
      service: String(data.get("service") || ""),
      message: String(data.get("message") || ""),
      lang: copy.lang,
    };
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("bad");
      const j = (await r.json().catch(() => ({}))) as { confirmed?: boolean };
      setSent({ name: body.name, contact: body.contact, service: body.service, confirmed: j.confirmed ?? /@/.test(body.contact) });
    } catch {
      // graceful fallback: open the mail client with the message prefilled
      const subject = encodeURIComponent(`${body.service || "Idee"} — ${body.name}`);
      const text = encodeURIComponent(`${body.message}\n\n— ${body.name} (${body.contact})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${text}`;
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    const d = DONE[copy.lang];
    return (
      <div ref={doneRef} className={p.done} role="status" aria-live="polite" tabIndex={-1}>
        <span className={p.doneMark} aria-hidden="true">✓</span>
        <h3>{d.h}</h3>
        <p className={p.confirm}>{c.confirm}</p>
        <dl className={p.doneSum}>
          <div><dt>{c.labels.who}</dt><dd>{sent.name}</dd></div>
          <div><dt>{c.labels.reach}</dt><dd>{sent.contact}</dd></div>
          {sent.service && <div><dt>{c.subject}</dt><dd>{sent.service}</dd></div>}
        </dl>
        <p className={p.doneNote}>{sent.confirmed ? d.mailed : d.noMail}</p>
        <div className={p.doneRow}>
          <button className="btn" type="button" onClick={() => setSent(null)}>
            <i />
            <span>{d.again}</span>
          </button>
          <a className="arrow-link" href={href(copy.lang, "home")}>{d.home}</a>
        </div>
      </div>
    );
  }

  return (
    <form className={p.form} onSubmit={onSubmit}>
      <div className={p.field}>
        <label htmlFor="service">{c.subject}</label>
        <select id="service" name="service" value={service} onChange={(e) => onService?.(e.target.value)}>
          <option value="">{c.other}</option>
          {copy.services.map((sv) => <option key={sv.slug} value={sv.name}>#{sv.num} {sv.name}</option>)}
        </select>
      </div>
      <div className={p.field}>
        <label htmlFor="name">{c.labels.who}</label>
        <input id="name" name="name" required autoComplete="name" />
      </div>
      <div className={p.field}>
        <label htmlFor="contact">{c.labels.reach}</label>
        <input id="contact" name="contact" required autoComplete="email" inputMode="email" />
      </div>
      <div className={p.field}>
        <label htmlFor="message">{c.labels.what}</label>
        <textarea id="message" name="message" required rows={5} />
      </div>
      <div className={p.send}>
        <button className="btn" type="submit" disabled={busy}>
          <i />
          <span>{c.labels.send}</span>
        </button>
        <span className={p.alt}>
          {c.alt} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </span>
      </div>
    </form>
  );
}
