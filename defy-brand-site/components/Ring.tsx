"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, type Copy } from "@/content";
import s from "./home.module.css";

/** Glass ring of the nine services — scroll rotates it, time keeps it drifting, pointer tilts it. */
export default function Ring({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const n = copy.services.length;

  useGSAP(
    () => {
      const ring = ringRef.current!;
      if (prefersReducedMotion()) {
        ring.style.transform = "rotateX(-14deg)";
        return;
      }
      const q = gsap.utils.selector(root);
      let scrollA = 0, driftA = 0, tiltX = -14, tiltZ = 0;

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=300%",
        pin: q(`.${s.pin}`)[0],
        scrub: 1,
        anticipatePin: 1,
        onUpdate(st) {
          scrollA = -st.progress * 540;
          if (progRef.current) progRef.current.style.width = st.progress * 100 + "%";
        },
      });

      const tilt = { x: -14, z: 0 };
      const tq = gsap.quickTo(tilt, "x", { duration: 1.5, ease: "power2", onUpdate: () => (tiltX = tilt.x) });
      const zq = gsap.quickTo(tilt, "z", { duration: 1.5, ease: "power2", onUpdate: () => (tiltZ = tilt.z) });
      const move = (e: PointerEvent) => {
        tq(-14 + (e.clientY / innerHeight - 0.5) * -16);
        zq((e.clientX / innerWidth - 0.5) * 6);
      };
      window.addEventListener("pointermove", move);

      const tick = (_t: number, dt: number) => {
        driftA += dt * 0.004;
        ring.style.transform = `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) rotateY(${scrollA + driftA}deg)`;
      };
      gsap.ticker.add(tick);

      gsap.to(q(`.${s.coreobj}`), { rotate: 360, duration: 60, repeat: -1, ease: "none" });
      gsap.to(q(`.${s.coreobj}`), { y: -18, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(q(`.${s.core}`), { scale: 1.25, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.from(q(`.${s.card}`), { opacity: 0, duration: 1.2, stagger: 0.06, scrollTrigger: { trigger: root.current, start: "top 70%" } });

      return () => {
        window.removeEventListener("pointermove", move);
        gsap.ticker.remove(tick);
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.work} id="work">
      <div className={s.pin}>
        <div className={s.head}>
          <span className="eyebrow">{copy.home.servicesEyebrow}</span>
          <span className={s.prog}>
            <i ref={progRef} />
          </span>
        </div>
        <div className={s.stage}>
          <div className={s.core} aria-hidden="true" />
          <div className={s.coreobj} data-flow="ring" aria-hidden="true" />
          <div ref={ringRef} className={s.ring} style={{ ["--n" as string]: n }}>
            {copy.services.map((sv, i) => (
              <Link key={sv.slug} href={href(copy.lang, "services", sv.slug)} className={s.card} style={{ ["--i" as string]: i }} data-cursor>
                <Image className={s.mark} src="/assets/mark.svg" alt="" width={28} height={28} />
                <span className={s.n}>
                  <b>#</b>
                  {sv.num}
                </span>
                <h3>{sv.name}</h3>
                <p>{sv.role.charAt(0).toUpperCase() + sv.role.slice(1)}.</p>
              </Link>
            ))}
          </div>
        </div>
        <span className={`eyebrow ${s.hint}`}>{copy.home.servicesHint}</span>
      </div>
    </section>
  );
}
