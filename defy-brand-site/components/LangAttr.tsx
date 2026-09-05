"use client";
import { useEffect } from "react";

/** Keeps <html lang> in sync with the active locale segment. */
export default function LangAttr({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
