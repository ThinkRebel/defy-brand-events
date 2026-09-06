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
        <span>{COMPANY.street} — {COMPANY.postalCode} {COMPANY.city}</span>
        <span>{COMPANY.legalName} — BTW {COMPANY.vat}</span>
        <span>© {new Date().getFullYear()} Defy &amp; Brand Events</span>
      </div>
    </footer>
  );
}
