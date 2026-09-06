"use client";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CardStack, CardOrbit } from "./Rings";
import { Compass, Blender } from "./Props";
import Typewriter from "./Typewriter";
import TiltCard from "./TiltCard";
import v from "./visuals.module.css";

/* ------------------------------------------------------------------ */
/*  Every service gets its own signature scene. Same chrome/fluo DNA, */
/*  different behaviour: the visual does what the service claims.     */
/* ------------------------------------------------------------------ */

type T3 = { nl: string; fr: string; en: string };
const t = (lang: Lang, o: T3) => o[lang];

/** Hero-level visual per service (sits where the chrome object normally sits). */
export function ServiceScene({ slug, lang, slotRef }: { slug: string; lang: Lang; slotRef?: React.RefObject<HTMLDivElement | null> }) {
  switch (slug) {
    case "strategy":
      return <Radar />;
    case "brand-creative":
      return <SwatchFan />;
    case "copywriting":
      return <LetterRain />;
    case "website-design":
      return <CardOrbit />;
    case "marketing":
      // the DNA strand is the page's floating object itself (FlowObject → HelixSprite); the hero only offers the slot
      return null;
    case "seo":
      return <Compass fallback={<RankClimb lang={lang} />} slotRef={slotRef} />;
    case "geo":
      return <Blender fallback={<AiAnswer lang={lang} />} />;
    case "agent-ready":
      return <SchemaCheck />;
    case "agentic-workflow":
      return <NodeGraph />;
    default:
      return null;
  }
}

/** Mid-page feature per service — a section that breaks the template. */
export function ServiceFeature({ slug, lang }: { slug: string; lang: Lang }) {
  switch (slug) {
    case "strategy":
      return (
        <Feature eyebrow={t(lang, { nl: "Eén vraag, elke keer", fr: "Une seule question, chaque fois", en: "One question, every time" })}>
          <div className={v.qgrid}>
            {[
              { nl: "Wat moet dit opleveren?", fr: "Qu'est-ce que ça doit rapporter ?", en: "What has this got to deliver?" },
              { nl: "Voor wie, en waarom nu?", fr: "Pour qui, et pourquoi maintenant ?", en: "For whom — and why now?" },
              { nl: "Wat laten we bewust liggen?", fr: "Qu'est-ce qu'on laisse sciemment de côté ?", en: "What do we deliberately leave out?" },
              { nl: "Waaraan zien we dat het werkt?", fr: "À quoi verra-t-on que ça marche ?", en: "How will we know it works?" },
            ].map((q, i) => (
              <TiltCard key={i} from={i % 2 ? "right" : "left"} delay={i * 0.08} className={v.qcard}>
                <b>0{i + 1}</b>
                <p>{t(lang, q)}</p>
              </TiltCard>
            ))}
          </div>
        </Feature>
      );
    case "brand-creative":
      return (
        <Feature eyebrow={t(lang, { nl: "Eén merk, elke toon", fr: "Une marque, tous les registres", en: "One brand, every register" })}>
          <ToneShift />
        </Feature>
      );
    case "copywriting":
      return (
        <Feature eyebrow={t(lang, { nl: "Voor / na", fr: "Avant / après", en: "Before / after" })}>
          <BeforeAfter lang={lang} />
        </Feature>
      );
    case "website-design":
      return (
        <Feature eyebrow={t(lang, { nl: "Wat een site bij ons altijd is", fr: "Ce qu'un site est toujours, chez nous", en: "What a site always is, with us" })}>
          <CardStack items={[
            { img: "https://images.unsplash.com/photo-1525453719223-4e781eb83a4c?w=900&q=75&auto=format&fit=crop", h: t(lang, { nl: "Snel", fr: "Rapide", en: "Fast" }), p: t(lang, { nl: "Traagheid voel je eerst.", fr: "La lenteur se sent en premier.", en: "Slowness is felt first." }) },
            { img: "https://images.unsplash.com/photo-1502979932800-33d311b7ce56?w=900&q=75&auto=format&fit=crop", h: t(lang, { nl: "Eén verhaal", fr: "Une histoire", en: "One story" }), p: t(lang, { nl: "Met een volgorde.", fr: "Avec un ordre.", en: "With an order." }) },
            { img: "https://images.unsplash.com/photo-1531318701087-32c11653dd77?w=900&q=75&auto=format&fit=crop", h: "Motion", p: t(lang, { nl: "Waar het richting geeft.", fr: "Là où ça guide.", en: "Where it gives direction." }) },
            { img: "https://images.unsplash.com/photo-1649326609138-09de2b661544?w=900&q=75&auto=format&fit=crop", h: t(lang, { nl: "Eerlijk", fr: "Honnête", en: "Honest" }), p: t(lang, { nl: "Geen dark patterns.", fr: "Pas de dark patterns.", en: "No dark patterns." }) },
            { img: "https://images.unsplash.com/photo-1582133456304-2f5cb1c2afbb?w=900&q=75&auto=format&fit=crop", h: "Responsive", p: t(lang, { nl: "Op de trein even sterk.", fr: "Aussi fort dans le train.", en: "As strong on the train." }) },
            { img: "https://images.unsplash.com/photo-1598944999410-e93772fc48a5?w=900&q=75&auto=format&fit=crop", h: "SEO & GEO", p: t(lang, { nl: "Vanaf dag één ingebouwd.", fr: "Intégrés dès le premier jour.", en: "Built in from day one." }) },
            { img: "https://images.unsplash.com/photo-1611330500121-d9439ddc3d9d?w=900&q=75&auto=format&fit=crop", h: t(lang, { nl: "Van jou", fr: "À vous", en: "Yours" }), p: t(lang, { nl: "Merk in elke pixel.", fr: "La marque dans chaque pixel.", en: "Brand in every pixel." }) },
          ]} />
        </Feature>
      );
    case "seo":
      return (
        <Feature eyebrow={t(lang, { nl: "Wat we meten", fr: "Ce que nous mesurons", en: "What we measure" })}>
          <Meters lang={lang} />
        </Feature>
      );
    case "geo":
      return (
        <Feature eyebrow={t(lang, { nl: "Hoe een AI je leest", fr: "Comment une IA vous lit", en: "How an AI reads you" })}>
          <CiteChain lang={lang} />
        </Feature>
      );
    case "agent-ready":
      return (
        <Feature eyebrow={t(lang, { nl: "Mens vs. machine", fr: "Humain vs machine", en: "Human vs. machine" })}>
          <TwoViews lang={lang} />
        </Feature>
      );
    case "agentic-workflow":
      return (
        <Feature eyebrow={t(lang, { nl: "Een nacht werk, in seconden", fr: "Une nuit de travail, en secondes", en: "A night's work, in seconds" })}>
          <Pipeline lang={lang} />
        </Feature>
      );
    default:
      return null;
  }
}

