"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Copy } from "@/content";
import s from "./home.module.css";

const HOT = /^(voelt|gevoel|ressent|sentiment|feel|feels|feeling)/i;

/**
 * The chrome object IS the feeling: it fills the screen out of focus,
 * then sharpens, spins and steps aside — only then do the words become legible.
 */
export default function Manifesto({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const words = copy.home.manifesto.split(/\s+/);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const ws = q(`.${s.w}`);
      const R = gsap.utils.random;
      const obj = q(`.${s.mobj}:not(.${s.echo})`);
      const echo = q(`.${s.echo}`);
      const feel = q(`.${s.feel}`);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 1.2, anticipatePin: 1 },
      });
      tl.fromTo(obj, { scale: 3.4, rotate: -50, xPercent: -50, yPercent: -50, filter: "blur(22px) saturate(1.6)" },
        { scale: 2.2, rotate: 40, filter: "blur(10px) saturate(1.4)", duration: 3, ease: "power2.inOut" }, 0)
        .fromTo(echo, { scale: 4.5, rotate: 60, xPercent: -50, yPercent: -50 }, { scale: 2.8, rotate: -80, duration: 3, ease: "power2.inOut" }, 0)
        .fromTo(feel, { scale: 0.4, opacity: 0 }, { scale: 2.2, opacity: 1, duration: 2.5, ease: "power2.out" }, 0)
        .to(feel, { scale: 1.6, opacity: 0.75, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 1 }, 2.5)
        .to(obj, { scale: 1, rotate: 400, x: "26vw", filter: "blur(0px) saturate(1.1)", duration: 4, ease: "expo.inOut" }, 3)
        .to(echo, { scale: 1.3, rotate: 300, x: "26vw", opacity: 0, duration: 4, ease: "expo.inOut" }, 3)
        .to(feel, { scale: 1, x: "26vw", opacity: 0.55, duration: 4, ease: "expo.inOut" }, 3)
        .fromTo(ws,
          { x: () => R(-30, 30) + "vw", y: () => R(-30, 30) + "vh", rotate: () => R(-20, 20), scale: 1.8, opacity: 0, filter: "blur(24px)", color: "#e4ff2e" },
          { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 3.5, ease: "expo.inOut", stagger: { each: 0.1, from: "random" } }, 4.2)
        .to(ws, { filter: "blur(0px)", color: "#ffffff", duration: 2, ease: "power3.inOut", stagger: { each: 0.04, from: "start" } }, 7)
        .to(q(`.${s.w}[data-hot]`), { color: "#e4ff2e", duration: 0.8 }, 8.6)
        .to(q(`.${s.after}`), { opacity: 1, y: -6, duration: 1 }, 9)
        .to(obj, { rotate: 430, y: -20, duration: 2, ease: "sine.inOut" }, 8);
    },
    { scope: root, dependencies: [copy.lang] }
  );

  return (
    <section ref={root} className={s.manifesto} aria-label="Manifesto">
      <div className={s.feel} aria-hidden="true" />
      <div className={`${s.mobj} ${s.echo}`} aria-hidden="true">
        <Image src="/assets/object.webp" alt="" width={624} height={670} />
      </div>
      <div className={s.mobj} aria-hidden="true">
        <Image src="/assets/object.webp" alt="" width={624} height={670} />
      </div>
      <span className={`eyebrow ${s.eyebrow}`}>Manifesto</span>
      <p className={s.mani}>
        {words.map((w, i) => (
          <span key={i}>
            <span className={s.w} data-hot={HOT.test(w) ? "" : undefined}>{w}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
      <span className={s.after}>{copy.home.manifestoAfter}</span>
    </section>
  );
}
