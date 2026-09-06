import type { Metadata } from "next";
import { getCopy, href, LANGS, SITE_URL, CONTACT_EMAIL, COMPANY, type Lang, type Service } from "@/content";

type PageKey = "home" | "services" | "about" | "contact" | "portfolio";

/** Alternate URLs for the same page in every language (used by hreflang + the language switch). */
export function alternatesFor(key: PageKey, slug?: string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, href(l, key, slug)])) as Record<Lang, string>;
}

export function buildMetadata(lang: Lang, key: PageKey, opts: { title: string; description: string; slug?: string }): Metadata {
  const alts = alternatesFor(key, opts.slug);
  const canonical = SITE_URL + alts[lang];
  const languages: Record<string, string> = Object.fromEntries(LANGS.map((l) => [l === "nl" ? "nl-BE" : l === "fr" ? "fr-BE" : "en", SITE_URL + alts[l]]));
  languages["x-default"] = SITE_URL + alts.nl;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical, languages },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: "Defy & Brand Events",
      locale: lang === "nl" ? "nl_BE" : lang === "fr" ? "fr_BE" : "en_GB",
      type: "website",
      images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630, alt: "Defy & Brand Events — We turn ideas into experiences" }],
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}

/* ---------- JSON-LD (GEO / Agent Ready: machine-readable facts) ---------- */

export function orgJsonLd(lang: Lang) {
  const c = getCopy(lang);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: "Defy & Brand Events",
    legalName: COMPANY.legalName,
    vatID: COMPANY.vat,
    telephone: COMPANY.phone,
    address: { "@type": "PostalAddress", streetAddress: COMPANY.street, postalCode: COMPANY.postalCode, addressLocality: COMPANY.city, addressCountry: COMPANY.country },
    founder: { "@type": "Person", name: "Njusja Orban", jobTitle: "Creative" },
    alternateName: ["DB Events", "Defy & Brand"],
    url: SITE_URL,
    logo: `${SITE_URL}/assets/mark.svg`,
    email: CONTACT_EMAIL,
    slogan: "We turn ideas into experiences.",
    description: c.meta.description,
    areaServed: "BE",
    knowsLanguage: ["nl", "fr", "en"],
    knowsAbout: c.services.map((s) => s.name),
    contactPoint: { "@type": "ContactPoint", email: CONTACT_EMAIL, telephone: COMPANY.phone, contactType: "sales", availableLanguage: ["Dutch", "French", "English"] },
  };
}

export function websiteJsonLd(lang: Lang) {
  const c = getCopy(lang);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Defy & Brand Events",
    description: c.meta.description,
    inLanguage: lang,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function serviceJsonLd(lang: Lang, s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}${href(lang, "services", s.slug)}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.meta,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "BE",
    availableLanguage: ["nl", "fr", "en"],
    url: `${SITE_URL}${href(lang, "services", s.slug)}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.blocksTitle,
      itemListElement: s.blocks.map((b) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: b.h, description: b.p } })),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE_URL + it.url })),
  };
}

/** FAQ-style Q&A derived from service copy — the shape AI answer engines quote most readily. */
export function faqJsonLd(s: Service) {
  const qa: { q: string; a: string }[] = [];
  if (s.honest) qa.push({ q: s.honest.h, a: s.honest.p });
  qa.push({ q: `${s.name}?`, a: s.intro.join(" ") });
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
  };
}
