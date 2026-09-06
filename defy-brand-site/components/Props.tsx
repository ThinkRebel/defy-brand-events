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
// every pose as its exact bounding box on the 1536 x 1024 sheet [x0, y0, x1, y1] — measured from the
// alpha, so no neighbour ever bleeds into a frame. Ordered as one tumbling turn (pointer angle → pose).
const SHEET_W = 1536, SHEET_H = 1024, POSE_UNIT = 456; // the tallest pose: the common scale
const CELLS: [number, number, number, number][] = [
  [16, 3, 373, 445], [384, 6, 697, 452], [716, 4, 836, 447], [877, 9, 1171, 456], [1180, 3, 1522, 456], [898, 690, 1136, 1004],
  [1166, 801, 1492, 962], [559, 543, 1037, 680], [1059, 467, 1506, 702], [47, 458, 506, 701], [28, 728, 403, 1004], [444, 699, 804, 996],
];
/* The exploded render (2172 x 724). Every part sits between two of these x-positions: the
 * cuts follow the natural gaps in the artwork (the thin axle / the valleys between the rings),
 * so each piece is a real component — ring, crown, case, fluo bezel, glass, dial, bearing… */
const EXPL_W = 2172;
const CUTS = [29, 112, 200, 362, 515, 652, 724, 846, 1035, 1103, 1188, 1275, 1518, 1655, 1845, 2149];
/** one pose, cut exactly to its outline and placed at the common scale, centred in a square box */
export const compassPoseStyle = (i = 0): React.CSSProperties => {
  const [x0, y0, x1, y1] = CELLS[i], w = x1 - x0, h = y1 - y0;
  return {
    backgroundImage: "url(/assets/152C0B15-979C-4348-A194-21C7A8C94082.PNG)", backgroundRepeat: "no-repeat",
    backgroundSize: `${(SHEET_W / w) * 100}% ${(SHEET_H / h) * 100}%`, backgroundPosition: `${(x0 / (SHEET_W - w)) * 100}% ${(y0 / (SHEET_H - h)) * 100}%`,
    width: `${(w / POSE_UNIT) * 100}%`, height: `${(h / POSE_UNIT) * 100}%`, left: `${50 - (w / POSE_UNIT) * 50}%`, top: `${50 - (h / POSE_UNIT) * 50}%`,
  };
};

export function Compass({ fallback, slotRef }: { fallback: React.ReactNode; slotRef?: React.RefObject<HTMLDivElement | null> }) {
  const sheet = useImage("/assets/152C0B15-979C-4348-A194-21C7A8C94082.PNG");
  const expl = useImage("/assets/5678EFB9-EC12-4624-B9C3-A37911AF8AC9.PNG");
  const root = useRef<HTMLDivElement>(null);
  const ready = sheet === true && expl === true;

  useGSAP(() => {
    if (!ready) return;
    const q = gsap.utils.selector(root);
    const pieces = q(`.${p.piece}`) as HTMLElement[];
    const handover = () => { slotRef?.current?.style.setProperty("--reveal", "1"); };
    if (prefersReducedMotion()) { gsap.set(q(`.${p.exploded}`), { opacity: 0 }); handover(); return; }
    // 1. the artwork appears intact (all parts in place, exploded)
    // 2. every part slides towards the centre — the ones on the right in front — until they stack into one compass
    // 3. the stack hands over to the page's floating compass (FlowObject → CompassSprite), which follows the pointer
    const rootRect = root.current!.getBoundingClientRect();
    const cx = rootRect.left + rootRect.width / 2;
    const dx = pieces.map((el) => { const r = el.getBoundingClientRect(); return cx - (r.left + r.width / 2); });
    const tl = gsap.timeline({ delay: 0.4 });
    tl.from(q(`.${p.exploded}`), { opacity: 0, y: 30, duration: 1, ease: "expo.out" })
      .to(pieces, { x: (i) => dx[i], duration: 2.1, ease: "power3.inOut", stagger: { each: 0.035, from: "edges" } }, "+=0.5")
      .add(handover, "-=0.15")
      .to(q(`.${p.exploded}`), { opacity: 0, duration: 0.45, ease: "power2.inOut" }, "-=0.1");
  }, { scope: root, dependencies: [ready] });

  if (sheet === false || expl === false) return <>{fallback}</>;
  if (!ready) return null;
  return (
    <div ref={root} className={p.compass} aria-hidden="true">
      <div className={p.exploded}>
        {CUTS.slice(0, -1).map((x0, i) => {
          const w = CUTS[i + 1] - x0;
          return <div key={i} className={p.piece} style={{ left: `${(x0 / EXPL_W) * 100}%`, width: `${(w / EXPL_W) * 100}%`, zIndex: i + 1, backgroundSize: `${(EXPL_W / w) * 100}% 100%`, backgroundPosition: `${(x0 / (EXPL_W - w)) * 100}% 0` }} />;
        })}
      </div>
    </div>
  );
}

