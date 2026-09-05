import type { Metadata } from "next";
import { getCopy, type Lang } from "@/content";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/Hero";
import FlowObject from "@/components/FlowObject";
import Manifesto from "@/components/Manifesto";
import Ring from "@/components/Ring";
import { Statement, Chain, AboutTeaser, Closer } from "@/components/Sections";

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
      <Chain copy={copy} />
      <AboutTeaser copy={copy} />
      <Closer copy={copy} h={copy.home.closerH} cta={copy.home.closerCta} />
    </>
  );
}
