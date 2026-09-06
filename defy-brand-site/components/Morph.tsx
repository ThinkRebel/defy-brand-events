"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import m from "./morph.module.css";

/* ------------------------------------------------------------------------------------------
 *  Three scenes made of the same matter as the chrome object.
 *  - ObjectHelix : a DNA strand built from small copies of the object; on scroll it converges
 *                  into one object and hands over to FlowObject (via --reveal on the slot).
 *  - DustMorph   : dust gathers into "DB EVENTS", starts to spin, and collapses into the
 *                  silhouette of the object; then the real object takes over.
 *  - Tornado     : a vortex of chrome/fluo droplets (from /contact/tornado.png when present,
 *                  procedural otherwise) that bursts apart as you scroll.
 * ---------------------------------------------------------------------------------------- */

const FLUO = [228, 255, 46];
const CHROME = [[250, 250, 250], [200, 200, 205], [120, 122, 128], [60, 60, 64]];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function fitCanvas(c: HTMLCanvasElement) {
  const r = c.getBoundingClientRect();
  const dpr = Math.min(matchMedia("(max-width: 760px)").matches ? 1.25 : 2, devicePixelRatio || 1);
  c.width = Math.max(1, r.width * dpr);
  c.height = Math.max(1, r.height * dpr);
  const ctx = c.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

function loadImg(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });
}

