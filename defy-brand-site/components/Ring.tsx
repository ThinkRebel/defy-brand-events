"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { href, type Copy } from "@/content";
import s from "./home.module.css";

/** "DON'T BUILD A WEBSITE." → "Don't build a website." (keeps AI/GEO/SEO/DNA upper-case) */
function sentence(str: string) {
  return str
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_m, p, c) => p + c.toUpperCase())
    .replace(/\b(ai|geo|seo|dna)\b/g, (m) => m.toUpperCase());
}

/**
 * The nine services as a deck of glass cards.
 * The section pins; scrolling slides the deck in from the right, one card at a time,
 * so every card is fully legible when it is "yours". The chrome object (see FlowObject)
 * follows the [data-flow="ring"] slot, which hops from card to card above the deck.
 */
export default function Ring({ copy }: { copy: Copy }) {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current!;
      const slot = slotRef.current!;
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const cards = q(`.${s.card}`) as HTMLElement[];

      const dist = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2);

      // deck slides left as you scroll; the pin lasts as long as the deck is wide
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => "+=" + (dist() + innerHeight * 0.4),
        pin: q(`.${s.pin}`)[0],
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = self.progress;
          gsap.set(track, { x: -p * dist() });
          if (progRef.current) progRef.current.style.width = p * 100 + "%";
          // the object hops: which card is under the centre of the screen?
          const cx = innerWidth * 0.5;
          let active = 0;
          cards.forEach((c, i) => { const r = c.getBoundingClientRect(); if (r.left < cx) active = i; });
          const r = cards[active].getBoundingClientRect();
          // position the slot above that card; a little hop (sin) between cards
          const local = (cx - r.left) / Math.max(1, r.width);
          const hop = Math.sin(Math.min(1, Math.max(0, local)) * Math.PI) * -28;
          gsap.to(slot, { x: r.left + r.width * 0.5 - slot.offsetWidth * 0.5, y: hop, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          cards.forEach((c, i) => {
            c.classList.toggle(s.active, i === active);
            // entrance: cards straighten up and brighten as they come in from the right edge
            const rc = c.getBoundingClientRect();
            const k = Math.min(1, Math.max(0, (innerWidth - rc.left) / (rc.width * 1.2)));
            gsap.set(c, { rotate: (1 - k) * 6, y: (1 - k) * 40, opacity: 0.35 + 0.65 * k });
          });
        },
      });

    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.work} id="work">
      <div className={s.pin}>
        <div className={s.head}>
          <span className="eyebrow">{copy.home.servicesEyebrow}</span>
          <span className={s.prog}>
            <i ref={progRef} />
          </span>
        </div>
        <div ref={slotRef} className={s.coreobj} data-flow="ring" aria-hidden="true" />
        <div ref={trackRef} className={s.track}>
          {copy.services.map((sv) => (
            <Link key={sv.slug} href={href(copy.lang, "services", sv.slug)} className={s.card} data-cursor>
              <Image className={s.mark} src="/assets/mark.svg" alt="" width={28} height={28} />
              <span className={s.n}>
                <b>#</b>
                {sv.num}
              </span>
              <h3>{sv.name}</h3>
              <p className={s.cardHead}>{sv.headline === sv.headline.toUpperCase() ? sentence(sv.headline) : sv.headline}</p>
              <p className={s.cardRole}>{sv.role.charAt(0).toUpperCase() + sv.role.slice(1)}.</p>
              <span className={`arrow-link ${s.cardMore}`}>{sv.cta}</span>
            </Link>
          ))}
          <div className={s.trackEnd} aria-hidden="true" />
        </div>
        <span className={`eyebrow ${s.hint}`}>{copy.home.servicesHint}</span>
      </div>
    </section>
  );
}
