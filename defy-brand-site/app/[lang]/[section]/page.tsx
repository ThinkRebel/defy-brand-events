import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCopy, href, LANGS, type Lang } from "@/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { PageHero, ContactForm } from "@/components/Page";
import { Closer, Reveal } from "@/components/Sections";
import Cinema from "@/components/Cinema";
import FlowObject from "@/components/FlowObject";
import { DustMorph, Tornado } from "@/components/Morph";
import { MiniRing } from "@/components/Rings";
import p from "@/components/page.module.css";

type Props = { params: Promise<{ lang: Lang; section: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => {
    const r = getCopy(lang).routes;
    return [r.services, r.about, r.contact].map((section) => ({ lang, section }));
  });
}

function resolve(lang: Lang, section: string): "services" | "about" | "contact" | null {
  const r = getCopy(lang).routes;
  if (section === r.services) return "services";
  if (section === r.about) return "about";
  if (section === r.contact) return "contact";
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = await params;
  const key = resolve(lang, section);
  const c = getCopy(lang);
  if (key === "about") return buildMetadata(lang, "about", { title: c.nav.about, description: c.about.meta });
  if (key === "contact") return buildMetadata(lang, "contact", { title: c.nav.contact, description: c.contact.meta });
  return buildMetadata(lang, "services", { title: c.nav.services, description: c.meta.description });
}

export default async function SectionPage({ params }: Props) {
  const { lang, section } = await params;
  const key = resolve(lang, section);
  if (!key) notFound();
  const c = getCopy(lang);
  const crumbs = [{ name: "Defy & Brand Events", url: href(lang, "home") }, { name: c.nav[key], url: href(lang, key) }];

  if (key === "about") {
    const a = c.about;
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <FlowObject />
        <DustMorph text="DB EVENTS" />
        <section className={p.aboutHead}>
          <span className="eyebrow">{a.eyebrow}</span>
          <h1 className={p.ph1}>{a.h}</h1>
        </section>
        <section className={p.aboutWhy}>
          <span className="eyebrow">{a.eyebrow}</span>
          <div>
            {a.why.map((t, i) => (
              <Reveal key={i} as="p" className={p.lead} delay={i * 0.1}>{t}</Reveal>
            ))}
          </div>
        </section>
        <section className={p.nots}>
          <Reveal as="h2">{a.notTitle}</Reveal>
          <ul>
            {a.not.map((t, i) => {
              const [head, ...rest] = t.split(". ");
              return (
                <Reveal key={i} as="li" delay={i * 0.06}>
                  <strong>{head}.</strong> {rest.join(". ")}
                </Reveal>
              );
            })}
          </ul>
        </section>
        <Cinema copy={c} />
        <section className={p.how}>
          <div>
            <Reveal as="h2">{a.howTitle}</Reveal>
            <ol className={p.verbs}>
              {a.verbs.map((v, i) => (
                <Reveal key={v} as="li" delay={i * 0.1}>{v}</Reveal>
              ))}
            </ol>
          </div>
          <Reveal as="p" delay={0.3}>{a.howNote}</Reveal>
        </section>
        <section className={p.ringBlock}>
          <span className="eyebrow">{c.home.servicesEyebrow}</span>
          <MiniRing slot items={c.services.map((s) => ({ h: s.name, p: s.role.charAt(0).toUpperCase() + s.role.slice(1) + ".", num: s.num, href: href(lang, "services", s.slug) }))} />
        </section>
        <section className={p.name}>
          <Reveal as="h2">{a.nameTitle}</Reveal>
          <dl>
            {a.name.map((n, i) => (
              <Reveal key={n.k} delay={i * 0.1}>
                <dt>{n.k}</dt>
                <dd>{n.p}</dd>
              </Reveal>
            ))}
          </dl>
        </section>
        <Closer copy={c} h={c.home.closerH} cta={c.home.closerCta} />
      </>
    );
  }

  if (key === "contact") {
    const ct = c.contact;
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Tornado>
          <div>
            <span className="eyebrow">{c.nav.contact}</span>
            <h1 className={p.noise}>Let&apos;s make<br />some noise.</h1>
            <p className={p.noiseSub}>{ct.h}</p>
            <a className="btn" href="#form"><i /><span>{ct.labels.send}</span></a>
          </div>
        </Tornado>
        <section className={p.contact} id="form">
          <div>
            <span className="eyebrow">{c.nav.contact}</span>
            <h2 className={p.ph1} style={{ marginTop: "0.4em" }}>{ct.h}</h2>
            <ul className={p.lines}>
              {ct.lines.map((l, i) => (
                <Reveal key={i} as="li" delay={0.3 + i * 0.1}>{l}</Reveal>
              ))}
            </ul>
            <p className={p.invite}>
              {ct.invite}
              <span className={p.talk}>{ct.talk}</span>
            </p>
          </div>
          <ContactForm copy={c} />
        </section>
      </>
    );
  }

  // services overview
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero label={c.nav.services} title={c.home.servicesEyebrow} sub={c.home.heroLead} obj={false} />
      <section className={p.ringBlock}>
        <MiniRing items={c.services.map((s) => ({ h: s.name, p: s.role.charAt(0).toUpperCase() + s.role.slice(1) + ".", num: s.num, href: href(lang, "services", s.slug) }))} />
      </section>
      <section className={p.overview}>
        <ol>
          {c.services.map((s, i) => (
            <Reveal key={s.slug} as="li" delay={(i % 3) * 0.08}>
              <Link className={p.scard} href={href(lang, "services", s.slug)}>
                <span className={p.num}><b>#</b>{s.num}</span>
                <h2>{s.name}</h2>
                <p className={p.head}>{s.headline === s.headline.toUpperCase() ? s.headline.charAt(0) + s.headline.slice(1).toLowerCase().replace(/\b(ai|geo|seo|dna)\b/g, (m) => m.toUpperCase()) : s.headline}</p>
                <span className={p.role}>{s.role.charAt(0).toUpperCase() + s.role.slice(1)}.</span>
                <span className={p.arrow} aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>
      <Closer copy={c} h={c.home.closerH} cta={c.home.closerCta} />
    </>
  );
}