function Feature({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section className={v.feature}>
      <span className="eyebrow">{eyebrow}</span>
      <div className={v.featureBody}>{children}</div>
    </section>
  );
}

/* ---------------- canvas helpers ---------------- */
function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, tm: number) => void) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    const still = prefersReducedMotion();
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, devicePixelRatio || 1);
      c.width = Math.max(1, r.width * dpr);
      c.height = Math.max(1, r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    const loop = (tm: number) => {
      const r = c.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      draw(ctx, r.width, r.height, still ? 0 : tm / 1000);
      if (!still) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw]);
  return ref;
}
const FLUO = "#e4ff2e";
const chrome = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, hot = false) => {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  if (hot) {
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.3, FLUO);
    g.addColorStop(1, "#7f8f00");
  } else {
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.35, "#c9c9c9");
    g.addColorStop(0.7, "#5a5a5a");
    g.addColorStop(1, "#1a1a1a");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

/* ---------------- STRATEGY: radar sweeping, blips lock in ---------------- */
function Radar() {
  const ref = useCanvas((ctx, w, h, tm) => {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
    ctx.stroke();
    const a = tm * 0.9;
    const g = ctx.createConicGradient(a - Math.PI * 0.5, cx, cy);
    g.addColorStop(0, "rgba(228,255,46,0.55)");
    g.addColorStop(0.18, "rgba(228,255,46,0)");
    g.addColorStop(1, "rgba(228,255,46,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    const blips = [[0.7, 0.9], [0.35, 2.4], [0.85, 4.0], [0.55, 5.3]];
    blips.forEach(([d, ang], i) => {
      const x = cx + Math.cos(ang) * R * d, y = cy + Math.sin(ang) * R * d;
      const diff = ((a - ang) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const glow = Math.max(0, 1 - diff / 2.2);
      chrome(ctx, x, y, 6 + glow * 5 + (i === 2 ? 4 : 0), glow > 0.5);
    });
    chrome(ctx, cx, cy, R * 0.12, true);
  });
  return <canvas ref={ref} className={v.fill} aria-hidden="true" />;
}

/* ---------------- BRAND: fan of glass swatches ---------------- */
function SwatchFan() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = gsap.utils.toArray<HTMLElement>(`.${v.swatch}`, root.current);
    gsap.from(cards, { rotate: 0, y: 40, opacity: 0, duration: 1.4, ease: "expo.out", stagger: 0.08, delay: 0.3 });
    gsap.to(cards, { y: (i) => -6 - i * 2, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.15 });
  }, { scope: root });
  const items = ["DEFY", "&", "BRAND", "EVENTS", "REBEL"];
  return (
    <div ref={root} className={v.fan} aria-hidden="true">
      {items.map((w, i) => (
        <div key={w} className={v.swatch} style={{ ["--i" as string]: i - 2 }}>
          <span>{w}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- BRAND feature: same sentence, three tones ---------------- */
function ToneShift() {
  const tones = [
    { k: "LOUD", s: "We don't sell. We start something." },
    { k: "CALM", s: "We help brands say one true thing, well." },
    { k: "SHARP", s: "Ideas are cheap. Experiences aren't." },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((x) => (x + 1) % tones.length), 2600);
    return () => clearInterval(id);
  }, [tones.length]);
  return (
    <div className={v.tone}>
      <div className={v.toneTabs}>
        {tones.map((tn, j) => (
          <button key={tn.k} className={j === i ? v.on : ""} onClick={() => setI(j)}>{tn.k}</button>
        ))}
      </div>
      <p className={`${v.toneLine} ${v["t" + i]}`} key={i}>{tones[i].s}</p>
    </div>
  );
}

/* ---------------- COPY: letters raining into a headline ---------------- */
function LetterRain() {
  const word = "EVERY WORD EARNS ITS PLACE";
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const ls = gsap.utils.toArray<HTMLElement>("span", root.current);
    gsap.from(ls, { y: () => -120 - Math.random() * 200, opacity: 0, rotate: () => (Math.random() - 0.5) * 40, duration: 1.2, ease: "bounce.out", stagger: { each: 0.05, from: "random" }, delay: 0.3 });
  }, { scope: root });
  return (
    <div ref={root} className={v.rain} aria-hidden="true">
      {word.split("").map((ch, i) => (
        <span key={i} className={ch === " " ? v.sp : ch === "W" || ch === "E" ? v.hot : ""}>{ch}</span>
      ))}
    </div>
  );
}

