export type Lang = "nl" | "fr" | "en";
export const LANGS: Lang[] = ["nl", "fr", "en"];

export type Block = { h: string; p: string };

export type Service = {
  slug: string;
  num: string;
  name: string; // brand name, stays English
  role: string; // one-line role in the chain
  headline: string; // may stay English (brand statement)
  sub?: string; // supporting line (English brand statement)
  intro: string[];
  listTitle?: string;
  list?: string[];
  blocksTitle: string;
  blocks: Block[];
  steps?: { k: string; p: string }[];
  honest?: { h: string; p: string };
  closer: string[];
  cta: string;
  meta: string;
};

export type Copy = {
  lang: Lang;
  nav: { work: string; services: string; about: string; contact: string };
  routes: { services: string; about: string; contact: string };
  home: {
    heroLead: string;
    heroIntro: string;
    heroCta: string;
    statement: string[];
    manifesto: string;
    manifestoAfter: string;
    servicesEyebrow: string;
    servicesHint: string;
    chainEyebrow: string;
    chain: { h: string; p: string }[];
    chainNote: string;
    closerH: string;
    closerCta: string;
  };
  about: {
    eyebrow: string;
    h: string;
    why: string[];
    notTitle: string;
    not: string[];
    howTitle: string;
    verbs: string[];
    howNote: string;
    nameTitle: string;
    name: { k: string; p: string }[];
    cta: string;
    meta: string;
  };
  contact: {
    h: string;
    lines: string[];
    invite: string;
    talk: string;
    labels: { who: string; reach: string; what: string; send: string };
    confirm: string;
    alt: string;
    meta: string;
  };
  footer: { tagline: string; another: string };
  meta: { title: string; description: string };
  services: Service[];
};
