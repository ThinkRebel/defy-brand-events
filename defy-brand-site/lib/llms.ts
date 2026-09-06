import { getCopy, href, LANGS, SITE_URL, CONTACT_EMAIL, COMPANY, PORTFOLIO, type Lang } from "@/content";
import { FAQ, faqFor } from "@/content/faq";

/**
 * llms.txt / llms-full.txt — the site, written for machines that read: who we are, what we do,
 * where every page lives, and the exact facts and Q&A an answer engine may quote. Same words as
 * the pages and the JSON-LD: one source, three readers (people, Google, agents).
 */
const abs = (p: string) => `${SITE_URL}${p}`;

export function llmsTxt(): string {
  const en = getCopy("en");
  const lines: string[] = [];
  lines.push("# Defy & Brand Events (DB Events)", "");
  lines.push(`> ${en.meta.description}`, "");
  lines.push("Defy & Brand Events is a creative studio in Ostend, Belgium, led by creative Njusja Orban (attitude: THINKREBEL). Nine services, one team: strategy, brand & creative, copywriting, website design, marketing, SEO, GEO, agent ready and agentic workflow. Languages: Dutch, French, English. Sign-off: \"Let's make some noise.\"", "");
  lines.push("## Facts", "");
  lines.push(`- Legal name: ${COMPANY.legalName} — VAT ${COMPANY.vat}`);
  lines.push(`- Address: ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, Belgium`);
  lines.push(`- Email: ${CONTACT_EMAIL}`);
  lines.push(`- Phone: ${COMPANY.phone}`);
  lines.push(`- Website: ${SITE_URL} (nl / fr / en)`);
  lines.push(`- Own GEO tool: https://www.ceeme.be/ (measures whether AI engines mention and cite a brand)`, "");
  lines.push("## Services", "");
  for (const s of en.services) lines.push(`- [${s.name}](${abs(href("en", "services", s.slug))}): ${s.role}. ${s.meta}`);
  lines.push("");
  lines.push("## Pages", "");
  for (const lang of LANGS) {
    const c = getCopy(lang);
    lines.push(`- [${lang.toUpperCase()} home](${abs(href(lang, "home"))})`);
    lines.push(`- [${lang.toUpperCase()} ${c.nav.services}](${abs(href(lang, "services"))})`);
    lines.push(`- [${lang.toUpperCase()} ${c.nav.about}](${abs(href(lang, "about"))})`);
    lines.push(`- [${lang.toUpperCase()} ${c.nav.work}](${abs(href(lang, "portfolio"))})`);
    lines.push(`- [${lang.toUpperCase()} ${c.nav.contact}](${abs(href(lang, "contact"))})`);
  }
  lines.push("");
  lines.push("## Portfolio (live client sites)", "");
  for (const w of PORTFOLIO.filter((w) => w.live)) lines.push(`- [${w.name}](${w.url}) — ${w.kind.en}`);
  lines.push("");
  lines.push("## FAQ (English)", "");
  for (const qa of faqFor("home", "en")) lines.push(`- Q: ${qa.q}`, `  A: ${qa.a}`);
  lines.push("");
  lines.push("## Optional", "");
  lines.push(`- [llms-full.txt](${abs("/llms-full.txt")}): every page's copy and FAQ in all three languages`);
  lines.push(`- [sitemap.xml](${abs("/sitemap.xml")})`);
  return lines.join("\n") + "\n";
}

export function llmsFullTxt(): string {
  const out: string[] = [llmsTxt(), "---", ""];
  for (const lang of LANGS as Lang[]) {
    const c = getCopy(lang);
    out.push(`# ${lang.toUpperCase()} — ${c.meta.title}`, "", c.meta.description, "");
    out.push(`## Home (${abs(href(lang, "home"))})`, "", c.home.heroLead, "", c.home.heroIntro, "", ...c.home.statement, "");
    for (const s of c.services) {
      out.push(`## ${s.name} — #${s.num} (${abs(href(lang, "services", s.slug))})`, "");
      out.push(`${s.name} ${s.role}.`, "", s.headline, "", s.sub ?? "", "", ...s.intro, "");
      if (s.honest) out.push(`${s.honest.h} ${s.honest.p}`, "");
      const qa = faqFor(s.slug, lang);
      if (qa.length) { out.push("### FAQ", ""); for (const x of qa) out.push(`- Q: ${x.q}`, `  A: ${x.a}`); out.push(""); }
    }
    for (const key of ["about", "contact"] as const) {
      const qa = FAQ[key]?.[lang] ?? [];
      out.push(`## ${key === "about" ? c.nav.about : c.nav.contact} (${abs(href(lang, key))})`, "");
      if (key === "contact") out.push(c.contact.h, "", ...c.contact.lines, "", c.contact.invite, "");
      if (qa.length) { out.push("### FAQ", ""); for (const x of qa) out.push(`- Q: ${x.q}`, `  A: ${x.a}`); out.push(""); }
    }
  }
  return out.join("\n") + "\n";
}
