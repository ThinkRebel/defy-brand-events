import type { Metadata } from "next";
import { getCopy, type Lang } from "@/content";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/Hero";
import FlowObject from "@/components/FlowObject";
import Manifesto from "@/components/Manifesto";
import Ring from "@/components/Ring";
import { Statement, AboutTeaser, Closer } from "@/components/Sections";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import Deck from "@/components/Deck";

type Props = { params: Promise<{ lang: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const c = getCopy(lang);
  return { ...buildMetadata(lang, "home", { title: c.meta.title, description: c.meta.description }), title: { absolute: c.meta.title } };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const copy = getCopy(lang);
  return (
    <>
      <FlowObject />
      <Hero copy={copy} />
      <Statement copy={copy} />
      <Manifesto copy={copy} />
      <Ring copy={copy} />
      <Deck copy={copy} />
      <AboutTeaser copy={copy} />
      <Faq page="home" lang={lang} />
      <JsonLd data={faqJsonLd(lang, "home")} />
      <Closer copy={copy} h={copy.home.closerH} cta={copy.home.closerCta} />
    </>
  );
}
