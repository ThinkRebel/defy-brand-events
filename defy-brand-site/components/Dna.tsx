"use client";
import { useEffect, useRef } from "react";

/**
 * A slowly turning DNA strand drawn in the same material language as the chrome object:
 * chrome spheres with a fluo core, thin glowing rungs. Rotation is time-based and nudged by scroll.
 */
export default function Dna({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, t0 = performance.now();
    const size = () => { const r = cvs.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1); cvs.width = r.width * dpr; cvs.height = r.height * dpr; };
    size();
    const sphere = (x: number, y: number, r: number, fluo: boolean, depth: number) => {
      const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
      if (fluo) { g.addColorStop(0, "#f6ffb0"); g.addColorStop(0.4, "#e4ff2e"); g.addColorStop(1, "#7a8a10"); }
      else { g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, "#c9ced6"); g.addColorStop(0.7, "#5a6270"); g.addColorStop(1, "#23262b"); }
      ctx.globalAlpha = 0.55 + 0.45 * depth;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    const draw = () => {
      raf = 0;
      const W = cvs.width, H = cvs.height;
      ctx.clearRect(0, 0, W, H);
      const time = reduce ? 0 : (performance.now() - t0) / 1000;
      const spin = time * 0.9 + scrollY * 0.004;
      const cx = W / 2, amp = W * 0.28, steps = 18, gap = H / (steps + 1);
      const pts: { x: number; y: number; z: number; i: number; s: 0 | 1 }[] = [];
      for (let i = 0; i <= steps; i++) {
        const y = gap * (i + 0.5), a = spin + i * 0.55;
        pts.push({ x: cx + Math.sin(a) * amp, y, z: Math.cos(a), i, s: 0 });
        pts.push({ x: cx + Math.sin(a + Math.PI) * amp, y, z: Math.cos(a + Math.PI), i, s: 1 });
      }
      // rungs first (behind)
      ctx.lineWidth = Math.max(1, W * 0.006);
      for (let i = 0; i <= steps; i++) {
        const a = pts[i * 2], b = pts[i * 2 + 1];
        const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grd.addColorStop(0, "rgba(228,255,46,0.05)"); grd.addColorStop(0.5, "rgba(228,255,46,0.6)"); grd.addColorStop(1, "rgba(228,255,46,0.05)");
        ctx.strokeStyle = grd; ctx.globalAlpha = 0.5 + 0.5 * ((a.z + 1) / 2);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      // spheres, back to front
      pts.sort((p, q) => p.z - q.z).forEach((p) => {
        const depth = (p.z + 1) / 2;
        const r = W * (0.028 + 0.022 * depth);
        sphere(p.x, p.y, r, p.i % 3 === (p.s ? 1 : 2), depth);
      });
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    addEventListener("resize", size);
    return () => { removeEventListener("resize", size); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
