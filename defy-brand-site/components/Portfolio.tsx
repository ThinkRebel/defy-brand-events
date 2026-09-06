"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { PORTFOLIO, type Copy } from "@/content";
import s from "./portfolio.module.css";

/**
 * Portfolio — the names, big, on the left. Hover a name and the site fills the screen behind
 * the list (screenshot, slow drift with the pointer, a curtain wipe between projects).
 * Click and you're on the site. Screenshots: /portfolio/<host>.jpg when present, otherwise a
 * live capture service, so the wall never goes empty.
 */
const shot = (host: string, url: string, tier: number) =>
  tier === 0 ? `/portfolio/${host}.jpg` : tier === 1 ? `https://image.thum.io/get/width/1600/crop/1000/noanimate/${url}` : `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

function Shot({ host, url, active }: { host: string; url: string; active: boolean }) {
  const [tier, setTier] = useState(0);
  return <img className={`${s.shot} ${active ? s.on : ""}`} src={shot(host, url, tier)} alt="" loading="lazy" onError={() => setTier((t) => Math.min(2, t + 1))} />;
}

export default function Portfolio({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const lang = copy.lang;
  const pf = copy.portfolio;

  // parallax drift of the wall with the pointer
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const el = wall.current!;
    const qx = gsap.quickTo(el, "x", { duration: 1.4, ease: "power3" });
    const qy = gsap.quickTo(el, "y", { duration: 1.4, ease: "power3" });
    const move = (e: PointerEvent) => { qx((e.clientX / innerWidth - 0.5) * -40); qy((e.clientY / innerHeight - 0.5) * -30); };
    window.addEventListener("pointermove", move);
    gsap.from(root.current!.querySelectorAll(`.${s.row}`), { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, delay: 0.2 });
    return () => window.removeEventListener("pointermove", move);
  }, { scope: root });

  // touch: first tap previews, second tap follows the link
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section ref={root} className={s.wrap} onPointerLeave={() => setActive(-1)}>
      <div className={s.wallClip} aria-hidden="true">
        <div ref={wall} className={s.wall}>
          {PORTFOLIO.filter((w) => w.live).map((w, i) => (
            <Shot key={w.host} host={w.host} url={w.url} active={active === i} />
          ))}
          <div className={`${s.veil} ${active >= 0 ? s.veilOn : ""}`} />
        </div>
      </div>

      <div className={s.head}>
        <span className="eyebrow">{pf.eyebrow}</span>
        <h1 className={s.h1}>{pf.h}</h1>
        <p className={s.hint}>{pf.hint}</p>
      </div>

      <ol className={s.list}>
        {PORTFOLIO.map((w, i) => {
          const live = w.live;
          const idx = PORTFOLIO.filter((x) => x.live).indexOf(w);
          const on = active === idx && live;
          return (
            <li key={w.host} className={`${s.row} ${on ? s.rowOn : ""} ${!live ? s.wip : ""}`}>
              {live ? (
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener"
                  data-cursor
                  onPointerEnter={(e) => { if (e.pointerType !== "touch") setActive(idx); }}
                  onFocus={() => setActive(idx)}
                  onClick={(e) => {
                    // on touch, the first tap only opens the preview
                    if (matchMedia("(hover: none)").matches && active !== idx) { e.preventDefault(); setActive(idx); }
                  }}
                >
                  <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.name}>{w.name}</span>
                  <span className={s.meta}><b>{w.kind[lang]}</b> · {w.host} <i>{pf.visit} ↗</i></span>
                </a>
              ) : (
                <div>
                  <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.name}>{w.name}</span>
                  <span className={s.meta}><b>{w.kind[lang]}</b> · {pf.wip}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
