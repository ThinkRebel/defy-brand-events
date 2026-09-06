"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, COMPANY, type Copy } from "@/content";
import Ribbon from "./Ribbon";
import s from "./home.module.css";

const WALL = ["Defy", "Brand", "Events"];

export default function Hero({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const lang = copy.lang;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      // load sequence
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(q(`.${s.bg}`), { scale: 1.25, opacity: 0, duration: 2.4, ease: "power2.out" }, 0)
        .from(q(`.${s.eyebrowRow}`), { opacity: 0, y: -10, duration: 1 }, 0.4)
        .from(q(`.${s.ln} > span`), { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.3)
        .from(q(`.${s.intro}, .${s.idx} a`), { opacity: 0, y: 20, duration: 1, stagger: 0.05 }, 1.1)
        .from(q(`.${s.markLg}`), { rotate: -225, opacity: 0, duration: 1.4 }, 1);

      // ambient
      gsap.to(q(`.${s.glow}`), { scale: 1.25, x: 40, y: -30, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(q(`.${s.markLg}`), { rotate: 315, duration: 40, repeat: -1, ease: "none" });

      // scroll-out: the name lifts, the ribbon sinks (parallax), the object slot grows for the flow object
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 };
      gsap.to(q(`.${s.wall}`), { yPercent: -18, opacity: 0.25, scrollTrigger: st });
      // photo and veil move as one, so the fade-out stays on the photo while it runs on below the hero
      gsap.to(q(`.${s.bg}, .${s.veil}`), { yPercent: 22, scale: 1.08, scrollTrigger: st });
      gsap.to(q(`.${s.obj}`), { yPercent: 40, scale: 1.9, scrollTrigger: { ...st, scrub: 1.2 } });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.hero} id="top">
      <Ribbon className={s.bg} />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.glow} aria-hidden="true" />
      <div className={s.obj} data-flow="hero" aria-hidden="true" />

      <div className={s.eyebrowRow}>
        <span><b>THINKREBEL</b> · {COMPANY.city}</span>
        <span>09 · {copy.nav.services}</span>
      </div>

      <h1 className={s.wall} aria-label="Defy & Brand Events">
        {WALL.map((w, i) => (
          <span className={s.ln} key={w}>
            <span>{w}</span>
            {i === 2 && <Image className={s.markLg} src="/assets/mark-fluo.svg" alt="" width={110} height={110} aria-hidden="true" />}
          </span>
        ))}
      </h1>

      <div className={s.foot}>
        <p className={s.intro}>
          <strong>{copy.home.heroLead}</strong>
          <span>{copy.home.heroIntro}</span>
          <Link className={`arrow-link ${s.cta}`} href={href(lang, "contact")}>
            {copy.home.heroCta}
          </Link>
        </p>
        <nav className={s.idx} aria-label={copy.nav.services}>
          {copy.services.map((sv) => (
            <Link key={sv.slug} href={href(lang, "services", sv.slug)}>
              <span className={s.n}>
                <b>#</b>
                {sv.num}
              </span>
              <span className={s.l}>{sv.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
