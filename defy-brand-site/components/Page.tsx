"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CONTACT_EMAIL, type Copy, type Service, type Lang } from "@/content";
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

export function PageHero({ num, label, title, sub, obj = true, scene, lang = "nl", variant = 0 }: { num?: string; label?: string; title: string; sub?: string; obj?: boolean; scene?: string; lang?: Lang; variant?: number }) {
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

export function ContactForm({ copy }: { copy: Copy }) {
  const c = copy.contact;
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const body = {
      name: String(data.get("name") || ""),
      contact: String(data.get("contact") || ""),
      message: String(data.get("message") || ""),
      lang: copy.lang,
    };
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error("bad");
      setSent(true);
    } catch {
      // graceful fallback: open the mail client with the message prefilled
      const subject = encodeURIComponent(`Idee van ${body.name}`);
      const text = encodeURIComponent(`${body.message}\n\n— ${body.name} (${body.contact})`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${text}`;
    } finally {
      setBusy(false);
    }
  }

  if (sent) return <p className={p.confirm}>{c.confirm}</p>;

  return (
    <form className={p.form} onSubmit={onSubmit}>
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