/** The assembled compass as the page's floating object: one full compass, always the same view,
 *  so it stays consistent after the assembly (the FlowObject gives it its slow turn and float). */
export function CompassSprite() {
  return (
    <div className={p.sprite} aria-hidden="true">
      <div className={`${p.pose} ${p.poseOn}`} style={compassPoseStyle(0)} />
    </div>
  );
}

/* ============================ BLENDER (GEO) ============================ */
const BLENDER_SRC = "/assets/B0B76787-2EFB-48E6-8E4A-D017E7F3A2B4.PNG";
const BW = 1024, BH = 1536;
// the AI cubes and the lid in the render: centre, size, tilt (px of the 1024 x 1536 artwork)
const CUBES: [number, number, number, number][] = [
  [445, 270, 262, -18], [665, 335, 240, 14], [225, 415, 240, -14], [525, 520, 224, 6],
  [865, 470, 240, 14], [300, 590, 228, 8], [745, 605, 228, -24], [500, 720, 220, 8],
];
const LID: [number, number, number, number, number] = [290, 150, 500, 300, -20]; // cx, cy, w, h, tilt

/** clip a tilted rounded rectangle */
function roundedTilt(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, deg: number, r: number) {
  ctx.translate(cx, cy); ctx.rotate((deg * Math.PI) / 180);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r);
  ctx.rotate((-deg * Math.PI) / 180); ctx.translate(-cx, -cy);
}

/**
 * The blender, animated as a scene: the base (jug, splash, motor) is the render with the cubes
 * and the lid lifted out (the gaps are filled with a blurred copy of the splash), the cubes
 * drop in one by one from above, the lid comes down and closes, and then the machine runs.
 */
export function Blender({ fallback }: { fallback: React.ReactNode }) {
  const ok = useImage(BLENDER_SRC);
  const root = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const base = useRef<HTMLCanvasElement>(null);
  const [built, setBuilt] = useState(false);

  // build the layers once the image is in
  useEffect(() => {
    if (!ok) return;
    const img = new Image(); img.src = BLENDER_SRC;
    img.decode().then(() => {
      const b = base.current!; b.width = BW; b.height = BH;
      const ctx = b.getContext("2d")!;
      // the render, sharp; only the spots where the cubes and the lid were get a soft fill
      ctx.drawImage(img, 0, 0);
      ctx.save();
      ctx.beginPath();
      for (const [cx, cy, sz, deg] of CUBES) roundedTilt(ctx, cx, cy, sz * 0.9, sz * 0.9, deg, sz * 0.16);
      roundedTilt(ctx, LID[0], LID[1], LID[2] * 0.96, LID[3] * 0.96, LID[4], 60);
      ctx.clip();
      ctx.filter = "blur(26px)"; ctx.drawImage(img, 0, 0); ctx.filter = "none";
      ctx.restore();
      // sprites: each cube and the lid cut from the render
      const sprites = Array.from(root.current!.querySelectorAll<HTMLCanvasElement>(`.${p.bs}`));
      sprites.forEach((c, i) => {
        const isLid = i === CUBES.length;
        const [cx, cy, w, h, deg] = isLid ? LID : [CUBES[i][0], CUBES[i][1], CUBES[i][2], CUBES[i][2], CUBES[i][3]];
        const pad = Math.max(w, h) * 0.75; c.width = pad * 2; c.height = pad * 2;
        const o = c.getContext("2d")!;
        o.save(); roundedTilt(o, pad, pad, w * 0.94, h * 0.94, deg, isLid ? 60 : w * 0.16); o.clip();
        o.drawImage(img, pad - cx, pad - cy); o.restore();
      });
      setBuilt(true);
    });
  }, [ok]);

  useGSAP(() => {
    if (!built) return;
    const q = gsap.utils.selector(root);
    const cubes = q(`.${p.cube}`), lid = q(`.${p.lid}`), scene = q(`.${p.scene}`);
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(scene, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out" })
      // cubes drop in one by one, tumbling, and settle with a bounce
      .from(cubes, { y: -900, rotation: () => gsap.utils.random(-160, 160), duration: 1.1, ease: "bounce.out", stagger: 0.22 }, "-=0.6")
      // the lid comes down and closes
      .from(lid, { y: -320, rotation: -50, scale: 1.15, duration: 0.9, ease: "power3.in" }, "-=0.2")
      .to(scene, { y: 10, duration: 0.12, ease: "power1.out" }).to(scene, { y: 0, duration: 0.4, ease: "elastic.out(1,.5)" })
      // the blender runs: a nervous vibration, then a breath, then again
      .add(() => {
        gsap.timeline({ repeat: -1, repeatDelay: 1.4 })
          .to(scene, { x: "+=2", y: "-=1", rotate: 0.6, duration: 0.05, yoyo: true, repeat: 25, ease: "none" })
          .to(scene, { x: 0, y: 0, rotate: 0, scale: 1.02, duration: 0.5, ease: "power2.out" })
          .to(scene, { scale: 1, duration: 0.8, ease: "sine.inOut" });
      });
  }, { scope: root, dependencies: [built] });

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
  const pos = (cx: number, cy: number, w: number, h: number): React.CSSProperties => {
    const pad = Math.max(w, h) * 0.75;
    return { left: `${((cx - pad) / BW) * 100}%`, top: `${((cy - pad) / BH) * 100}%`, width: `${((pad * 2) / BW) * 100}%`, height: `${((pad * 2) / BH) * 100}%` };
  };
  return (
    <div ref={root} className={p.blender} aria-hidden="true">
      <canvas ref={cv} className={p.drops} />
      <div className={p.scene} style={{ opacity: built ? 1 : 0 }}>
        <canvas ref={base} className={p.base} />
        {CUBES.map(([cx, cy, sz], i) => <canvas key={i} className={`${p.bs} ${p.cube}`} style={pos(cx, cy, sz, sz)} />)}
        <canvas className={`${p.bs} ${p.lid}`} style={pos(LID[0], LID[1], LID[2], LID[3])} />
      </div>
    </div>
  );
}

/* ============================ SOCIAL CUBES (Marketing) ============================ */
export function SocialCubes() {
  const ok = useImage("/assets/6645658C-5269-49D9-8EE6-CB18B2B8F8F7.PNG");
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
      <img src="/assets/6645658C-5269-49D9-8EE6-CB18B2B8F8F7.PNG" alt="" />
    </div>
  );
}

