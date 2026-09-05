"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, type Copy } from "@/content";
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
      tl.from(q(`.${s.bg}`), { scale: 1.9, rotate: -80, opacity: 0, duration: 2.2, ease: "power2.out" }, 0)
        .from(q(`.${s.ln} > span`), { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.3)
        .from(q(`.${s.obj}`), { scale: 0.6, opacity: 0, rotate: -30, duration: 1.8 }, 0.5)
        .from(q(`.${s.intro}, .${s.idx} a`), { opacity: 0, y: 20, duration: 1, stagger: 0.05 }, 1.1)
        .from(q(`.${s.markLg}`), { rotate: -225, opacity: 0, duration: 1.4 }, 1);

      // ambient
      gsap.to(q(`.${s.obj}`), { y: "-=26", rotate: 6, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
      gsap.to(q(`.${s.glow}`), { scale: 1.25, x: 40, y: -30, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(q(`.${s.markLg}`), { rotate: 315, duration: 40, repeat: -1, ease: "none" });

      // pointer parallax
      const qx = gsap.quickTo(q(`.${s.obj}`), "x", { duration: 1.2, ease: "power3" });
      const qy = gsap.quickTo(q(`.${s.obj}`), "y", { duration: 1.2, ease: "power3" });
      const bx = gsap.quickTo(q(`.${s.bg}`), "x", { duration: 2, ease: "power3" });
      const by = gsap.quickTo(q(`.${s.bg}`), "y", { duration: 2, ease: "power3" });
      const move = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        qx(nx * 60);
        qy(ny * 40);
        bx(nx * -40);
        by(ny * -30);
      };
      window.addEventListener("pointermove", move);

      // scroll-out: words drift apart
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 };
      gsap.to(q(`.${s.ln}:nth-child(1) > span`), { xPercent: -25, scrollTrigger: st });
      gsap.to(q(`.${s.ln}:nth-child(2) > span`), { xPercent: 20, scrollTrigger: st });
      gsap.to(q(`.${s.ln}:nth-child(3) > span`), { xPercent: -12, opacity: 0.2, scrollTrigger: st });
      gsap.to(q(`.${s.obj}`), { yPercent: 60, scale: 1.15, scrollTrigger: { ...st, scrub: 1.5 } });

      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.hero} id="top">
      <div className={s.bg} aria-hidden="true" />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.glow} aria-hidden="true" />
      <div className={s.obj} aria-hidden="true">
        <Image src="/assets/object.webp" alt="" width={624} height={670} priority />
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