function BeforeAfter({ lang }: { lang: Lang }) {
  const pairs = {
    nl: [["Wij zijn een full-service partner voor al uw communicatienoden.", "We maken merken waar mensen iets bij voelen."], ["Neem vrijblijvend contact op.", "Let's make some noise."]],
    fr: [["Nous sommes votre partenaire full-service pour tous vos besoins en communication.", "On crée des marques qui font ressentir quelque chose."], ["N'hésitez pas à nous contacter.", "Let's make some noise."]],
    en: [["We are a full-service partner for all your communication needs.", "We build brands people feel something about."], ["Feel free to reach out.", "Let's make some noise."]],
  }[lang];
  return (
    <div className={v.ba}>
      {pairs.map(([a, b], i) => (
        <TiltCard key={i} from={i % 2 ? "right" : "left"} className={v.baCard}>
          <s>{a}</s>
          <Typewriter className={v.baAfter} lines={[b]} caret speed={28} />
        </TiltCard>
      ))}
    </div>
  );
}

/* ---------------- SEO: result climbs to #1 ---------------- */
function RankClimb({ lang }: { lang: Lang }) {
  const root = useRef<HTMLDivElement>(null);
  const rows = [
    t(lang, { nl: "grote-concurrent.be", fr: "gros-concurrent.be", en: "big-competitor.com" }),
    "marktplaats-generiek.com",
    t(lang, { nl: "jouwmerk.be", fr: "votremarque.be", en: "yourbrand.com" }),
    "lijstje-top10.net",
  ];
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const you = root.current!.querySelector(`.${v.you}`) as HTMLElement;
    const others = gsap.utils.toArray<HTMLElement>(`.${v.res}:not(.${v.you})`, root.current);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 0.8 });
    tl.to(you, { y: -you.offsetHeight * 2 - 24, duration: 1.4, ease: "expo.inOut" })
      .to(others.slice(0, 2), { y: you.offsetHeight + 12, duration: 1.4, ease: "expo.inOut" }, "<")
      .to({}, { duration: 2 })
      .to([you, ...others], { y: 0, duration: 0.8, ease: "expo.inOut" });
  }, { scope: root });
  return (
    <div ref={root} className={v.serp} aria-hidden="true">
      <div className={v.serpBar}><Typewriter lines={[t(lang, { nl: "beste creatief bureau belgië", fr: "meilleure agence créative belgique", en: "best creative agency belgium" })]} caret speed={40} /></div>
      {rows.map((r, i) => (
        <div key={r} className={`${v.res} ${i === 2 ? v.you : ""}`}>
          <b>{i + 1}</b>
          <span>{r}</span>
          <i />
        </div>
      ))}
    </div>
  );
}
function Meters({ lang }: { lang: Lang }) {
  const ms = [
    { k: t(lang, { nl: "Vindbaar op wat telt", fr: "Trouvable sur ce qui compte", en: "Found for what matters" }), n: 92 },
    { k: t(lang, { nl: "Snelheid & Core Web Vitals", fr: "Vitesse & Core Web Vitals", en: "Speed & Core Web Vitals" }), n: 98 },
    { k: t(lang, { nl: "Pagina's die AI's citeren", fr: "Pages que les IA citent", en: "Pages AIs cite" }), n: 71 },
  ];
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(gsap.utils.toArray<HTMLElement>(`.${v.meterBar} i`, root.current), { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.out", stagger: 0.15, scrollTrigger: { trigger: root.current, start: "top 80%" } });
  }, { scope: root });
  return (
    <div ref={root} className={v.meters}>
      {ms.map((m) => (
        <div key={m.k} className={v.meter}>
          <span>{m.k}</span>
          <div className={v.meterBar}><i style={{ width: m.n + "%" }} /></div>
          <b>{m.n}</b>
        </div>
      ))}
      <p className={v.note}>{t(lang, { nl: "Illustratieve waarden — we meten met jouw data.", fr: "Valeurs illustratives — on mesure avec vos données.", en: "Illustrative values — we measure with your data." })}</p>
    </div>
  );
}

