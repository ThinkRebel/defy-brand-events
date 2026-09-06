"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Ribbon — the hero background: a stack of twisted bands sweeping through the frame,
 * rendered as glossy black paint (near-black base, cool blue sheen, hard white speculars).
 * Pure canvas 2D, painter-sorted quads, so it runs everywhere. It idles in 3D (slow roll +
 * a travelling wave), follows the pointer a little, and pauses when the hero is off-screen.
 */
const BANDS = 7, SEGS = 150;
type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export default function Ribbon({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d", { alpha: true })!;
    const still = prefersReducedMotion();
    const coarse = matchMedia("(pointer: coarse)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, live = true, t0 = performance.now();
    let px = 0, py = 0, tx = 0, ty = 0; // pointer tilt (target / eased)

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, coarse ? 1 : 1.5);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);

    const L = norm([-0.35, -0.6, 0.72]);   // key light: top-left, in front
    const L2 = norm([0.8, 0.3, 0.5]);      // fill: right
    const EYE: V3 = [0, 0, 1];

    // points of the strip: center curve + twist frame
    const frame = (u: number, time: number) => {
      const s = u * 2 - 1;                         // -1..1 across the screen
      const a = time * 0.00022;
      const y = Math.sin(s * 2.1 + a * 2.4) * 0.34 + Math.sin(s * 0.9 - a) * 0.12;
      const z = Math.cos(s * 1.6 + a * 1.7) * 0.42;
      const c: V3 = [s * 1.35, y, z];
      const twist = s * 2.4 + a * 3 + Math.sin(a * 1.3) * 0.6;   // roll along the strip
      // tangent by finite difference, then a rotating normal around it
      const s2 = s + 0.002, y2 = Math.sin(s2 * 2.1 + a * 2.4) * 0.34 + Math.sin(s2 * 0.9 - a) * 0.12, z2 = Math.cos(s2 * 1.6 + a * 1.7) * 0.42;
      const T = norm([0.002 * 1.35, y2 - y, z2 - z]);
      const up: V3 = Math.abs(T[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
      const N1 = norm(cross(T, up)), N2 = norm(cross(N1, T));
      const N: V3 = [N1[0] * Math.cos(twist) + N2[0] * Math.sin(twist), N1[1] * Math.cos(twist) + N2[1] * Math.sin(twist), N1[2] * Math.cos(twist) + N2[2] * Math.sin(twist)];
      return { c, N };
    };

    const draw = (time: number) => {
      tx += (px - tx) * 0.04; ty += (py - ty) * 0.04;
      const S = Math.min(w, h) * 0.62;              // world → px scale
      const cx = w * 0.56, cy = h * 0.5;
      const rotY = tx * 0.35, rotX = -ty * 0.25;      // pointer tilt
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const view = (p: V3): V3 => {
        const x = p[0] * cosY + p[2] * sinY, z0 = -p[0] * sinY + p[2] * cosY;
        const y = p[1] * cosX - z0 * sinX, z = p[1] * sinX + z0 * cosX;
        return [x, y, z];
      };
      const proj = (p: V3) => { const k = 1 / (1.9 - p[2] * 0.55); return [cx + p[0] * S * k, cy + p[1] * S * k]; };

      // build grid of points: (SEGS+1) × (BANDS+1)
      const halfW = 0.36, gap = 0.035;
      const grid: V3[][] = [];
      for (let i = 0; i <= SEGS; i++) {
        const { c, N } = frame(i / SEGS, time);
        const row: V3[] = [];
        for (let b = 0; b <= BANDS; b++) {
          const v = (b / BANDS) * 2 - 1;
          row.push(view([c[0] + N[0] * v * halfW, c[1] + N[1] * v * halfW, c[2] + N[2] * v * halfW]));
        }
        grid.push(row);
      }
      // quads with depth, shading
      type Q = { z: number; p: number[][]; col: string };
      const quads: Q[] = [];
      for (let i = 0; i < SEGS; i++) for (let b = 0; b < BANDS; b++) {
        const a0 = grid[i][b], a1 = grid[i + 1][b], b1 = grid[i + 1][b + 1], b0 = grid[i][b + 1];
        // shrink each band a touch so the stack reads as separate bands (the gaps in the reference)
        const inset = (p: V3, q: V3, k: number): V3 => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k];
        const g = gap * 0.5;
        const A0 = inset(a0, b0, g), A1 = inset(a1, b1, g), B1 = inset(b1, a1, g), B0 = inset(b0, a0, g);
        let n = norm(cross(sub(A1, A0), sub(B0, A0)));
        if (dot(n, EYE) < 0) n = [-n[0], -n[1], -n[2]];
        const ndl = Math.max(0, dot(n, L)), ndl2 = Math.max(0, dot(n, L2));
        const H = norm([L[0] + EYE[0], L[1] + EYE[1], L[2] + EYE[2]]);
        const spec = Math.pow(Math.max(0, dot(n, H)), 90);
        const H2 = norm([L2[0] + EYE[0], L2[1] + EYE[1], L2[2] + EYE[2]]);
        const spec2 = Math.pow(Math.max(0, dot(n, H2)), 40);
        const fres = Math.pow(1 - Math.max(0, dot(n, EYE)), 3);
        // glossy black paint: base 5,6,9; diffuse cool slate; speculars near-white blue
        const r = 5 + ndl * 26 + ndl2 * 10 + spec * 205 + spec2 * 60 + fres * 40;
        const gC = 6 + ndl * 32 + ndl2 * 12 + spec * 215 + spec2 * 68 + fres * 48;
        const bl = 9 + ndl * 44 + ndl2 * 18 + spec * 230 + spec2 * 80 + fres * 64;
        const z = (A0[2] + A1[2] + B1[2] + B0[2]) * 0.25;
        quads.push({ z, p: [proj(A0), proj(A1), proj(B1), proj(B0)], col: `rgb(${r | 0},${gC | 0},${bl | 0})` });
      }
      quads.sort((a, b) => a.z - b.z);
      ctx.clearRect(0, 0, w, h);
      for (const q of quads) {
        ctx.fillStyle = q.col; ctx.strokeStyle = q.col; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(q.p[0][0], q.p[0][1]); ctx.lineTo(q.p[1][0], q.p[1][1]); ctx.lineTo(q.p[2][0], q.p[2][1]); ctx.lineTo(q.p[3][0], q.p[3][1]); ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    };

    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!live) return;
      if (coarse && now - last < 40) return;   // ~25fps on phones is plenty for this
      last = now;
      draw(now - t0);
    };
    if (still) draw(4000); else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (live = e.isIntersecting), { threshold: 0.05 });
    io.observe(cv);
    const move = (e: PointerEvent) => { px = e.clientX / innerWidth - 0.5; py = e.clientY / innerHeight - 0.5; };
    if (!coarse && !still) window.addEventListener("pointermove", move);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
