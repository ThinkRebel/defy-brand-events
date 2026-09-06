"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY, href, type Copy, LANGS, alternatesForPath } from "@/content";
import styles from "./Nav.module.css";

export function Nav({ copy }: { copy: Copy }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const alternates = alternatesForPath(pathname);
  const lang = copy.lang;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={styles.nav} aria-label="Hoofdnavigatie">
        <Link className={styles.brand} href={href(lang, "home")}>
          <Image className={styles.mark} src="/assets/mark-fluo.svg" alt="" width={26} height={26} priority />
          <span>DB Events</span>
        </Link>
        <button
          className={`${styles.burger} ${open ? styles.open : ""}`}
          aria-label={open ? "Sluit menu" : "Menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.menu}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ul>
              {[
                [copy.nav.services, href(lang, "services")],
                [copy.nav.about, href(lang, "about")],
                [copy.nav.contact, href(lang, "contact")],
                [copy.nav.work, href(lang, "portfolio")],
              ].map(([label, to], i) => (
                <motion.li
                  key={to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link href={to} className={i === 3 ? styles.minor : undefined}>{label}</Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className={styles.services}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className={styles.menuLang} role="group" aria-label="Taal / Langue / Language">
                {LANGS.map((l) => (
                  <Link key={l} href={alternates[l]} hrefLang={l} lang={l} aria-current={l === lang ? "true" : undefined}>{l}</Link>
                ))}
              </div>
              {copy.services.map((s) => (
                <Link key={s.slug} href={href(lang, "services", s.slug)}>
                  <b>#{s.num}</b>
                  <span>
                    {s.name}
                    <span className={styles.role}>{s.role}</span>
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Language switch — swaps the locale segment, keeps the equivalent page. */
export function LangSwitch({ copy }: { copy: Copy }) {
  const pathname = usePathname();
  const alternates = alternatesForPath(pathname);
  return (
    <div className={styles.lang} role="group" aria-label="Taal / Langue / Language">
      {LANGS.map((l) => (
        <Link key={l} href={alternates[l]} hrefLang={l} lang={l} aria-current={l === copy.lang ? "true" : undefined}>
          {l}
        </Link>
      ))}
    </div>
  );
}

/** ceeme.be, the GEO tool we built — in the footer on every page, next to the WhatsApp button. */
const CEEME = { nl: "Ons eigen GEO-instrument", fr: "Notre propre outil GEO", en: "Our own GEO tool" } as const;

export function Footer({ copy }: { copy: Copy }) {
  return (
    <footer className={styles.footer}>
      <Link className={styles.big} href={href(copy.lang, "contact")}>
        {copy.footer.another.replace("Let's make some noise.", "")}
        <span>Let&apos;s make some noise.</span>
      </Link>
      <div className={styles.meta}>
        <span>Defy &amp; Brand Events — {copy.footer.tagline}</span>
        <a href="mailto:marketing@defyandbrandevents.be">marketing@defyandbrandevents.be</a>
        <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneDisplay}</a>
        {/* lands on the channel switch of the contact form, with WhatsApp preselected */}
        <Link className={styles.wa} href={`${href(copy.lang, "contact")}#whatsapp`} data-cursor>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>WhatsApp {COMPANY.whatsappDisplay}</span>
        </Link>
        <span>{COMPANY.street} — {COMPANY.postalCode} {COMPANY.city}</span>
        <span>{COMPANY.legalName} — BTW {COMPANY.vat}</span>
        <a className={styles.ceeme} href="https://www.ceeme.be/" target="_blank" rel="noopener" data-cursor>
          {CEEME[copy.lang]}: <b>ceeme.be</b> ↗
        </a>
        <span>© {new Date().getFullYear()} Defy &amp; Brand Events</span>
      </div>
    </footer>
  );
}
