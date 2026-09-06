"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import m from "./morph.module.css";

type Item = { h: string; p?: string; href?: string; num?: string };

/**
 * MiniRing — the glass ring from the homepage, in a lighter form for sub-pages:
 * no pin, turns with time and with scroll, tilts with the pointer, copy fades on the back side.
 */
export function MiniRing({ items, size = "m", slot = false }: { items: Item[]; size?: "s" | "m"; slot?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const n = items.length, step = 360 / n;
  useGSAP(() => {
    const ring = ringRef.current!;
    if (prefersReducedMotion()) { ring.style.transform = "rotateX(-12deg)"; return; }
    const cards = Array.from(ring.children) as HTMLElement[];
    let drift = 0, tiltX = -12;
    const tilt = { x: -12 };
    const tq = gsap.quickTo(tilt, "x", { duration: 1.2, onUpdate: () => (tiltX = tilt.x) });
    const move = (e: PointerEvent) => tq(-12 + (e.clientY / innerHeight - 0.5) * -14);
    window.addEventListener("pointermove", move);
    const tick = (_t: number, dt: number) => {
      drift += dt * 0.006;
      const r = root.current!.getBoundingClientRect();
      const scroll = (r.top / innerHeight) * -90;
      const total = drift + scroll;
      ring.style.transform = `rotateX(${tiltX}deg) rotateY(${total}deg)`;
      cards.forEach((c, i) => c.style.setProperty("--face", String(Math.min(1, Math.max(0, (Math.cos(((i * step + total) * Math.PI) / 180) - 0.05) * 3)))));
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); window.removeEventListener("pointermove", move); };
  }, { scope: root });
  return (
    <div ref={root} className={`${m.mini} ${size === "s" ? m.miniS : ""}`}>
      {slot && <div className={m.miniSlot} data-flow="ring" aria-hidden="true" />}
      <div ref={ringRef} className={m.miniRing} style={{ ["--n" as string]: n }}>
        {items.map((it, i) => {
          const inner = (
            <>
              {it.num && <span className={m.miniNum}><b>#</b>{it.num}</span>}
              <h3>{it.h}</h3>
              {it.p && <p>{it.p}</p>}
            </>
          );
          const style = { ["--i" as string]: i, ["--step" as string]: `${step}deg` };
          return it.href ? (
            <Link key={i} href={it.href} className={m.miniCard} style={style} data-cursor>{inner}</Link>
          ) : (
            <div key={i} className={m.miniCard} style={style}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * CardOrbit — a cloud of screen-cards orbiting in 3D (the "card globe" idea).
 * Each card is a tiny fake website: header bar, hero block, text lines. Rotates with time,
 * tilts with the pointer; cards in front are sharp, cards behind fade.
 */
export function CardOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const cloud = useRef<HTMLDivElement>(null);
  const N = 14;
  useGSAP(() => {
    const el = cloud.current!;
    if (prefersReducedMotion()) return;
    const cards = Array.from(el.children) as HTMLElement[];
    let a = 0, tx = -10, ty = 0;
    const t = { x: -10, y: 0 };
    const qx = gsap.quickTo(t, "x", { duration: 1.4, onUpdate: () => (tx = t.x) });
    const qy = gsap.quickTo(t, "y", { duration: 1.4, onUpdate: () => (ty = t.y) });
    const move = (e: PointerEvent) => { qx(-10 + (e.clientY / innerHeight - 0.5) * -20); qy((e.clientX / innerWidth - 0.5) * 24); };
    window.addEventListener("pointermove", move);
    const tick = (_t: number, dt: number) => {
      a += dt * 0.012;
      el.style.transform = `rotateX(${tx}deg) rotateY(${a + ty}deg)`;
      cards.forEach((c, i) => {
        const ang = ((i * 360) / N + a + ty) % 360;
        const z = Math.cos((ang * Math.PI) / 180);
        c.style.setProperty("--depth", String((z + 1) / 2));
      });
    };
    gsap.ticker.add(tick);
    gsap.from(cards, { scale: 0, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.05, delay: 0.2 });
    return () => { gsap.ticker.remove(tick); window.removeEventListener("pointermove", move); };
  }, { scope: root });
  return (
    <div ref={root} className={m.orbit} aria-hidden="true">
      <div ref={cloud} className={m.cloud}>
        {Array.from({ length: N }, (_, i) => (
          <div key={i} className={`${m.screen} ${i % 3 === 0 ? m.screenHot : ""}`} style={{ ["--i" as string]: i, ["--n" as string]: N, ["--lift" as string]: `${(i % 4) * 22 - 33}px` }}>
            <i className={m.sBar} /><i className={m.sHero} /><i className={m.sLine} /><i className={m.sLineShort} />
          </div>
        ))}
      </div>
    </div>
  );
}
