"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import k from "./kinetic.module.css";

/* ------------------------------------------------------------------------------------------
 *  Kinetic headlines. One block of shouting capitals is hard to read, so a headline is split
 *  into its sentences and each sentence gets its own voice:
 *    sentence 1 → display, white       (the statement)
 *    sentence 2 → fluo                  (the twist)
 *    sentence 3 → outlined, no fill     (the aside)
 *  …and each mode moves differently:
 *    "slide" → words slide in from alternating sides, then keep drifting a little on scroll
 *    "type"  → a typewriter with a fluo block cursor (starts when the block scrolls into view)
 *    "flip"  → every word flips up out of a mask, line by line
 * ---------------------------------------------------------------------------------------- */

export type KineticMode = "slide" | "type" | "flip";

const VOICES = [k.v0, k.v1, k.v2];

function sentences(t: string) {
  // a colon also ends a "sentence": the part after it gets its own voice
  const out = t.match(/[^.!?…:]+[.!?…:]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [t];
  return out;
}

/** A long sentence never becomes one shouting block: the first words shout, the rest talks. */
function shape(s: string): { lead: string; rest: string } {
  if (s.length <= 56) return { lead: s, rest: "" };
  const w = s.split(/\s+/);
  const n = Math.min(4, Math.max(2, Math.round(w.length * 0.3)));
  return { lead: w.slice(0, n).join(" "), rest: w.slice(n).join(" ") };
}

export default function Kinetic({ text, as: Tag = "h2", mode = "slide", className = "", start = "top 80%", delay = 0 }: { text: string; as?: "h1" | "h2" | "h3" | "p"; mode?: KineticMode; className?: string; start?: string; delay?: number }) {
  const root = useRef<HTMLElement>(null);
  const parts = sentences(text);

  useGSAP(() => {
    const el = root.current!;
    const words = Array.from(el.querySelectorAll<HTMLElement>(`.${k.w}`));
    if (prefersReducedMotion()) return;
    if (mode === "type") {
      const chars = Array.from(el.querySelectorAll<HTMLElement>(`.${k.c}`));
      gsap.set(chars, { opacity: 0 });
      const cursor = el.querySelector(`.${k.cursor}`) as HTMLElement;
      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start } });
      tl.to(chars, { opacity: 1, duration: 0.01, stagger: { each: 0.045, onStart() { /* cursor follows the last typed char */ } } });
      // move the cursor after each char
      chars.forEach((ch, i) => tl.call(() => { ch.after(cursor); }, [], 0.045 * i + 0.01));
      tl.call(() => cursor.classList.add(k.blink));
      return;
    }
    if (mode === "flip") {
      gsap.set(words, { yPercent: 110, rotateX: -60, opacity: 0 });
      gsap.to(words, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.06, delay, scrollTrigger: { trigger: el, start } });
      return;
    }
    // slide: alternate sides per line
    const lines = new Map<number, HTMLElement[]>();
    words.forEach((w) => { const y = Math.round(w.offsetTop); (lines.get(y) ?? lines.set(y, []).get(y)!).push(w); });
    let li = 0;
    for (const ws of lines.values()) {
      const dir = li % 2 === 0 ? -1 : 1;
      gsap.fromTo(ws, { x: dir * 120, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.05, delay: delay + li * 0.08, scrollTrigger: { trigger: el, start } });
      // subtle continuous drift with scroll, opposite per line — the block never sits still
      gsap.to(ws, { x: dir * -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      li++;
    }
  }, { scope: root, dependencies: [text, mode] });

  return (
    <Tag ref={root as never} className={`${k.kin} ${k[mode]} ${className}`}>
      {parts.map((s, si) => {
        const { lead, rest } = shape(s);
        const words = (txt: string) => txt.split(/\s+/).map((w, wi) => (
          <span key={wi} className={k.wm}>
            <span className={k.w}>
              {mode === "type" ? Array.from(w).map((ch, ci) => <span key={ci} className={k.c}>{ch}</span>) : w}
            </span>{" "}
          </span>
        ));
        return (
          <span key={si} className={`${k.s} ${VOICES[si % VOICES.length]}`}>
            {words(lead)}
            {rest && <span className={k.rest}>{words(rest)}</span>}
          </span>
        );
      })}
      {mode === "type" && <span className={k.cursor} aria-hidden="true" />}
    </Tag>
  );
}
