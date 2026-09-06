import type { MetadataRoute } from "next";
import { getCopy, href, LANGS, SITE_URL } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];
  for (const lang of LANGS) {
    const c = getCopy(lang);
    const langs = (key: "home" | "services" | "about" | "contact" | "portfolio", slug?: string) =>
      Object.fromEntries(LANGS.map((l) => [l, SITE_URL + href(l, key, slug)]));
    out.push({ url: SITE_URL + href(lang, "home"), lastModified: now, priority: 1, alternates: { languages: langs("home") } });
    out.push({ url: SITE_URL + href(lang, "services"), lastModified: now, priority: 0.8, alternates: { languages: langs("services") } });
    out.push({ url: SITE_URL + href(lang, "about"), lastModified: now, priority: 0.7, alternates: { languages: langs("about") } });
    out.push({ url: SITE_URL + href(lang, "portfolio"), lastModified: now, priority: 0.8, alternates: { languages: langs("portfolio") } });
    out.push({ url: SITE_URL + href(lang, "contact"), lastModified: now, priority: 0.7, alternates: { languages: langs("contact") } });
    for (const s of c.services) {
      out.push({ url: SITE_URL + href(lang, "services", s.slug), lastModified: now, priority: 0.8, alternates: { languages: langs("services", s.slug) } });
    }
  }
  return out;
}
