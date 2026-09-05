"use client";
import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

/** Glass card with pointer tilt and a scroll-in from the side. Used for every card grid on the site. */
export default function TiltCard({ children, className, delay = 0, from = "right" }: { children: ReactNode; className?: string; delay?: number; from?: "right" | "left" | "up" }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`); el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100 + 50).toFixed(1)}%`); el.style.setProperty("--my", `${(y * 100 + 50).toFixed(1)}%`);
  };
  const leave = () => { const el = ref.current!; el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
  const init = from === "right" ? { x: 80, opacity: 0, rotate: 3 } : from === "left" ? { x: -80, opacity: 0, rotate: -3 } : { y: 60, opacity: 0 };
  return (
    <motion.div initial={init} whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }} style={{ height: "100%" }}>
      <div ref={ref} className={`tilt ${className ?? ""}`} onPointerMove={move} onPointerLeave={leave}>
        <span className="tilt-shine" aria-hidden="true" />
        {children}
      </div>
    </motion.div>
  );
}
