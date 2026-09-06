"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import m from "./morph.module.css";
import { UI, photoFor } from "@/lib/photos";

type Item = { h: string; p?: string; href?: string; num?: string; img?: string };

/** one photo per service (Unsplash), keyed by service number — used on the globe and the bloom */
const U = (id: string) => `https://images.unsplash.com/${id}?w=700&q=70&auto=format&fit=crop`;
export const SERVICE_IMG: Record<string, string> = {
  "01": U("photo-1560174038-da43ac74f01b"), // strategy — chess
  "02": U("photo-1525909002-1b05e0c869d8"), // brand & creative — paint
  "03": U("photo-1729536700035-9d37bc0fcb84"), // copywriting — typewriter
  "04": U("photo-1531297484001-80022131f5a1"), // website design — laptop
  "05": U("photo-1459749411175-04bf5292ceea"), // marketing — crowd
  "06": U("photo-1598944999410-e93772fc48a5"), // seo — compass
  "07": U("photo-1674027444485-cec3da58eef4"), // geo — ai abstract
  "08": U("photo-1581090464777-f3220bbe1b8b"), // agent ready — robot hand
  "09": U("photo-1583198432859-635beb4e8600"), // agentic workflow — gears
};
const imgFor = (it: Item) => it.img ?? (it.num ? SERVICE_IMG[it.num] : undefined);
/** every card gets a photo: its own, the service photo, or one chosen by its text */
const imgAny = (it: Item) => imgFor(it) ?? photoFor("card" + it.h + (it.p ?? ""));

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
          const im = imgFor(it) ?? photoFor("mini" + it.h);
          const inner = (
            <>
              <img className={m.cardImg} src={im} alt="" loading="lazy" />
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
/**
 * CardOrbit — website design hero: a ring of device mockups (laptop, phone, monitor) with
 * beautiful interfaces on screen, turning slowly and leaning with the pointer.
 */
export function CardOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const cloud = useRef<HTMLDivElement>(null);
  const N = UI.length;
  const kinds = ["laptop", "phone", "monitor"] as const;
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
      a += dt * 0.01;
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
        {Array.from({ length: N }, (_, i) => {
          const kind = kinds[i % 3];
          return (
            <div key={i} className={`${m.device} ${m[kind]}`} style={{ ["--i" as string]: i, ["--n" as string]: N, ["--lift" as string]: `${(i % 4) * 22 - 33}px` }}>
              <div className={m.dScreen}><img src={UI[i]} alt="" loading="lazy" /></div>
              {kind === "laptop" && <i className={m.dBase} />}
              {kind === "monitor" && <i className={m.dStand} />}
              {kind === "phone" && <i className={m.dNotch} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * CardGlobe — cards on a sphere (the "card globe"). The globe turns with time and drags with
 * the pointer; every card keeps facing you; the ones at the back fade into the glass.
 */
export function CardGlobe({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const n = items.length;
  useGSAP(() => {
    const cards = Array.from(root.current!.querySelectorAll<HTMLElement>(`.${m.gCard}`));
    if (prefersReducedMotion()) return;
    let rotY = 0, rotX = -10, vel = 0.25, dragging = false, lastX = 0;
    const R = () => Math.min(root.current!.clientWidth, root.current!.clientHeight) * 0.42;
    const pts = cards.map((_, i) => { const y = 1 - (i / (n - 1)) * 2; const r = Math.sqrt(1 - y * y); const a = i * 2.399963; return [Math.cos(a) * r, y, Math.sin(a) * r]; });
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; };
    const move = (e: PointerEvent) => { if (!dragging) return; vel = (e.clientX - lastX) * 0.4; rotY += vel; lastX = e.clientX; };
    const up = () => { dragging = false; };
    root.current!.addEventListener("pointerdown", down); window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    const tick = (_t: number, dt: number) => {
      if (!dragging) { vel += (0.25 - vel) * 0.02; rotY += vel * dt * 0.06; }
      const ry = (rotY * Math.PI) / 180, rx = (rotX * Math.PI) / 180, rad = R();
      cards.forEach((c, i) => {
        const [x0, y0, z0] = pts[i];
        const x1 = x0 * Math.cos(ry) - z0 * Math.sin(ry), z1 = x0 * Math.sin(ry) + z0 * Math.cos(ry);
        const y2 = y0 * Math.cos(rx) - z1 * Math.sin(rx), z2 = y0 * Math.sin(rx) + z1 * Math.cos(rx);
        const depth = (z2 + 1) / 2; // 0 back, 1 front
        c.style.transform = `translate(-50%,-50%) translate3d(${x1 * rad}px, ${y2 * rad * 0.8}px, ${z2 * rad}px) scale(${0.55 + depth * 0.55})`;
        c.style.opacity = String(0.15 + depth * 0.85);
        c.style.zIndex = String(Math.round(depth * 100));
        c.style.pointerEvents = depth > 0.45 ? "auto" : "none";
      });
    };
    gsap.ticker.add(tick);
    gsap.from(cards, { scale: 0, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: root.current, start: "top 80%" } });
    return () => { gsap.ticker.remove(tick); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, { scope: root });
  return (
    <div ref={root} className={m.globe}>
      {items.map((it, i) => {
        const im = imgAny(it);
        const inner = <>{im && <img className={m.cardImg} src={im} alt="" loading="lazy" />}{it.num && <span className={m.miniNum}><b>#</b>{it.num}</span>}<h3>{it.h}</h3>{it.p && <p>{it.p}</p>}</>;
        return it.href ? <Link key={i} href={it.href} className={m.gCard} data-cursor>{inner}</Link> : <div key={i} className={m.gCard}>{inner}</div>;
      })}
    </div>
  );
}

/** CardStack — one pile of glass cards that deals itself out into a fan as you scroll. */
export function CardStack({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const n = items.length;
  useGSAP(() => {
    const cards = Array.from(root.current!.querySelectorAll<HTMLElement>(`.${m.sCard}`));
    if (prefersReducedMotion()) { cards.forEach((c, i) => (c.style.transform = `translateX(${(i - (n - 1) / 2) * 105}%)`)); return; }
    gsap.set(cards, { x: 0, rotate: (i) => (i - (n - 1) / 2) * 1.5, y: (i) => i * -3, zIndex: (i) => i });
    gsap.to(cards, {
      x: (i) => `${(i - (n - 1) / 2) * Math.min(104, (88 * 6) / n)}%`, y: (i) => Math.abs(i - (n - 1) / 2) * 14, rotate: (i) => (i - (n - 1) / 2) * Math.min(5, 30 / n),
      ease: "power2.out", stagger: { each: 0.03, from: "center" },
      scrollTrigger: { trigger: root.current, start: "top 75%", end: "top 20%", scrub: 0.6 },
    });
  }, { scope: root });
  return (
    <div ref={root} className={m.stack} style={{ ["--n" as string]: n }}>
      {items.map((it, i) => {
        const inner = <><img className={m.cardImg} src={imgAny(it)} alt="" loading="lazy" />{it.num && <span className={m.miniNum}><b>#</b>{it.num}</span>}<h3>{it.h}</h3>{it.p && <p>{it.p}</p>}</>;
        return it.href ? <Link key={i} href={it.href} className={m.sCard} data-cursor>{inner}</Link> : <div key={i} className={m.sCard}>{inner}</div>;
      })}
    </div>
  );
}

/**
 * CardBloom — the "orbit bloom": one pile in the centre opens like a flower, petals fanning
 * out around a tilted axis while the whole bloom slowly turns. Hover a petal to pull it forward.
 */
export function CardBloom({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const n = items.length;
  useGSAP(() => {
    const cards = Array.from(root.current!.querySelectorAll<HTMLElement>(`.${m.bCard}`));
    if (prefersReducedMotion()) { cards.forEach((c, i) => (c.style.transform = `rotate(${(i * 360) / n}deg) translateY(-45%)`)); return; }
    const open = { v: 0 };
    let spin = 0, tx = 55;
    const t = { x: 55 };
    const qx = gsap.quickTo(t, "x", { duration: 1.4, onUpdate: () => (tx = t.x) });
    const move = (e: PointerEvent) => qx(55 + (e.clientY / innerHeight - 0.5) * -25);
    window.addEventListener("pointermove", move);
    gsap.to(open, { v: 1, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 25%", scrub: 0.6 } });
    const tick = (_t: number, dt: number) => {
      spin += dt * 0.012 * open.v;
      stage.current!.style.transform = `rotateX(${tx}deg) rotateZ(${spin}deg)`;
      const rad = Math.min(root.current!.clientWidth, root.current!.clientHeight) * 0.36;
      cards.forEach((c, i) => {
        const a = (i * 360) / n + (1 - open.v) * 40;
        c.style.transform = `rotate(${a}deg) translateY(${-rad * open.v}px) rotate(${-a - spin}deg) rotateX(${-tx * open.v}deg) translateZ(${open.v * 24}px)`;
        c.style.opacity = String(0.3 + open.v * 0.7);
      });
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); window.removeEventListener("pointermove", move); };
  }, { scope: root });
  return (
    <div ref={root} className={m.bloom}>
      <div ref={stage} className={m.bloomStage}>
        {items.map((it, i) => {
          const im = imgAny(it);
          const inner = <>{im && <img className={m.cardImg} src={im} alt="" loading="lazy" />}{it.num && <span className={m.miniNum}><b>#</b>{it.num}</span>}<h3>{it.h}</h3>{it.p && <p>{it.p}</p>}</>;
          return it.href ? <Link key={i} href={it.href} className={m.bCard} data-cursor>{inner}</Link> : <div key={i} className={m.bCard}>{inner}</div>;
        })}
      </div>
    </div>
  );
}
