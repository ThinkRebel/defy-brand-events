"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import s from "./home.module.css";

/**
 * One chrome object for the whole home page.
 *
 * The sections only contain empty slots ([data-flow]). This fixed-layer object reads the slots'
 * live positions every frame and travels between them as you scroll: it grows out of the hero,
 * slides across into the statement, settles beside the manifesto (and holds while that section is
 * pinned), then shrinks into the heart of the ring and fades. Because the slots are measured live,
 * pinned sections, resizes and font loads all just work.
 */
type Seg = { el: HTMLElement; start: number; hold: number };

/** `children` swaps the chrome object for another sprite (the compass on SEO, the DNA strand on marketing). */
export default function FlowObject({ children }: { children?: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const node = el.current!;
    const img = node.firstElementChild as HTMLElement;
    const slots = () => Array.from(document.querySelectorAll<HTMLElement>("[data-flow]"));

    if (prefersReducedMotion()) {
      const h = slots()[0];
      if (h) { const r = h.getBoundingClientRect(); gsap.set(node, { position: "absolute", left: r.left + scrollX, top: r.top + scrollY, width: r.width, opacity: 1 }); }
      return;
    }

    let segs: Seg[] = [];
    const measure = () => {
      const vh = innerHeight;
      segs = slots().map((el) => {
        const r = el.getBoundingClientRect();
        const docCenter = r.top + scrollY + r.height / 2;
        // scroll position at which this slot sits ~45% down the viewport
        const start = Math.max(0, docCenter - vh * 0.45);
        // if the slot lives inside a pinned section, hold there for the pin's length
        const pin = ScrollTrigger.getAll().find((t) => t.pin && (t.pin as HTMLElement).contains(el));
        const hold = pin ? Math.max(0, pin.end - pin.start) : 0;
        return { el, start, hold };
      });
    };

    const cur = { x: 0, y: 0, w: 0, o: 0, r: 0 };
    let first = true;
    const ease = (t: number) => t * t * (3 - 2 * t);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      if (!segs.length) return;
      const S = scrollY;
      let target: { x: number; y: number; w: number; o: number };
      const rectOf = (i: number) => segs[i].el.getBoundingClientRect();

      // find the segment we are in
      let i = 0;
      while (i < segs.length - 1 && S >= segs[i + 1].start) i++;
      const a = segs[i];
      const ra = rectOf(i);
      const aEnd = a.start + a.hold;
      if (i === segs.length - 1) {
        // after the last slot: hold through its pin, then let go
        const fade = Math.min(1, Math.max(0, (S - aEnd) / (innerHeight * 0.5)));
        target = { x: ra.left, y: ra.top, w: ra.width * (1 - 0.4 * fade), o: 1 - fade };
      } else if (S <= aEnd) {
        target = { x: ra.left, y: ra.top, w: ra.width, o: 1 };
      } else {
        const b = segs[i + 1];
        const rb = rectOf(i + 1);
        const t = ease(Math.min(1, (S - aEnd) / Math.max(1, b.start - aEnd)));
        // arc a little on the way so it feels like it is flying, not sliding
        const arc = Math.sin(t * Math.PI) * innerHeight * 0.06;
        target = { x: lerp(ra.left, rb.left, t), y: lerp(ra.top, rb.top, t) - arc, w: lerp(ra.width, rb.width, t), o: 1 };
      }
      // smooth follow
      // a slot can hide the object until its own scene has handed over (e.g. dust → object)
      const rv = parseFloat(getComputedStyle(segs[i].el).getPropertyValue("--reveal"));
      if (!isNaN(rv)) target.o *= rv;
      const k = first ? 1 : 0.18;
      cur.x = lerp(cur.x, target.x, k); cur.y = lerp(cur.y, target.y, k); cur.w = lerp(cur.w, target.w, k); cur.o = lerp(cur.o, target.o, k);
      cur.r = S * 0.03; // slow continuous turn with scroll
      first = false;
      gsap.set(node, { x: cur.x, y: cur.y, width: cur.w, opacity: cur.o, rotate: cur.r });
    };

    gsap.set(node, { position: "fixed", top: 0, left: 0, opacity: 0 });
    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    gsap.ticker.add(tick);
    // ambient float on the image itself, independent of the travel
    gsap.to(img, { y: -16, duration: 4.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    return () => { ScrollTrigger.removeEventListener("refresh", measure); gsap.ticker.remove(tick); };
  });

  return (
    <div ref={el} className={s.flow} aria-hidden="true">
      {children ?? <Image src="/assets/object.webp" alt="" width={624} height={670} priority />}
    </div>
  );
}
