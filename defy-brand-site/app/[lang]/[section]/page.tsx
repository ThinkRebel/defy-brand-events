import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCopy, href, LANGS, type Lang } from "@/content";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { PageHero, ContactPicker } from "@/components/Page";
import { Closer, Reveal } from "@/components/Sections";
import Cinema from "@/components/Cinema";
import FlowObject from "@/components/FlowObject";
import { CardGlobe, CardBloom, SERVICE_IMG } from "@/components/Rings";
import Portfolio from "@/components/Portfolio";
import Kinetic from "@/components/Kinetic";
import p from "@/components/page.module.css";

type Props = { params: Promise<{ lang: Lang; section: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => {
    const r = getCopy(lang).routes;
    return [r.services, r.about, r.contact, r.portfolio].map((section) => ({ lang, section }));
  });
}

function resolve(lang: Lang, section: string): "services" | "about" | "contact" | "portfolio" | null {
  const r = getCopy(lang).routes;
  if (section === r.services) return "services";
  if (section === r.about) return "about";
  if (section === r.contact) return "contact";
  if (section === r.portfolio) return "portfolio";
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = await params;
  const key = resolve(lang, section);
  const c = getCopy(lang);
  if (key === "about") return buildMetadata(lang, "about", { title: c.nav.about, description: c.about.meta });
  if (key === "contact") return buildMetadata(lang, "contact", { title: c.nav.contact, description: c.contact.meta });
  if (key === "portfolio") return buildMetadata(lang, "portfolio", { title: c.nav.work, description: c.portfolio.meta });
  return buildMetadata(lang, "services", { title: c.nav.services, description: c.meta.description });
}

export default async function SectionPage({ params }: Props) {
  const { lang, section } = await params;
  const key = resolve(lang, section);
  if (!key) notFound();
  const c = getCopy(lang);
  const navName = key === "portfolio" ? c.nav.work : c.nav[key];
  const crumbs = [{ name: "Defy & Brand Events", url: href(lang, "home") }, { name: navName, url: href(lang, key) }];

  if (key === "portfolio") {
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Portfolio copy={c} />
        <Closer copy={c} h={c.home.closerH} cta={c.home.closerCta} />
      </>
    );
  }

  if (key === "about") {
    const a = c.about;
    return (
      <>
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Cinema copy={c} />
        <FlowObject />
        <section className={p.aboutHead}>
          <span className="eyebrow">{a.eyebrow}</span>
          <Kinetic as="h1" text={a.h} mode="flip" className={p.ph1} />
        </section>
        <section className={p.aboutWhy}>
          <div className={p.introSide}>
            <span className="eyebrow">{a.eyebrow}</span>
            <div className={p.introObj} data-flow="why" aria-hidden="true" />
          </div>
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
          <CardBloom items={c.services.map((s) => ({ h: s.name, p: s.role.charAt(0).toUpperCase() + s.role.slice(1) + ".", num: s.num, href: href(lang, "services", s.slug) }))} />
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
        <FlowObject />
        <header className={`${p.phero} ${p.noiseHero}`}>
          <div className={p.pglow} aria-hidden="true" />
          <span className="eyebrow">{c.nav.contact}</span>
          <Kinetic as="h1" text="Let's make some noise." mode="flip" className={p.ph1} />
          <p className={p.psub}>{ct.invite}</p>
        </header>
        <ContactPicker copy={c} />
      </>
    );
  }

  // services overview
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero label={c.nav.services} title={c.home.servicesEyebrow} sub={c.home.heroLead} obj={false} />
      <section className={p.ringBlock}>
        <CardGlobe items={c.services.map((s) => ({ h: s.name, p: s.role.charAt(0).toUpperCase() + s.role.slice(1) + ".", num: s.num, href: href(lang, "services", s.slug) }))} />
      </section>
      <section className={p.overview}>
        <ol>
          {c.services.map((s, i) => (
            <Reveal key={s.slug} as="li" delay={(i % 3) * 0.08}>
              <Link className={p.scard} href={href(lang, "services", s.slug)}>
                <img className={p.scardImg} src={SERVICE_IMG[s.num]} alt="" loading="lazy" />
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