/* ============================== OBJECT HELIX ============================== */
export function ObjectHelix({ slotRef }: { slotRef?: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    let raf = 0, img: HTMLImageElement | null = null;
    loadImg("/assets/object.webp").then((i) => (img = i));
    const still = prefersReducedMotion();
    const N = 30;
    const draw = (tm: number) => {
      const { ctx, w, h } = fitCanvas(c);
      const t = still ? 0 : tm / 1000;
      // converge as the hero scrolls out
      const p = still ? 0 : clamp(scrollY / (innerHeight * 0.75));
      const k = smooth(p);
      if (slotRef?.current) slotRef.current.style.setProperty("--reveal", String(clamp((p - 0.6) / 0.35)));
      if (!img) { raf = requestAnimationFrame(draw); return; }
      const cx = w / 2, cy = h / 2;
      const R = w * 0.28, span = h * 0.86, size = Math.min(w, h) * 0.13;
      const items: { x: number; y: number; z: number; rot: number; s: number }[] = [];
      for (let i = 0; i < N; i++) {
        const strand = i % 2;
        const u = Math.floor(i / 2) / (N / 2 - 1);
        const ang = u * Math.PI * 2.2 + t * 0.8 + strand * Math.PI;
        const x0 = cx + Math.cos(ang) * R, z = Math.sin(ang), y0 = cy - span / 2 + u * span;
        items.push({ x: lerp(x0, cx, k), y: lerp(y0, cy, k), z, rot: ang + t * 0.3, s: lerp((0.65 + (z + 1) * 0.3) * size, size * 2.4, k) });
      }
      // rungs between strands (only while it is still a helix)
      if (k < 0.95) {
        ctx.globalAlpha = (1 - k) * 0.6;
        ctx.lineWidth = 2;
        for (let i = 0; i < N - 1; i += 2) {
          const a = items[i], b = items[i + 1];
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, "rgba(228,255,46,0.9)"); g.addColorStop(1, "rgba(255,255,255,0.35)");
          ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      items.sort((a, b) => a.z - b.z);
      const fade = 1 - clamp((p - 0.6) / 0.35);
      for (const it of items) {
        ctx.save();
        ctx.globalAlpha = (0.55 + (it.z + 1) * 0.225) * fade;
        ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.drawImage(img, -it.s / 2, -it.s / 2, it.s, it.s * (670 / 624));
        ctx.restore();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [slotRef]);
  return <canvas ref={ref} className={m.fill} aria-hidden="true" />;
}

/* ============================== DUST MORPH ============================== */
type P = { x: number; y: number; vx: number; vy: number; c: number[]; r: number; seed: number };

function sampleText(text: string, w: number, h: number, step: number) {
  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const o = off.getContext("2d")!;
  const font = getComputedStyle(document.body).getPropertyValue("--font-display").trim() || "Arial Black";
  let size = w / (text.length * 0.62);
  o.font = `800 ${size}px ${font}, "Arial Black", sans-serif`;
  while (o.measureText(text).width > w * 0.9 && size > 10) { size *= 0.95; o.font = `800 ${size}px ${font}, "Arial Black", sans-serif`; }
  o.textAlign = "center"; o.textBaseline = "middle"; o.fillStyle = "#fff";
  o.fillText(text, w / 2, h / 2);
  const d = o.getImageData(0, 0, w, h).data, pts: [number, number][] = [];
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
  return pts;
}
function sampleImage(img: HTMLImageElement, w: number, h: number, step: number, scale = 0.55) {
  const off = document.createElement("canvas");
  off.width = w; off.height = h;
  const o = off.getContext("2d")!;
  const s = Math.min(w, h) * scale, iw = s, ih = s * (img.height / img.width);
  o.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
  const d = o.getImageData(0, 0, w, h).data, pts: [number, number, number[]][] = [];
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
    const i = (y * w + x) * 4;
    if (d[i + 3] > 100) pts.push([x, y, [d[i], d[i + 1], d[i + 2]]]);
  }
  return pts;
}

export function DustMorph({ text = "DB EVENTS", slotRef: given }: { text?: string; slotRef?: React.RefObject<HTMLDivElement | null> }) {
  const root = useRef<HTMLDivElement>(null);
  const own = useRef<HTMLDivElement>(null);
  const slotRef = given ?? own;
  const ref = useRef<HTMLCanvasElement>(null);
  const prog = useRef(0);
  useGSAP(() => {
    if (prefersReducedMotion()) { prog.current = 1; return; }
    ScrollTrigger.create({ trigger: root.current, start: "top top", end: "+=340%", pin: true, scrub: 0.8, onUpdate: (st) => (prog.current = st.progress) });
  }, { scope: root });
  const chrome = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = ref.current!;
    let raf = 0, parts: P[] = [], A: [number, number][] = [], B: [number, number, number[]][] = [], W = 0, H = 0;
    const build = async () => {
      const { w, h } = fitCanvas(c); W = w; H = h;
      A = sampleText(text, Math.round(w), Math.round(h), 5);
      const img = await loadImg("/assets/object.webp");
      B = img ? sampleImage(img, Math.round(w), Math.round(h), 4) : [];
      const n = Math.min(1800, A.length);
      parts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, c: Math.random() < 0.3 ? FLUO : pick(CHROME), r: 1 + Math.random() * 1.8, seed: Math.random() * 1000 }));
    };
    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(c);
    const draw = (tm: number) => {
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, W, H);
      const t = tm / 1000, p = prog.current;
      const cx = W / 2, cy = H / 2;
      // 0 → .2 dust gathers into the letters · .2 → .3 the letters turn to chrome · .35 → .62 the chrome
      // name spins and shrinks · .5 → .78 the dust reforms as the object · .82 → the real object takes over
      const toText = smooth(clamp(p / 0.2));
      const textShow = smooth(clamp((p - 0.2) / 0.1)) * (1 - smooth(clamp((p - 0.5) / 0.12)));
      const spinT = clamp((p - 0.35) / 0.27);
      const spin = spinT * Math.PI * 2 * 1.5;
      const toObj = smooth(clamp((p - 0.5) / 0.28));
      const reveal = clamp((p - 0.82) / 0.18);
      if (slotRef?.current) slotRef.current.style.setProperty("--reveal", String(reveal));
      if (chrome.current) {
        chrome.current.style.opacity = String(textShow);
        chrome.current.style.transform = `perspective(1200px) rotateY(${spinT * 540}deg) scale(${1 - smooth(spinT) * 0.6})`;
      }
      // the dots hide while the chrome name is on stage, and return as the object forms
      const dotsAlpha = Math.max(1 - smooth(clamp((p - 0.2) / 0.1)), smooth(clamp((p - 0.5) / 0.12)));
      const n = parts.length;
      for (let i = 0; i < n; i++) {
        const q = parts[i];
        const a = A[i % A.length];
        const b: [number, number, number[]] = B.length ? B[Math.floor((i / n) * B.length)] : [cx, cy, q.c];
        // text target, rotated around the centre as it "starts to spin"
        const ax = a[0] - cx, ay = a[1] - cy;
        const cs = Math.cos(spin), sn = Math.sin(spin);
        const tx = cx + ax * cs - ay * sn * 0.35, ty = cy + ax * sn * 0.35 + ay * cs;
        // object target
        const ox = b[0], oy = b[1];
        let gx = lerp(tx, ox, toObj), gy = lerp(ty, oy, toObj);
        // dust drift before it gathers
        const dust = 1 - toText;
        gx += Math.sin(t * 0.7 + q.seed) * 40 * dust + (q.seed % 1) * 0;
        gy += Math.cos(t * 0.5 + q.seed) * 40 * dust;
        const ease = 0.06 + toText * 0.1;
        q.vx = (q.vx + (gx - q.x) * ease) * 0.72;
        q.vy = (q.vy + (gy - q.y) * ease) * 0.72;
        q.x += q.vx; q.y += q.vy;
        const col = toObj > 0.5 && B.length ? b[2] : q.c;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(0.35 + toText * 0.65) * (1 - reveal) * dotsAlpha})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + toObj * 0.6), 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [text, slotRef]);
  return (
    <div ref={root} className={m.dust}>
      <canvas ref={ref} className={m.fill} aria-hidden="true" />
      <div ref={chrome} className={m.chromeText} aria-hidden="true"><span>{text}</span></div>
      <div ref={slotRef} className={m.dustSlot} data-flow="dust" aria-hidden="true" />
    </div>
  );
}

