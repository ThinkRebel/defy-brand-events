import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCopy, href, LANGS, type Lang } from "@/content";
import { buildMetadata, breadcrumbJsonLd, serviceJsonLd, faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { PageHero, ServiceBody } from "@/components/Page";
import { Closer } from "@/components/Sections";

type Props = { params: Promise<{ lang: Lang; section: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.flatMap((lang) => {
    const c = getCopy(lang);
    return c.services.map((s) => ({ lang, section: c.routes.services, slug: s.slug }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCopy(lang);
  const s = c.services.find((x) => x.slug === slug);
  if (!s) return {};
  return buildMetadata(lang, "services", { title: s.name, description: s.meta, slug: s.slug });
}

export default async function ServicePage({ params }: Props) {
  const { lang, section, slug } = await params;
  const c = getCopy(lang);
  if (section !== c.routes.services) notFound();
  const i = c.services.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const s = c.services[i];
  const next = c.services[(i + 1) % c.services.length];

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(lang, s),
          faqJsonLd(s),
          breadcrumbJsonLd([
            { name: "Defy & Brand Events", url: href(lang, "home") },
            { name: c.nav.services, url: href(lang, "services") },
            { name: s.name, url: href(lang, "services", s.slug) },
          ]),
        ]}
      />
      <PageHero num={s.num} label={s.role} title={s.headline} sub={s.sub} scene={s.slug} lang={lang} variant={i % 3} />
      <ServiceBody service={s} copy={c} next={next} index={i} />
      <Closer copy={c} h={s.closer.join(" ")} cta={s.cta} />
    </>
  );
}
