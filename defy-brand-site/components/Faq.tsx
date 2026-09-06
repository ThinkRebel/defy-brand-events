"use client";
import { useState } from "react";
import type { Lang } from "@/content";
import { faqFor, FAQ_TITLE } from "@/content/faq";
import Kinetic from "./Kinetic";
import s from "./faq.module.css";

/**
 * FAQ — the same Q&A pairs that go out as FAQPage JSON-LD and into llms.txt, shown to people as
 * an accordion. Every answer is written to be quoted: complete sentences, the name in the answer.
 */
export default function Faq({ page, lang }: { page: string; lang: Lang }) {
  const items = faqFor(page, lang);
  const [open, setOpen] = useState<number>(0);
  if (!items.length) return null;
  const t = FAQ_TITLE[lang];
  return (
    <section className={s.faq} aria-labelledby={`faq-${page}`}>
      <div className={s.head}>
        <span className="eyebrow">{t.eyebrow}</span>
        <Kinetic as="h2" text={t.h} mode="slide" className={s.h2} />
      </div>
      <dl className={s.list} id={`faq-${page}`}>
        {items.map((it, i) => {
          const on = open === i;
          return (
            <div key={i} className={`${s.item} ${on ? s.on : ""}`}>
              <dt>
                <button type="button" className={s.q} aria-expanded={on} aria-controls={`faq-${page}-${i}`} onClick={() => setOpen(on ? -1 : i)} data-cursor>
                  <span>{it.q}</span>
                  <i aria-hidden="true" />
                </button>
              </dt>
              <dd id={`faq-${page}-${i}`} className={s.a} hidden={!on}>
                <p>{it.a}</p>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
