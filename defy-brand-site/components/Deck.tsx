"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { Copy } from "@/content";
import s from "./home.module.css";

/**
 * From idea to action — a deck of glass cards that slides in from the right while the section
 * is pinned. Every card is fully legible when it is centred. The chrome object (FlowObject)
 * follows the [data-flow="chain"] slot, which hops from card to card above the deck.
 */
type Item = { h: string; p: string; last?: boolean };
export default function Deck({ copy, eyebrow, items: given, flow = "chain", numbered = true }: { copy: Copy; eyebrow?: string; items?: Item[]; flow?: string; numbered?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const items: Item[] = given ?? [...copy.home.chain.map((c) => ({ h: c.h, p: c.p })), { h: "Events", p: copy.home.chainNote, last: true }];
  const label = eyebrow ?? copy.home.chainEyebrow;

  useGSAP(
    () => {
      const track = trackRef.current!;
      const slot = slotRef.current!;
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const cards = q(`.${s.dCard}`) as HTMLElement[];
      const dist = () => Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2);

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => "+=" + (dist() + innerHeight * 0.5),
        pin: q(`.${s.dPin}`)[0],
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          gsap.set(track, { x: -self.progress * dist() });
          const cx = innerWidth * 0.5;
          let active = 0;
          cards.forEach((c, i) => { if (c.getBoundingClientRect().left < cx) active = i; });
          const r = cards[active].getBoundingClientRect();
          const local = Math.min(1, Math.max(0, (cx - r.left) / Math.max(1, r.width)));
          const hop = Math.sin(local * Math.PI) * -34;
          gsap.to(slot, { x: r.left + r.width * 0.5 - slot.offsetWidth * 0.5, y: hop, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          cards.forEach((c, i) => {
            c.classList.toggle(s.dActive, i === active);
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
    <section ref={root} className={s.deck} aria-label={label}>
      <div className={s.dPin}>
        <div className={s.dHead}><span className="eyebrow">{label}</span></div>
        <div ref={slotRef} className={s.dSlot} data-flow={flow} aria-hidden="true">{flow !== "chain" && <img src="/assets/object.webp" alt="" />}</div>
        <div ref={trackRef} className={s.dTrack}>
          {items.map((it, i) => (
            <article key={it.h} className={`${s.dCard} ${it.last ? s.dLast : ""}`}>
              {numbered && <span className={s.dNum}>{it.last ? "→" : String(i + 1).padStart(2, "0")}</span>}
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </article>
          ))}
          <div className={s.dEnd} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
