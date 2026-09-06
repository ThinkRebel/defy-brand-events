"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, type Copy } from "@/content";
import c from "./cinema.module.css";
import Typewriter from "./Typewriter";

/**
 * A film inside an iPhone.
 * - The phone PNG is the fixed frame. Its transparent screen region is detected at runtime
 *   (flood fill from the centre) and used as an exact CSS mask for the canvas underneath,
 *   so no photograph can ever leave the screen or touch the bezel.
 * - The 10 stills come from one contact sheet (sheet.jpg) and are cropped in memory.
 * - Page scroll scrubs a virtual camera: between two stills the outgoing frame keeps
 *   pushing in while the incoming one settles, so the cut reads as continuous motion.
 * - Towards the end a glass boundary is suggested: soft highlight, gentle contact
 *   distortion, a breath of reflection. Nothing you would call "a glass overlay".
 */

// Cell boundaries on the 1536×1024 contact sheet (5 × 2), as fractions.
const COLS: [number, number][] = [[2, 286], [291, 576], [582, 901], [908, 1231], [1240, 1534]].map(([a, b]) => [a / 1536, b / 1536]) as [number, number][];
const ROWS: [number, number][] = [[2, 507], [514, 1022]].map(([a, b]) => [a / 1024, b / 1024]) as [number, number][];
// Where the face sits in each frame (0..1 from top) — used as the focal point for cover-cropping.
const FOCAL_Y = [0.22, 0.2, 0.22, 0.28, 0.32, 0.36, 0.4, 0.42, 0.42, 0.45];
const N = 10;

type Cell = { sx: number; sy: number; sw: number; sh: number };

