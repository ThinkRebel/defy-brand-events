"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Copy } from "@/content";
import s from "./home.module.css";

const HOT = /^(voelt|gevoel|ressent|sentiment|feel|feels|feeling)/i;

/**
 * Manifesto — "you feel it before you understand it".
 * The chrome object stays sharp and human-sized on the right; it turns with the scroll,
 * a fluo light breathes behind it. The words arrive as soft, out-of-focus shapes and
 * snap into focus one by one. Pinned for ~1.6 screens.
 */
export default function Manifesto({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const words = copy.home.manifesto.split(/\s+/);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const ws = q(`.${s.w}`);
      const obj = q(`.${s.mobj}`);
      const feel = q(`.${s.feel}`);
      const R = gsap.utils.random;

      // take over the CSS translateY(-50%) so GSAP transforms don't fight it
      gsap.set([obj, feel], { yPercent: -50, y: 0 });

      // ambient: object floats, light breathes (independent of scroll)
      gsap.to(obj, { y: -22, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(feel, { scale: 1.25, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // pointer parallax on the object
      const px = gsap.quickTo(obj, "x", { duration: 1.4, ease: "power3" });
      const move = (e: PointerEvent) => px((e.clientX / innerWidth - 0.5) * 40);
      window.addEventListener("pointermove", move);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", pin: true, scrub: 1, anticipatePin: 1 },
      });
      tl
        // object turns a half-turn over the whole section and settles slightly larger
        .fromTo(obj, { rotate: -30, scale: 0.9 }, { rotate: 150, scale: 1.08, duration: 10, ease: "none" }, 0)
        .fromTo(feel, { opacity: 0.35 }, { opacity: 0.9, duration: 10, ease: "none" }, 0)
        // words: soft shapes → sharp text
        .fromTo(
          ws,
          { y: () => R(30, 80), x: () => R(-30, 30), opacity: 0, filter: "blur(14px)", color: "#e4ff2e" },
          { y: 0, x: 0, opacity: 1, duration: 3, ease: "expo.out", stagger: { each: 0.35, from: "start" } },
          0.6
        )
        .to(ws, { filter: "blur(0px)", color: "#ffffff", duration: 1.6, ease: "power3.inOut", stagger: { each: 0.25, from: "start" } }, 1.4)
        .to(q(`.${s.w}[data-hot]`), { color: "#e4ff2e", duration: 0.8 }, 6.5)
        .fromTo(q(`.${s.after}`), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.2 }, 7.5);

      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root, dependencies: [copy.lang] }
  );

  return (
    <section ref={root} className={s.manifesto} aria-label="Manifesto">
      <div className={s.feel} aria-hidden="true" />
      <div className={s.mobj} data-flow="manifesto" aria-hidden="true" />
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
