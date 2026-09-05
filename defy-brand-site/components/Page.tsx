"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CONTACT_EMAIL, type Copy, type Service } from "@/content";
import { Reveal } from "./Sections";
import p from "./page.module.css";

/** Sub-page hero with masked line reveal + drifting chrome object. */
export function PageHero({ num, label, title, sub, obj = true }: { num?: string; label?: string; title: string; sub?: string; obj?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const lines = splitLines(title);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(`.${p.ph1} .${p.ln} > span`), { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out", delay: 0.2 });
      gsap.from(q(`.${p.psub}, .${p.pnum}`), { opacity: 0, y: 16, duration: 1, stagger: 0.1, ease: "expo.out", delay: 0.6 });
      if (obj) {
        gsap.from(q(`.${p.pobj}`), { scale: 0.6, opacity: 0, rotate: -40, duration: 1.8, ease: "expo.out", delay: 0.3 });
        gsap.to(q(`.${p.pobj}`), { y: -24, rotate: 8, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
        gsap.to(q(`.${p.pobj}`), { yPercent: 40, scale: 1.2, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.5 } });
      }
    },
    { scope: root }
  );
  return (
    <header ref={root} className={p.phero}>
      <div className={p.pglow} aria-hidden="true" />
      {obj && (
        <div className={p.pobj} aria-hidden="true">
          <Image src="/assets/object.webp" alt="" width={624} height={670} priority />
        </div>
      )}
      {num && (
        <div className={p.pnum}>
          <b>#</b>
          {num}
          {label && <span>{label}</span>}
        </div>
      )}
      <h1 className={p.ph1}>
        {lines.map((l, i) => (
          <span className={p.ln} key={i}>
            <span>{l}</span>
          </span>
        ))}
      </h1>
      {sub && <p className={p.psub}>{sub}</p>}
    </header>
  );
}

/** Break a headline into lines at sentence boundaries so each line can be masked. */
function splitLines(t: string): string[] {
  const parts = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.length > 1 ? parts : [t];
}

export function ServiceBody({ service, copy, next }: { service: Service; copy: Copy; next: Service }) {
  const sv = service;
  return (
    <>
      <section className={p.intro}>
        <span className="eyebrow">{sv.name}</span>
        <div>
          {sv.intro.map((t, i) => (
            <Reveal key={i} as="p" className={p.lead} delay={i * 0.1}>
              {t}
            </Reveal>
          ))}
        </div>
      </section>

      {sv.list && (
        <section className={p.list} aria-label={sv.listTitle}>
          <span className="eyebrow">{sv.listTitle}</span>
          <ol style={{ marginTop: "1.5em" }}>
            {sv.list.map((t, i) => (
              <Reveal key={i} as="li" delay={i * 0.05}>
                {t}
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {sv.steps && <Steps steps={sv.steps} />}

      <section className={p.blocks}>
        <Reveal as="h2">{sv.blocksTitle}</Reveal>
        <div className={p.grid}>
          {sv.blocks.map((b, i) => (
            <Reveal key={b.h} className={p.block} delay={(i % 3) * 0.08}>
              <h3>{b.h}</h3>
              <p>{b.p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {sv.honest && (
        <section className={p.honest}>
          <Reveal as="h2">{sv.honest.h}</Reveal>
          <Reveal as="p" delay={0.1}>
            {sv.honest.p}
          </Reveal>
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
