import { notFound } from "next/navigation";
import { getCopy, isLang, LANGS } from "@/content";
import { Nav, LangSwitch, Footer } from "@/components/Nav";
import Cursor from "@/components/Cursor";
import LangAttr from "@/components/LangAttr";
import JsonLd from "@/components/JsonLd";
import { orgJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const copy = getCopy(lang);
  return (
    <>
      <LangAttr lang={lang} />
      <JsonLd data={[orgJsonLd(lang), websiteJsonLd(lang)]} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav copy={copy} />
      <LangSwitch copy={copy} />
      <main id="main">{children}</main>
      <Footer copy={copy} />
    </>
  );
}
