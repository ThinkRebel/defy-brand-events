"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Ribbon — the home-hero background: a photo of stacked glossy-black ribbons (Unsplash),
 * moved in 3D: a slow roll/tilt, a breathing scale, and a little pointer parallax.
 * The wrapper gives the perspective; the Hero adds the scroll parallax on the wrapper.
 */
export const RIBBON_SRC = "https://images.unsplash.com/photo-1678366633407-7f49da199a42?w=2200&q=78&auto=format&fit=crop";

export default function Ribbon({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const img = root.current!.querySelector("img")!;
    const coarse = matchMedia("(pointer: coarse)").matches;
    // idle: the stack rolls and tilts as one solid object
    gsap.to(img, { rotateY: 7, rotateX: -4, scale: 1.06, duration: 11, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(img, { xPercent: -2.5, yPercent: 1.5, duration: 17, yoyo: true, repeat: -1, ease: "sine.inOut" });
    if (coarse) return;
    // pointer: a second, faster layer of tilt on a wrapper so it stacks with the idle roll
    const wrap = root.current!;
    const rx = gsap.quickTo(wrap, "rotateX", { duration: 1.6, ease: "power3" });
    const ry = gsap.quickTo(wrap, "rotateY", { duration: 1.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      ry((e.clientX / innerWidth - 0.5) * 6);
      rx((e.clientY / innerHeight - 0.5) * -4);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, { scope: root });
  return (
    <div ref={root} className={className} aria-hidden="true">
      <img src={RIBBON_SRC} alt="" fetchPriority="high" decoding="async" />
    </div>
  );
}