export default function Cinema({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const phoneBox = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phoneImg = useRef<HTMLImageElement>(null);
  const progress = useRef(0);
  const cine = copy.contact.cine;

  // ---- screen mask from the phone PNG ----
  useEffect(() => {
    const img = phoneImg.current!;
    const apply = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      if (!w) return;
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const a = ctx.getImageData(0, 0, w, h).data;
      const seen = new Uint8Array(w * h);
      const stack = [((h >> 1) * w + (w >> 1))];
      seen[stack[0]] = 1;
      // flood fill over transparent pixels starting at the screen centre
      while (stack.length) {
        const i = stack.pop()!;
        const x = i % w, y = (i - x) / w;
        const nb = [i - 1, i + 1, i - w, i + w];
        for (let k = 0; k < 4; k++) {
          const j = nb[k];
          if (j < 0 || j >= w * h) continue;
          if (k === 0 && x === 0) continue;
          if (k === 1 && x === w - 1) continue;
          if (seen[j] || a[j * 4 + 3] > 24) continue;
          seen[j] = 1; stack.push(j);
        }
      }
      const out = ctx.createImageData(w, h);
      for (let i = 0; i < w * h; i++) { const v = seen[i] ? 255 : 0; out.data[i * 4] = 255; out.data[i * 4 + 1] = 255; out.data[i * 4 + 2] = 255; out.data[i * 4 + 3] = v; }
      ctx.putImageData(out, 0, 0);
      const url = cv.toDataURL("image/png");
      const cvs = canvasRef.current!;
      cvs.style.maskImage = `url(${url})`;
      cvs.style.webkitMaskImage = `url(${url})`;
      cvs.style.maskSize = "100% 100%";
      cvs.style.webkitMaskSize = "100% 100%";
      cvs.dataset.masked = "1";
    };
    if (img.complete) apply(); else img.addEventListener("load", apply, { once: true });
  }, []);

  // ---- film ----
  useEffect(() => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
    const sheet = new Image();
    sheet.src = "/contact/BF369056-FCEF-4819-B7A4-A5BD4EDEBCE4.PNG";
    let cells: Cell[] = [];
    let raf = 0;
    let dirty = true;

    const size = () => {
      const r = phoneBox.current!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.width = Math.round(r.width * dpr);
      cvs.height = Math.round(r.height * dpr);
      dirty = true;
    };

    const drawFrame = (idx: number, scale: number, alpha: number, W: number, H: number) => {
      const cell = cells[Math.max(0, Math.min(N - 1, idx))];
      // cover-fit the cell into the canvas, then push in by `scale` around the focal point
      const cover = Math.max(W / cell.sw, H / cell.sh) * scale;
      const dw = cell.sw * cover, dh = cell.sh * cover;
      const fy = FOCAL_Y[idx] ?? 0.35;
      const dx = (W - dw) / 2;
      let dy = H * 0.42 - dh * fy; // keep the face around 42% down the screen
      dy = Math.min(0, Math.max(H - dh, dy));
      ctx.globalAlpha = alpha;
      ctx.drawImage(sheet, cell.sx, cell.sy, cell.sw, cell.sh, dx, dy, dw, dh);
    };

    const render = () => {
      raf = 0;
      if (!cells.length) return;
      const W = cvs.width, H = cvs.height;
      const p = progress.current;
      const f = p * (N - 1);
      const i = Math.floor(f);
      const t = f - i;
      const e = t * t * (3 - 2 * t); // smoothstep
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#e9e9e9";
      ctx.fillRect(0, 0, W, H);
      // outgoing frame keeps travelling towards the lens; incoming settles from slightly behind
      drawFrame(i, 1 + 0.09 * e, 1, W, H);
      if (i < N - 1) drawFrame(i + 1, 0.94 + 0.06 * e, e, W, H);

      // ---- the glass ----
      const g = Math.max(0, (p - 0.62) / 0.38); // 0 → 1 over the last third
      if (g > 0) {
        // 1. depth compression: a whisper of contrast + warmth as she nears the surface
        ctx.globalAlpha = 0.18 * g;
        ctx.fillStyle = "#ffffff";
        ctx.globalCompositeOperation = "overlay";
        ctx.fillRect(0, 0, W, H);
        // 2. a soft diagonal sheen — light catching the glass
        ctx.globalCompositeOperation = "screen";
        const sheen = ctx.createLinearGradient(0, 0, W, H);
        sheen.addColorStop(0, `rgba(255,255,255,${0.0})`);
        sheen.addColorStop(0.42, `rgba(255,255,255,${0.10 * g})`);
        sheen.addColorStop(0.5, `rgba(255,255,255,${0.16 * g})`);
        sheen.addColorStop(0.58, `rgba(255,255,255,${0.08 * g})`);
        sheen.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.globalAlpha = 1;
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, W, H);
        // 3. contact distortion at the very end: the frame is drawn once more, very slightly
        //    larger and blurred, only around the edges — like skin meeting glass.
        const k = Math.max(0, (p - 0.86) / 0.14);
        if (k > 0) {
          ctx.globalCompositeOperation = "source-over";
          ctx.filter = `blur(${(3 * k).toFixed(2)}px)`;
          const grd = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.25, W / 2, H * 0.45, Math.max(W, H) * 0.75);
          // draw blurred copy, then mask it to the edges via destination-in trick on a temp layer
          const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H;
          const tc = tmp.getContext("2d")!;
          tc.filter = `blur(${(4 * k).toFixed(2)}px)`;
          tc.drawImage(cvs, 0, 0);
          tc.filter = "none";
          tc.globalCompositeOperation = "destination-in";
          const m = tc.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.28, W / 2, H * 0.45, Math.max(W, H) * 0.7);
          m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(1, `rgba(0,0,0,${0.9 * k})`);
          tc.fillStyle = m; tc.fillRect(0, 0, W, H);
          ctx.filter = "none";
          ctx.globalAlpha = 1;
          ctx.drawImage(tmp, 0, 0);
          // faint fluo breath at the contact point — the brand, felt not seen
          ctx.globalCompositeOperation = "soft-light";
          grd.addColorStop(0, `rgba(228,255,46,${0.22 * k})`); grd.addColorStop(1, "rgba(228,255,46,0)");
          ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };
    const request = () => { if (!raf) raf = requestAnimationFrame(render); };

    sheet.onload = () => {
      const sw = sheet.naturalWidth, sh = sheet.naturalHeight;
      cells = [];
      for (const [r0, r1] of ROWS) for (const [c0, c1] of COLS) cells.push({ sx: c0 * sw, sy: r0 * sh, sw: (c1 - c0) * sw, sh: (r1 - r0) * sh });
      size(); request();
    };
    const onResize = () => { size(); request(); };
    window.addEventListener("resize", onResize);
    (cvs as HTMLCanvasElement & { __request?: () => void }).__request = request;
    return () => { window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // ---- scroll → progress, copy choreography ----
  useGSAP(
    () => {
      const cvs = canvasRef.current as (HTMLCanvasElement & { __request?: () => void }) | null;
      const q = gsap.utils.selector(root);
      const set = (p: number) => { progress.current = p; cvs?.__request?.(); };
      if (prefersReducedMotion()) { set(0.55); return; }

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (s) => set(s.progress),
      });
      set(st.progress);

      // intro copy leaves as she approaches; the invitation arrives when she is "behind the glass"
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      // the two copy blocks cross-fade: there is never an empty column
      tl.to(q(`.${c.intro}`), { opacity: 0, y: -30, duration: 0.14, ease: "power2.in" }, 0.52)
        .fromTo(q(`.${c.outro}`), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.58)
        .fromTo(q(`.${c.outro} .btn`), { scale: 0.8 }, { scale: 1, duration: 0.15, ease: "back.out(2)" }, 0.66)
        // the phone itself breathes slightly closer at the end — the viewer leans in too
        .fromTo(q(`.${c.phone}`), { scale: 1 }, { scale: 1.04, duration: 0.4, ease: "sine.inOut" }, 0.6);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={c.cinema} aria-label={cine.eyebrow}>
      <div className={c.sticky}>
        <div className={c.copy}>
          <div className={c.intro}>
            <span className="eyebrow">{cine.eyebrow}</span>
            <h1 className={c.name}>{cine.name}</h1>
            <p className={c.role}>{cine.role}</p>
            <Typewriter className={c.quote} lines={[cine.quote]} caret speed={26} />
          </div>
          <div className={c.outro}>
            <span className="eyebrow">{cine.have}</span>
            <h2 className={c.make}>{cine.make}</h2>
            <p className={c.tell}>{cine.tell}</p>
            <Link className="btn" href={`${href(copy.lang, "contact")}#form`}>
              <i />
              <span>{cine.cta}</span>
            </Link>
          </div>
        </div>

        <div className={c.stage}>
          <div ref={phoneBox} className={c.phone}>
            <canvas ref={canvasRef} className={c.screen} aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={phoneImg} className={c.frame} src="/contact/10A0C363-F5DD-4C83-93AB-7038C832484F.PNG" alt="" crossOrigin="anonymous" draggable={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
