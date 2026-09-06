"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import p from "./props.module.css";

/* -----------------------------------------------------------------------------------
 *  Scenes built on the rendered props (dropped in /public/assets):
 *   compass-sheet.png     12 views of the compass on one sheet (3 rows: 5 / 3 / 4)
 *   compass-exploded.png  the exploded compass, left → right
 *   blender.png           the AI blender
 *   social-cubes.png      the five glass social cubes
 *  Every scene checks its image first and renders `fallback` when the file is missing.
 * --------------------------------------------------------------------------------- */

function useImage(src: string) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const i = new Image();
    i.onload = () => setOk(true);
    i.onerror = () => setOk(false);
    i.src = src;
  }, [src]);
  return ok;
}

/* ============================ COMPASS (SEO) ============================ */
// sheet cells as fractions [x, y, w, h]; ordered so neighbours look like one tumbling turn
const CELLS: [number, number, number, number][] = [
  [0, 0, 0.2, 0.43], [0.2, 0, 0.2, 0.43], [0.4, 0, 0.2, 0.43], [0.33, 0.43, 0.34, 0.25], [0.8, 0, 0.2, 0.43], [0.75, 0.68, 0.25, 0.32],
  [0.5, 0.68, 0.25, 0.32], [0.6, 0, 0.2, 0.43], [0, 0.43, 0.33, 0.25], [0.25, 0.68, 0.25, 0.32], [0.66, 0.43, 0.34, 0.25], [0, 0.68, 0.25, 0.32],
];
const SLICES = 14;

export function Compass({ fallback }: { fallback: React.ReactNode }) {
  const sheet = useImage("/assets/compass-sheet.png");
  const expl = useImage("/assets/compass-exploded.png");
  const root = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState(0);
  const [built, setBuilt] = useState(false);
  const ready = sheet === true && expl === true;

  useGSAP(() => {
    if (!ready) return;
    const q = gsap.utils.selector(root);
    const slices = q(`.${p.slice}`);
    if (prefersReducedMotion()) { setBuilt(true); return; }
    // the exploded parts slide together into one compass
    const tl = gsap.timeline({ onComplete: () => setBuilt(true) });
    tl.from(slices, { x: (i) => (i - SLICES / 2) * 70, opacity: 0, duration: 1.6, ease: "expo.out", stagger: { each: 0.05, from: "center" } })
      .to(slices, { x: (i) => (SLICES / 2 - i) * (100 / SLICES) + "%", scaleX: 1.15, duration: 1.2, ease: "power3.inOut" }, "+=0.3")
      .to(q(`.${p.exploded}`), { opacity: 0, scale: 0.9, duration: 0.6 }, "-=0.2")
      .from(q(`.${p.pose}`), { scale: 0.7, opacity: 0, duration: 1, ease: "expo.out" }, "-=0.5");
    // then the compass follows the pointer in every direction
    const move = (e: PointerEvent) => {
      const r = root.current!.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const ang = Math.atan2(dy, dx) + Math.PI;
      setPose(Math.round((ang / (Math.PI * 2)) * 12) % 12);
    };
    window.addEventListener("pointermove", move);
    gsap.to(q(`.${p.poseWrap}`), { y: -14, rotate: 3, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    return () => window.removeEventListener("pointermove", move);
  }, { scope: root, dependencies: [ready] });

  if (sheet === false || expl === false) return <>{fallback}</>;
  if (!ready) return null;
  return (
    <div ref={root} className={p.compass} aria-hidden="true">
      <div className={p.exploded}>
        {Array.from({ length: SLICES }, (_, i) => (
          <div key={i} className={p.slice} style={{ backgroundPosition: `${(i / (SLICES - 1)) * 100}% 50%` }} />
        ))}
      </div>
      <div className={`${p.poseWrap} ${built ? p.built : ""}`}>
        {CELLS.map((c, i) => (
          <div key={i} className={`${p.pose} ${i === pose ? p.poseOn : ""}`} style={{ backgroundPosition: `${(c[0] / (1 - c[2])) * 100}% ${(c[1] / (1 - c[3])) * 100}%`, backgroundSize: `${100 / c[2]}% ${100 / c[3]}%` }} />
        ))}
      </div>
    </div>
  );
}

/* ============================ BLENDER (GEO) ============================ */
export function Blender({ fallback }: { fallback: React.ReactNode }) {
  const ok = useImage("/assets/blender.png");
  const root = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    if (!ok || prefersReducedMotion()) return;
    const img = root.current!.querySelector("img")!;
    // the blender runs: a nervous vibration, then a breath, then again
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
    tl.to(img, { x: "+=2", y: "-=1", rotate: 0.6, duration: 0.05, yoyo: true, repeat: 25, ease: "none" })
      .to(img, { x: 0, y: 0, rotate: 0, scale: 1.02, duration: 0.5, ease: "power2.out" })
      .to(img, { scale: 1, duration: 0.8, ease: "sine.inOut" });
    gsap.from(img, { y: 60, opacity: 0, duration: 1.4, ease: "expo.out" });
  }, { scope: root, dependencies: [ok] });
  // fluo droplets spraying out of the jar
  useEffect(() => {
    if (!ok) return;
    const c = cv.current!, ctx = c.getContext("2d")!;
    const drops: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    let raf = 0;
    const loop = () => {
      const w = (c.width = c.clientWidth), h = (c.height = c.clientHeight);
      ctx.clearRect(0, 0, w, h);
      if (drops.length < 90 && Math.random() < 0.5) drops.push({ x: w * (0.35 + Math.random() * 0.3), y: h * 0.42, vx: (Math.random() - 0.5) * 3, vy: -2 - Math.random() * 3, r: 1 + Math.random() * 3, a: 1 });
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.x += d.vx; d.y += d.vy; d.vy += 0.08; d.a -= 0.012;
        if (d.a <= 0) { drops.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(228,255,46,${d.a})`; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    if (!prefersReducedMotion()) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ok]);
  if (ok === false) return <>{fallback}</>;
  if (!ok) return null;
  return (
    <div ref={root} className={p.blender} aria-hidden="true">
      <canvas ref={cv} className={p.drops} />
      <img src="/assets/blender.png" alt="" />
    </div>
  );
}

/* ============================ SOCIAL CUBES (Marketing) ============================ */
export function SocialCubes() {
  const ok = useImage("/assets/social-cubes.png");
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ok || prefersReducedMotion()) return;
    const img = root.current!.querySelector("img")!;
    gsap.from(img, { scale: 0.6, rotate: -20, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 85%" } });
    gsap.to(img, { y: -18, rotate: 4, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    const qx = gsap.quickTo(img, "x", { duration: 1.2 }), qy = gsap.quickTo(img, "rotateY", { duration: 1.2 });
    const move = (e: PointerEvent) => { qx((e.clientX / innerWidth - 0.5) * 30); qy((e.clientX / innerWidth - 0.5) * 20); };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, { scope: root, dependencies: [ok] });
  if (!ok) return null;
  return (
    <div ref={root} className={p.cubes} aria-hidden="true">
      <img src="/assets/social-cubes.png" alt="" />
    </div>
  );
}
