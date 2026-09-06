import { nl } from "./nl";
import { fr } from "./fr";
import { en } from "./en";
import { LANGS, type Copy, type Lang } from "./types";
export { LANGS };
export type { Copy, Lang, Service } from "./types";

const all: Record<Lang, Copy> = { nl, fr, en };

export function isLang(x: string): x is Lang {
  return x === "nl" || x === "fr" || x === "en";
}

export function getCopy(lang: Lang): Copy {
  return all[lang];
}

/** Path helpers — route segments are localised. */
export type RouteKey = "home" | "services" | "about" | "contact" | "portfolio";
export function href(lang: Lang, key: RouteKey, slug?: string) {
  const c = all[lang];
  if (key === "home") return `/${lang}`;
  if (key === "services") return slug ? `/${lang}/${c.routes.services}/${slug}` : `/${lang}/${c.routes.services}`;
  if (key === "about") return `/${lang}/${c.routes.about}`;
  if (key === "portfolio") return `/${lang}/${c.routes.portfolio}`;
  return `/${lang}/${c.routes.contact}`;
}

/** Given any localised path, return the equivalent path in every language. */
export function alternatesForPath(pathname: string): Record<Lang, string> {
  const [, lang, section, slug] = pathname.split("/");
  const out = (key: RouteKey, s?: string) =>
    Object.fromEntries(LANGS.map((l) => [l, href(l, key, s)])) as Record<Lang, string>;
  if (!isLang(lang) || !section) return out("home");
  const c = all[lang];
  if (section === c.routes.about) return out("about");
  if (section === c.routes.contact) return out("contact");
  if (section === c.routes.portfolio) return out("portfolio");
  if (section === c.routes.services) return out("services", slug);
  return out("home");
}


/** Work made under the ThinkRebel banner — names link straight to the live sites. */
export type Work = { name: string; url: string; host: string; kind: { nl: string; fr: string; en: string }; live: boolean };
export const PORTFOLIO: Work[] = [
  { name: "Rhumerie Louis", url: "https://rhumerielouis.be/", host: "rhumerielouis.be", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "AI in de klas", url: "https://indeklas.ai/", host: "indeklas.ai", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "De Ploeg op de Root", url: "https://dpodr.be/", host: "dpodr.be", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "EcoClean Luxembourg", url: "https://eco-clean.lu/", host: "eco-clean.lu", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "Karweiservice Vanden Berghe", url: "https://karweiservicevb.be/", host: "karweiservicevb.be", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "Oostende.ai", url: "https://oostende.ai/", host: "oostende.ai", kind: { nl: "Event-landingspagina", fr: "Landing page événement", en: "Event landing page" }, live: true },
  { name: "Customm", url: "https://customm.be/", host: "customm.be", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
  { name: "Tribar Legal", url: "https://tribarlegal.eu/nl", host: "tribarlegal.eu", kind: { nl: "Website", fr: "Site web", en: "Website" }, live: true },
];

export const SITE_URL = "https://defyandbrandevents.be";
export const CONTACT_EMAIL = "marketing@defyandbrandevents.be";
/** legal + contact facts (footer, JSON-LD, llms.txt) */
export const COMPANY = {
  legalName: "DB Events BV",
  vat: "BE 0891.225.112",
  phone: "+32 59 70 99 69",
  phoneDisplay: "059 70 99 69",
  street: "Zeedijk 133 bus 00.02",
  postalCode: "8400",
  city: "Oostende",
  country: "BE",
};
