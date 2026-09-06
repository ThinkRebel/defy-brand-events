"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { PORTFOLIO, type Copy } from "@/content";
import Kinetic from "./Kinetic";
import s from "./portfolio.module.css";

/**
 * Portfolio — the way the best studios show work: content first. Every project is a case
 * card: the site itself in a browser frame, the name in sentence case, what it is, and one
 * action. The first case takes the full width, the rest sit in two columns; the frames drift
 * a little with scroll so the page breathes. Screenshots: /portfolio/<host>.jpg when present,
 * otherwise a live capture service, so a card never goes empty.
 */
const shot = (host: string, url: string, tier: number) =>
  tier === 0 ? `/portfolio/${host}.jpg` : tier === 1 ? `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitForTimeout=4000&viewport.width=1600&viewport.height=1000` : `https://image.thum.io/get/width/1600/crop/1000/wait/5/noanimate/${url}`;

/**
 * A case shows a screen recording when one exists (`public/portfolio/<host>.mp4`, muted, looping,
 * plays while in view) and falls back to a screenshot otherwise.
 */
export function Shot({ host, url }: { host: string; url: string }) {
  const [tier, setTier] = useState(0);
  const [video, setVideo] = useState(true);
  if (video) {
    return (
      <video className={s.shot} src={`/portfolio/${host}.mp4`} muted loop playsInline autoPlay preload="metadata" onError={() => setVideo(false)}
        onLoadedMetadata={(e) => { const v = e.currentTarget; const io = new IntersectionObserver(([en]) => (en.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 }); io.observe(v); }} />
    );
  }
  return <img className={s.shot} src={shot(host, url, tier)} alt="" loading="lazy" onError={() => setTier((t) => Math.min(2, t + 1))} />;
}

export default function Portfolio({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const lang = copy.lang;
  const pf = copy.portfolio;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = Array.from(root.current!.querySelectorAll<HTMLElement>(`.${s.card}`));
    cards.forEach((card, i) => {
      gsap.from(card, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", delay: (i % 2) * 0.1, scrollTrigger: { trigger: card, start: "top 88%" } });
      // the screenshot drifts inside its frame as you scroll
      const img = card.querySelector(`.${s.shot}`);
      if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 } });
    });
  }, { scope: root });

  return (
    <section ref={root} className={s.wrap}>
      <div className={s.head}>
        <span className="eyebrow">{pf.eyebrow}</span>
        <Kinetic as="h1" text={pf.h} mode="slide" className={s.h1} start="top 95%" />
        <p className={s.hint}>{pf.hint}</p>
      </div>

      <ol className={s.grid}>
        {PORTFOLIO.map((w, i) => {
          const live = w.live;
          const body = (
            <>
              <div className={s.frame}>
                <div className={s.bar}><i /><i /><i /><span>{w.host}</span></div>
                <div className={s.screen}>{live ? <Shot host={w.host} url={w.url} /> : <div className={s.soon}>{pf.wip}</div>}</div>
                {live && <span className={s.open}>{pf.visit} ↗</span>}
              </div>
              <div className={s.caption}>
                <span className={s.idx}>{String(i + 1).padStart(2, "0")}</span>
                <h2 className={s.name}>{w.name}</h2>
                <p className={s.kind}>{w.kind[lang]} · {live ? pf.live : pf.wip}</p>
              </div>
            </>
          );
          return (
            <li key={w.host} className={`${s.card} ${i === 0 ? s.wide : ""} ${!live ? s.wip : ""}`}>
              {live ? <a href={w.url} target="_blank" rel="noopener" data-cursor className={s.link}>{body}</a> : <div className={s.link}>{body}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
