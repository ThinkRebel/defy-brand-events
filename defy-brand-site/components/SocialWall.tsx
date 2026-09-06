"use client";
import TiltCard from "./TiltCard";
import s from "./social.module.css";

/* Platform marks (simplified, recognisable) */
const IG = <svg viewBox="0 0 24 24" aria-label="Instagram"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>;
const LI = <svg viewBox="0 0 24 24" aria-label="LinkedIn"><rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor"/><path d="M7 10v7M7 7.2v.1M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" stroke="#1b1d21" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>;
const TT = <svg viewBox="0 0 24 24" aria-label="TikTok"><path d="M13 3v10.2a3.2 3.2 0 1 1-2.6-3.1V7.3a6 6 0 1 0 5.4 6V8.6a6.5 6.5 0 0 0 3.6 1.1V6.9A3.8 3.8 0 0 1 15.8 3H13z" fill="currentColor"/></svg>;
const XX = <svg viewBox="0 0 24 24" aria-label="X"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;
const FB = <svg viewBox="0 0 24 24" aria-label="Facebook"><circle cx="12" cy="12" r="9.5" fill="currentColor"/><path d="M13.2 20v-6.3h2.1l.3-2.5h-2.4V9.7c0-.7.2-1.2 1.2-1.2h1.3V6.3a17 17 0 0 0-1.9-.1c-1.9 0-3.2 1.1-3.2 3.2v1.8H8.5v2.5h2.1V20" fill="#1b1d21"/></svg>;

type Post = { net: React.ReactNode; brand: string; handle: string; text: string; meta: string; tone: string; tag?: string };

const POSTS: Post[] = [
  { net: IG, brand: "Kaboom Coffee", handle: "@kaboom.coffee", text: "Nieuwe blend. Oude gewoonte: te vroeg op, te veel ideeën.", meta: "2 341 likes · 87 reacties", tone: "a", tag: "Reel" },
  { net: LI, brand: "Nordlicht Studio", handle: "Nordlicht Studio · 4 812 volgers", text: "We hebben zes maanden lang nee gezegd tegen projecten die niet pasten. Dit is wat er daarna gebeurde.", meta: "412 reacties · 63 opmerkingen · 29 reposts", tone: "b" },
  { net: TT, brand: "Atlas Gym", handle: "@atlasgym", text: "POV: je eerste 5u-training. Geluid aan.", meta: "128K weergaven", tone: "c", tag: "Video" },
  { net: XX, brand: "Maison Verte", handle: "@maisonverte", text: "Een plant vraagt niets. Behalve dat je even stopt.", meta: "1 204 reposts · 5 6K likes", tone: "d" },
  { net: FB, brand: "Bakkerij Soet", handle: "Bakkerij Soet", text: "Zaterdag 7u. De eerste croissants. Wie staat er vooraan?", meta: "839 vind-ik-leuks · 142 reacties", tone: "e", tag: "Foto" },
];

/** Cards that look like real posts across the channels we run — fictional brands, real platforms. */
export default function SocialWall({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className={s.wall}>
      <div className={s.head}>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className={s.grid}>
        {POSTS.map((p, i) => (
          <div key={p.brand} className={`${s.slot} ${s["slot" + i]}`}>
            <TiltCard className={s.post} delay={i * 0.08} from={i % 2 ? "right" : "up"}>
              <header className={s.top}>
                <span className={`${s.avatar} ${s[p.tone]}`}>{p.brand.slice(0, 1)}</span>
                <span className={s.who}><b>{p.brand}</b><small>{p.handle}</small></span>
                <span className={s.net}>{p.net}</span>
              </header>
              <div className={`${s.visual} ${s[p.tone]}`}>{p.tag && <span className={s.tag}>{p.tag}</span>}</div>
              <p className={s.text}>{p.text}</p>
              <footer className={s.meta}>{p.meta}</footer>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