/* ---------------- GEO: an AI answer that cites you ---------------- */
function AiAnswer({ lang }: { lang: Lang }) {
  const q = t(lang, { nl: "Welk bureau maakt merken die je voelt?", fr: "Quelle agence crée des marques qu'on ressent ?", en: "Which agency builds brands you can feel?" });
  const a = t(lang, {
    nl: "Defy & Brand Events (Oostende) bouwt merken als ervaringen — van strategie tot website. Bron: defyandbrandevents.be",
    fr: "Defy & Brand Events (Ostende) construit des marques comme des expériences — de la stratégie au site. Source : defyandbrandevents.be",
    en: "Defy & Brand Events (Ostend) builds brands as experiences — from strategy to website. Source: defyandbrandevents.be",
  });
  return (
    <div className={v.ai} aria-hidden="true">
      <div className={v.aiQ}>{q}</div>
      <div className={v.aiA}>
        <i className={v.aiDot} />
        <Typewriter lines={[a]} caret speed={22} />
      </div>
    </div>
  );
}
function CiteChain({ lang }: { lang: Lang }) {
  const steps = [
    t(lang, { nl: "Een echte vraag", fr: "Une vraie question", en: "A real question" }),
    t(lang, { nl: "Een pagina die ze beantwoordt", fr: "Une page qui y répond", en: "A page that answers it" }),
    t(lang, { nl: "Feiten die de AI kan citeren", fr: "Des faits que l'IA peut citer", en: "Facts the AI can quote" }),
    t(lang, { nl: "Jouw naam in het antwoord", fr: "Votre nom dans la réponse", en: "Your name in the answer" }),
  ];
  return (
    <ol className={v.chain}>
      {steps.map((s, i) => (
        <li key={s}>
          <TiltCard from="up" delay={i * 0.1} className={v.chainCard}>
            <b>{i + 1}</b>
            <p>{s}</p>
          </TiltCard>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- AGENT READY: schema lights up ---------------- */
function SchemaCheck() {
  const lines = ['"@type": "Organization"', '"name": "Defy & Brand Events"', '"offers": 9 × Service', '"sameAs": [...]', '"contactPoint": ✓', '"faq": 12 answers'];
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const rows = gsap.utils.toArray<HTMLElement>("li", root.current);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 0.4 });
    tl.from(rows, { opacity: 0, x: -14, duration: 0.5, stagger: 0.28, ease: "power2.out" })
      .to(rows, { className: `+=${v.ok}`, stagger: 0.28, duration: 0.01 }, "<0.3")
      .to({}, { duration: 1.6 })
      .to(rows, { opacity: 0, duration: 0.4 })
      .set(rows, { className: `-=${v.ok}` });
  }, { scope: root });
  return (
    <div ref={root} className={v.schema} aria-hidden="true">
      <div className={v.schemaHead}>{"{ machine-readable }"}</div>
      <ul>
        {lines.map((l) => (
          <li key={l}><span>{l}</span><i /></li>
        ))}
      </ul>
    </div>
  );
}
function TwoViews({ lang }: { lang: Lang }) {
  return (
    <div className={v.two}>
      <TiltCard from="left" className={v.twoCard}>
        <span className="eyebrow">{t(lang, { nl: "Wat een mens ziet", fr: "Ce qu'un humain voit", en: "What a human sees" })}</span>
        <h3>WE TURN IDEAS INTO EXPERIENCES.</h3>
        <p>{t(lang, { nl: "Beeld, ritme, toon. Een gevoel voor je iets leest.", fr: "Image, rythme, ton. Une sensation avant même de lire.", en: "Image, rhythm, tone. A feeling before you read." })}</p>
      </TiltCard>
      <TiltCard from="right" delay={0.1} className={`${v.twoCard} ${v.code}`}>
        <span className="eyebrow">{t(lang, { nl: "Wat een agent leest", fr: "Ce qu'un agent lit", en: "What an agent reads" })}</span>
        <pre>{`{
  "@type": "Organization",
  "name": "Defy & Brand Events",
  "slogan": "We turn ideas into experiences",
  "makesOffer": ["Strategy", "Brand & Creative", "…"],
  "areaServed": "BE"
}`}</pre>
      </TiltCard>
    </div>
  );
}

/* ---------------- AGENTIC WORKFLOW: pulses travelling a node graph ---------------- */
function NodeGraph() {
  const ref = useCanvas((ctx, w, h, tm) => {
    const nodes = [[0.12, 0.5], [0.36, 0.22], [0.36, 0.78], [0.62, 0.5], [0.88, 0.3], [0.88, 0.7]].map(([x, y]) => [x * w, y * h]);
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]];
    ctx.lineWidth = 1.5;
    edges.forEach(([a, b]) => {
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath(); ctx.moveTo(nodes[a][0], nodes[a][1]); ctx.lineTo(nodes[b][0], nodes[b][1]); ctx.stroke();
    });
    edges.forEach(([a, b], i) => {
      const p = ((tm * 0.45 + i * 0.17) % 1);
      const x = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * p, y = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * p;
      ctx.fillStyle = FLUO;
      ctx.shadowColor = FLUO; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });
    nodes.forEach(([x, y], i) => chrome(ctx, x, y, i === 3 ? Math.min(w, h) * 0.075 : Math.min(w, h) * 0.05, i === 3));
  });
  return <canvas ref={ref} className={v.fill} aria-hidden="true" />;
}
function Pipeline({ lang }: { lang: Lang }) {
  const steps = [
    { k: "Trigger", p: t(lang, { nl: "Een nieuwe lead landt in de inbox.", fr: "Un nouveau lead atterrit dans la boîte.", en: "A new lead lands in the inbox." }) },
    { k: "Think", p: t(lang, { nl: "De agent leest, herkent de vraag, checkt de agenda.", fr: "L'agent lit, reconnaît la demande, vérifie l'agenda.", en: "The agent reads, recognises the ask, checks the calendar." }) },
    { k: "Act", p: t(lang, { nl: "Antwoord in jouw toon, voorstel voor een gesprek, CRM bijgewerkt.", fr: "Réponse dans votre ton, proposition d'appel, CRM mis à jour.", en: "Reply in your voice, meeting proposed, CRM updated." }) },
    { k: "Measure", p: t(lang, { nl: "Jij ziet 's ochtends wat er gebeurde — en beslist.", fr: "Le matin, vous voyez ce qui s'est passé — et décidez.", en: "In the morning you see what happened — and decide." }) },
  ];
  return (
    <div className={v.pipe}>
      {steps.map((s, i) => (
        <TiltCard key={s.k} from="right" delay={i * 0.1} className={v.pipeCard}>
          <b>{s.k}</b>
          <p>{s.p}</p>
          {i < steps.length - 1 && <i className={v.pipeArrow} />}
        </TiltCard>
      ))}
    </div>
  );
}