/* ============================== TORNADO ============================== */
const TORNADO_SRC = "/assets/77332CB1-433B-4473-82F6-02E39851E243%202.PNG";

/**
 * The real tornado render, alive: it sways row by row like a real vortex. As you scroll it
 * breaks into pieces of the picture that fly apart — and "Let's make some noise" is what is left.
 */
export function Tornado({ children }: { children?: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    ScrollTrigger.create({ trigger: root.current, start: "top top", end: "+=220%", pin: true, scrub: 0.6, onUpdate: (st) => (prog.current = st.progress) });
    gsap.to(root.current!.querySelector(`.${m.tornadoCopy}`), { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "70% top", end: "+=80%", scrub: true } });
  }, { scope: root });
  useEffect(() => {
    const c = ref.current!;
    let raf = 0, img: HTMLImageElement | null = null, W = 0, H = 0;
    const COLS = 14, ROWS = 24;
    loadImg(TORNADO_SRC).then((i) => (img = i));
    const draw = (tm: number) => {
      const { ctx, w, h } = fitCanvas(c); W = w; H = h;
      const t = tm / 1000, p = prog.current;
      ctx.clearRect(0, 0, W, H);
      if (img) {
        // the picture sits centred, 92% of the height
        const ih = H * 0.92, iw = ih * (img.width / img.height), ox = (W - iw) / 2, oy = H * 0.04;
        // .25 → .75: the vortex keeps turning while every piece spirals inward and shrinks into the
        // heart of the funnel — where the chrome object appears and takes over (FlowObject)
        const draw_ = smooth(clamp((p - 0.25) / 0.5));
        const reveal = clamp((p - 0.62) / 0.2);
        if (slotRef.current) slotRef.current.style.setProperty("--reveal", String(reveal));
        const tw = iw / COLS, th = ih / ROWS, sw = img.width / COLS, sh = img.height / ROWS;
        const cx = W / 2, cy = H / 2;
        for (let r = 0; r < ROWS; r++) {
          const u = r / ROWS;
          // sway: the funnel bends, more at the top, like a slow vortex — and spins faster as it draws in
          const sway = Math.sin(t * (1.1 + draw_ * 3) + u * 5) * (1 - u) * iw * 0.06;
          for (let cc = 0; cc < COLS; cc++) {
            const x0 = ox + cc * tw + sway + tw / 2, y0 = oy + r * th + th / 2;
            // spiral target: towards the centre, turning as it goes
            const ang = Math.atan2(y0 - cy, x0 - cx) + draw_ * Math.PI * 2.5;
            const dist = Math.hypot(x0 - cx, y0 - cy) * (1 - draw_);
            const x = lerp(x0, cx + Math.cos(ang) * dist, draw_), y = lerp(y0, cy + Math.sin(ang) * dist, draw_);
            const scale = 1 - draw_ * 0.85, alpha = (1 - reveal) * (1 - draw_ * 0.4);
            if (alpha < 0.02 || scale < 0.05) continue;
            ctx.save(); ctx.globalAlpha = alpha;
            ctx.translate(x, y); ctx.rotate(draw_ * 6 + (cc % 3) * draw_); ctx.scale(scale, scale);
            ctx.drawImage(img, cc * sw, r * sh, sw, sh, -tw / 2, -th / 2, tw + 0.6, th + 0.6);
            ctx.restore();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={root} className={m.tornado}>
      <canvas ref={ref} className={m.fill} aria-hidden="true" />
      <div ref={slotRef} className={m.dustSlot} data-flow="tornado" aria-hidden="true" style={{ ["--reveal" as string]: 0 }} />
      <div className={m.tornadoCopy}>{children}</div>
    </div>
  );
}
