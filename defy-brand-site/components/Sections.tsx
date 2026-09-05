"use client";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, type Copy } from "@/content";
import s from "./home.module.css";
import Typewriter from "./Typewriter";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Scroll-reveal wrapper (Framer Motion) — from a visible-ish resting state, never parked invisible for long. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "p" | "h2" | "h3" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

export function Statement({ copy }: { copy: Copy }) {
  const [h, p] = copy.home.statement;
  return (
    <section className={s.statement}>
      <div>
        <Reveal as="h2">{h}</Reveal>
        <Reveal as="p" delay={0.15}>{p}</Reveal>
      </div>
      <div className={s.stSlot} data-flow="statement" aria-hidden="true" />
    </section>
  );
}

/** AN IDEA → BECOMES A BRAND → AN EXPERIENCE → ACTION — masked line reveals */
export function Chain({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      q(`.${s.pillar}`).forEach((p, i) => {
        gsap.from(p.querySelector("h3 span"), { yPercent: 105, duration: 1.2, ease: "expo.out", delay: i * 0.1, scrollTrigger: { trigger: p, start: "top 80%" } });
        gsap.from(p.querySelector("p"), { opacity: 0, y: 20, duration: 1, delay: 0.2 + i * 0.1, scrollTrigger: { trigger: p, start: "top 75%" } });
      });
      gsap.from(q(`.${s.chainNote}`), { opacity: 0, y: 24, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: q(`.${s.chainNote}`)[0], start: "top 85%" } });
    },
    { scope: root }
  );
  return (
    <section ref={root} className={s.chain} aria-label={copy.home.chainEyebrow}>
      <span className={`eyebrow ${s.eyebrow}`}>{copy.home.chainEyebrow}</span>
      {copy.home.chain.map((c) => (
        <div key={c.h} className={s.pillar}>
          <h3>
            <span>{c.h}</span>
          </h3>
          <p>{c.p}</p>
        </div>
      ))}
      <p className={s.chainNote}>{copy.home.chainNote}</p>
    </section>
  );
}

export function AboutTeaser({ copy }: { copy: Copy }) {
  const a = copy.about;
  const [first, ...rest] = a.h.split(". ");
  return (
    <section className={s.about} aria-label={a.eyebrow}>
      <div>
        <span className="eyebrow">{a.eyebrow}</span>
        <Reveal as="h2">
          {first}.
          <br />
          <em>{rest.join(". ")}</em>
        </Reveal>
        <Reveal as="p" className={s.aboutP} delay={0.1}>
          {a.why.join(" ")}
        </Reveal>
        <Reveal delay={0.2}>
          <Link className={`arrow-link ${s.cta}`} href={href(copy.lang, "about")}>
            {a.cta}
          </Link>
        </Reveal>
      </div>
      <Typewriter className={s.verbs} lines={a.verbs} lastClass={s.hi} />
    </section>
  );
}

/** Contact CTA with halo that follows scroll + pointer, magnetic button */
export function Closer({ copy, h, p, cta }: { copy: Copy; h: string; p?: string; cta: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const halo = q(`.${s.halo}`);
      gsap.to(halo, { scale: 1.4, yPercent: -20, scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      const hx = gsap.quickTo(halo, "x", { duration: 2, ease: "power2" });
      const hy = gsap.quickTo(halo, "y", { duration: 2, ease: "power2" });
      const move = (e: PointerEvent) => {
        hx((e.clientX / innerWidth - 0.5) * 300);
        hy((e.clientY / innerHeight - 0.5) * 200);
      };
      window.addEventListener("pointermove", move);
      const btn = q(".btn")[0] as HTMLElement;
      const mag = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3" });
      };
      const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,.4)" });
      btn.addEventListener("pointermove", mag);
      btn.addEventListener("pointerleave", leave);
      gsap.from(q("h2"), { scale: 0.9, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 60%" } });
      return () => {
        window.removeEventListener("pointermove", move);
        btn.removeEventListener("pointermove", mag);
        btn.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root }
  );
  return (
    <section ref={root} className={s.closer} id="contact">
      <div className={s.halo} aria-hidden="true" />
      <div>
        <h2>{h}</h2>
        {p && <p>{p}</p>}
        <Link className="btn" href={href(copy.lang, "contact")}>
          <i />
          <span>{cta}</span>
        </Link>
      </div>
    </section>
  );
}
