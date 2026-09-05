"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Types its lines out one character at a time once it scrolls into view.
 * Renders the full text (visually hidden) up front so layout never jumps and
 * screen readers / crawlers get the complete copy immediately.
 */
export default function Typewriter({ lines, className, lineClass, lastClass, speed = 38, pause = 350, caret = true }:
  { lines: string[]; className?: string; lineClass?: string; lastClass?: string; speed?: number; pause?: number; caret?: boolean }) {
  const root = useRef<HTMLOListElement>(null);
  const [shown, setShown] = useState<number[]>(() => lines.map(() => 0));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    let started = false;
    let timer: number | undefined;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (started) return; started = true;
      if (reduce) { setShown(lines.map((l) => l.length)); setDone(true); return; }
      let li = 0, ci = 0;
      const step = () => {
        if (li >= lines.length) { setDone(true); return; }
        ci++;
        setShown((prev) => { const next = [...prev]; next[li] = ci; return next; });
        if (ci >= lines[li].length) { li++; ci = 0; timer = window.setTimeout(step, pause); }
        else timer = window.setTimeout(step, speed + (Math.random() * 40 - 20));
      };
      timer = window.setTimeout(step, 200);
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { run(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [lines, speed, pause]);

  const activeLine = shown.findIndex((n, i) => n < lines[i].length);
  return (
    <ol ref={root} className={className} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <li key={l} className={`${lineClass ?? ""} ${i === lines.length - 1 ? lastClass ?? "" : ""}`} aria-hidden="true">
          {l.slice(0, shown[i])}
          {caret && !done && (activeLine === i || (activeLine === -1 && i === lines.length - 1)) && <span className="tw-caret">|</span>}
          <span style={{ visibility: "hidden" }}>{l.slice(shown[i])}</span>
        </li>
      ))}
    </ol>
  );
}