/* ============================ DNA SPRITE (marketing) ============================ */
/** A DNA strand made of small copies of the chrome object — the marketing page's floating object. */
export function HelixSprite() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    let raf = 0, img: HTMLImageElement | null = null;
    const i = new Image(); i.onload = () => (img = i); i.src = "/assets/object.webp";
    const still = prefersReducedMotion();
    const N = 26;
    const draw = (tm: number) => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      if (c.width !== Math.round(r.width * dpr)) { c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); }
      const ctx = c.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r.width, r.height);
      if (img && r.width > 4) {
        const t = still ? 0 : tm / 1000, w = r.width, h = r.height;
        const cx = w / 2, R = w * 0.3, span = h * 0.9, size = w * 0.24;
        const items: { x: number; y: number; z: number; rot: number; s: number }[] = [];
        for (let k = 0; k < N; k++) {
          const strand = k % 2, u = Math.floor(k / 2) / (N / 2 - 1);
          const ang = u * Math.PI * 2.2 + t * 0.7 + strand * Math.PI;
          const z = Math.sin(ang);
          items.push({ x: cx + Math.cos(ang) * R, y: h * 0.05 + u * span, z, rot: ang + t * 0.3, s: (0.6 + (z + 1) * 0.3) * size });
        }
        ctx.lineWidth = 1.5;
        for (let k = 0; k < N - 1; k += 2) {
          const a = items[k], b = items[k + 1];
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, "rgba(228,255,46,0.85)"); g.addColorStop(1, "rgba(255,255,255,0.3)");
          ctx.strokeStyle = g; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        items.sort((a, b) => a.z - b.z);
        for (const it of items) {
          ctx.save(); ctx.globalAlpha = 0.55 + (it.z + 1) * 0.225;
          ctx.translate(it.x, it.y); ctx.rotate(it.rot);
          ctx.drawImage(img, -it.s / 2, -it.s / 2, it.s, it.s * (670 / 624));
          ctx.restore();
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div className={p.helix} aria-hidden="true"><canvas ref={ref} /></div>;
}

/* ============================ AGENTS (agentic workflow) ============================ */
/**
 * The robot sheet (2172 x 724, 2 rows): top row = one agent, from exploded parts to
 * assembled, then multiplying; bottom row = five agents in action poses.
 * Scene: the parts fly together into one agent → it lights up and multiplies → five agents
 * take their places over the pipeline. Falls back to nothing when the sheet is missing.
 */
const AGENTS_SRC = "/assets/842F5F24-483C-42F9-B53B-B9AA8C40A2BF.PNG";
const SHEET_AR = 3.0; // sheet width / height
// cells as fractions of the sheet: [x, y, w, h]
const BUILD: [number, number, number, number][] = [
  [0.449, 0.008, 0.196, 0.547], // parts wide apart, energy
  [0.281, 0.02, 0.162, 0.53],   // parts near
  [0.1275, 0.02, 0.146, 0.5],   // almost closed
  [0.0064, 0.044, 0.111, 0.47], // assembled
];
const MULTIPLY: [number, number, number, number][] = [[0.645, 0.008, 0.166, 0.55], [0.808, 0.08, 0.192, 0.42]];
const POSES: [number, number, number, number][] = [[0.155, 0.554, 0.107, 0.424], [0.295, 0.559, 0.101, 0.421], [0.417, 0.557, 0.13, 0.425], [0.561, 0.576, 0.105, 0.39], [0.687, 0.569, 0.124, 0.412]];
const cellStyle = (c: [number, number, number, number]): React.CSSProperties => ({
  backgroundImage: `url(${AGENTS_SRC})`, backgroundRepeat: "no-repeat",
  backgroundSize: `${100 / c[2]}% ${100 / c[3]}%`, backgroundPosition: `${(c[0] / (1 - c[2])) * 100}% ${(c[1] / (1 - c[3])) * 100}%`,
  aspectRatio: `${c[2] * SHEET_AR} / ${c[3]}`,
});

/** the parts fly together in the hero, then the finished agent is handed to the page's floating object */
export function AgentBuild({ slotRef }: { slotRef?: React.RefObject<HTMLDivElement | null> }) {
  const ok = useImage(AGENTS_SRC);
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ok) return;
    const q = gsap.utils.selector(root);
    const build = q(`.${p.aBuild}`) as HTMLElement[];
    const handover = () => { slotRef?.current?.style.setProperty("--reveal", "1"); };
    if (prefersReducedMotion()) { gsap.set(build, { opacity: 0 }); handover(); return; }
    gsap.set(build, { opacity: 0 });
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(build[0], { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
    for (let i = 1; i < build.length; i++) tl.set(build[i - 1], { opacity: 0 }, "+=0.55").set(build[i], { opacity: 1 });
    tl.to(build[3], { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.inOut" }, "+=0.3")
      .add(handover, "-=0.1")
      .to(build[3], { opacity: 0, duration: 0.4 });
  }, { scope: root, dependencies: [ok] });
  if (!ok) return null;
  return (
    <div ref={root} className={p.aHero} aria-hidden="true">
      {BUILD.map((c, i) => <div key={i} className={p.aBuild} style={cellStyle(c)} />)}
    </div>
  );
}

/** the assembled agent as the floating object of the page */
export function AgentSprite() {
  return <div className={p.aSprite} style={cellStyle(BUILD[3])} aria-hidden="true" />;
}

/** "A night's work, in seconds": the floating agent lands on the stage, multiplies, five agents take their places */
export function AgentSwarm() {
  const ok = useImage(AGENTS_SRC);
  const root = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ok) return;
    const q = gsap.utils.selector(root);
    const one = q(`.${p.aOne}`), mult = q(`.${p.aMult}`), poses = q(`.${p.aPose}`);
    const land = () => slotRef.current?.style.setProperty("--reveal", "0");
    if (prefersReducedMotion()) { land(); gsap.set([one, mult], { opacity: 0 }); gsap.set(poses, { opacity: 1 }); return; }
    gsap.set([one, mult], { opacity: 0 }); gsap.set(poses, { opacity: 0, scale: 0.4, x: 0, y: 0 });
    // play once, as soon as most of the stage is on screen — the floating agent has arrived by then
    const tl = gsap.timeline({ paused: true });
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tl.play(); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(root.current!);
    tl.add(land).set(one, { opacity: 1 })
      .to(one, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.inOut" }, "+=0.5")
      // it multiplies
      .set(one, { opacity: 0 }, "+=0.2").set(mult[0], { opacity: 1 })
      .set(mult[0], { opacity: 0 }, "+=0.55").set(mult[1], { opacity: 1 })
      .set(mult[1], { opacity: 0 }, "+=0.55")
      // five agents take their places
      .to(poses, { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)", stagger: 0.09 })
      .add(() => { poses.forEach((el, i) => gsap.to(el, { y: -10 - i * 2, duration: 2.2 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" })); });
    return () => io.disconnect();
  }, { scope: root, dependencies: [ok] });
  if (!ok) return null;
  return (
    <div ref={root} className={p.agents} aria-hidden="true">
      <div className={p.aStage}>
        <div ref={slotRef} className={p.aSlot} data-flow="swarm" style={{ ["--reveal" as string]: 1 }} />
        <div className={p.aOne} style={cellStyle(BUILD[3])} />
        {MULTIPLY.map((c, i) => <div key={i} className={p.aMult} style={cellStyle(c)} />)}
      </div>
      <div className={p.aRow}>
        {POSES.map((c, i) => <div key={i} className={p.aPose} style={cellStyle(c)} />)}
      </div>
    </div>
  );
}
