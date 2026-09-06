"use client";
import TiltCard from "./TiltCard";
import { SocialCubes } from "./Props";
import s from "./social.module.css";

/* ------------------------------------------------------------------------------
 *  Five posts, each drawn in the real chrome of its platform (wordmark, action row,
 *  counters, TikTok side rail). Fictional brands, real platforms. The media is the
 *  chrome/fluo tornado (/contact/tornado.png) — the house material, everywhere.
 * ---------------------------------------------------------------------------- */

const Media = ({ tall = false }: { tall?: boolean }) => (
  <div className={`${s.media} ${tall ? s.tall : ""}`}>
    <img src="/contact/tornado.png" alt="" loading="lazy" onError={(e) => ((e.currentTarget.style.display = "none"))} />
  </div>
);
const Avatar = ({ tone }: { tone: string }) => <span className={`${s.avatar} ${s[tone]}`} />;

const Heart = <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.5 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.4C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.5 4.3 6.8C17.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>;
const Bubble = <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-4.6A8 8 0 1 1 21 12z" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>;
const Send = <svg viewBox="0 0 24 24"><path d="M21 3 3 10.5l7.5 3L13.5 21 21 3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
const Book = <svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4V3z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
const Thumb = <svg viewBox="0 0 24 24"><path d="M7 11v9H3v-9h4zm2 0 4-8c1.7 0 2.8 1.3 2.4 3l-.7 3H20a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 18.8 20H9v-9z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
const Share = <svg viewBox="0 0 24 24"><path d="M14 5l7 6-7 6v-4c-5 0-8 1.6-11 5 1-5 4-9 11-9V5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
const Repost = <svg viewBox="0 0 24 24"><path d="M17 2l4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4M21 13v3a2 2 0 0 1-2 2H3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Stats = <svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
const Up = <svg viewBox="0 0 24 24"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 14v6h16v-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Home = <svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v10h-6v-6H9v6H3V11z" fill="currentColor"/></svg>;
const Friends = <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
const Inbox = <svg viewBox="0 0 24 24"><path d="M4 5h16v11h-5l-3 3-3-3H4V5z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>;
const Person = <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.7"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
const Note = <svg viewBox="0 0 24 24"><path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="17" cy="16" r="3" fill="currentColor"/></svg>;

const LI = (
  <span className={s.liMark}>Linked<b>in</b></span>
);

export default function SocialWall({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className={s.wall}>
      <div className={s.head}>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <SocialCubes />
      <div className={s.grid}>
        {/* Instagram */}
        <TiltCard className={`${s.post} ${s.ig}`} from="up" delay={0}>
          <header className={s.igTop}><span className={s.igWord}>Instagram</span><span className={s.ico}>{Send}</span></header>
          <div className={s.row}><Avatar tone="a" /><b>kaboom.coffee</b><span className={s.dots}>···</span></div>
          <Media />
          <div className={s.actions}><span className={s.ico}>{Heart}</span><span className={s.ico}>{Bubble}</span><span className={s.ico}>{Send}</span><span className={s.dotsNav}><i className={s.dotOn} /><i /><i /><i /></span><span className={`${s.ico} ${s.right}`}>{Book}</span></div>
          <p className={s.cap}><b>kaboom.coffee</b> Nieuwe blend. Oude gewoonte: te vroeg op, te veel ideeën.</p>
          <p className={s.count}>2 341 vind-ik-leuks</p>
        </TiltCard>

        {/* Facebook */}
        <TiltCard className={`${s.post} ${s.fb}`} from="up" delay={0.08}>
          <header className={s.fbTop}><span className={s.fbWord}>facebook</span><span className={s.fbBtns}><i>+</i><i>⌕</i><i>✉</i></span></header>
          <div className={s.row}><Avatar tone="e" /><span><b>Bakkerij Soet</b><small>2 u · 🌐</small></span><span className={s.dots}>···</span></div>
          <p className={s.capTop}>Zaterdag 7u. De eerste croissants. Wie staat er vooraan?</p>
          <Media />
          <div className={s.fbStats}><span><i className={s.rxL}>👍</i><i className={s.rxH}>❤️</i><i className={s.rxW}>😮</i> 128</span><span>12 opmerkingen · 8 keer gedeeld</span></div>
          <div className={s.fbActions}><span>{Thumb} Vind ik leuk</span><span>{Bubble} Opmerking plaatsen</span><span>{Share} Delen</span></div>
        </TiltCard>

        {/* LinkedIn */}
        <TiltCard className={`${s.post} ${s.li}`} from="up" delay={0.16}>
          <header className={s.liTop}>{LI}<span className={s.dots}>···</span></header>
          <div className={s.row}><Avatar tone="b" /><span><b>Nordlicht Studio</b><small>4 812 volgers · 2 u · 🌐</small></span></div>
          <p className={s.capTop}>We hebben zes maanden lang nee gezegd tegen projecten die niet pasten. Dit is wat er daarna gebeurde.</p>
          <Media />
          <div className={s.fbStats}><span><i className={s.rxL}>👍</i><i className={s.rxH}>❤️</i><i className={s.rxC}>👏</i> 273</span><span>17 comments · 6 reposts</span></div>
          <div className={s.fbActions}><span>{Thumb} Like</span><span>{Bubble} Comment</span><span>{Repost} Repost</span><span>{Send} Send</span></div>
        </TiltCard>

        {/* X */}
        <TiltCard className={`${s.post} ${s.x}`} from="right" delay={0.1}>
          <header className={s.xTop}><span className={s.xMark}>𝕏</span><span className={s.dots}>···</span></header>
          <div className={s.row}><Avatar tone="d" /><span><b>Maison Verte</b><small>@maisonverte · 2h</small></span><span className={s.dots}>···</span></div>
          <p className={s.capTop}>Een plant vraagt niets. Behalve dat je even stopt.</p>
          <Media />
          <div className={s.xActions}><span>{Bubble} 12</span><span>{Repost} 48</span><span>{Heart} 273</span><span>{Stats} 12K</span><span>{Up}</span></div>
        </TiltCard>

        {/* TikTok */}
        <TiltCard className={`${s.post} ${s.tt}`} from="right" delay={0.2}>
          <div className={s.ttTop}><span className={s.live}>LIVE</span><span>Following</span><b>For You</b><span className={s.ico}>⌕</span></div>
          <Media tall />
          <aside className={s.rail}>
            <span className={s.railAv}><Avatar tone="c" /><i>+</i></span>
            <span>{Heart}<small>25.4K</small></span>
            <span>{Bubble}<small>342</small></span>
            <span>{Book}<small>1,2K</small></span>
            <span>{Share}<small>678</small></span>
            <span className={s.disc}>{Note}</span>
          </aside>
          <div className={s.ttMeta}><b>@atlasgym</b><p>POV: je eerste 5u-training. Geluid aan.</p><small>♪ original sound — Atlas Gym</small></div>
          <nav className={s.ttNav}><span>{Home}<small>Home</small></span><span>{Friends}<small>Friends</small></span><span className={s.plus}>+</span><span>{Inbox}<small>Inbox</small></span><span>{Person}<small>Profile</small></span></nav>
        </TiltCard>
      </div>
    </section>
  );
}
