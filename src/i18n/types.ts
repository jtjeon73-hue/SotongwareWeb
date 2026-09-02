import type { Locale } from "./config";

export type LocalizedString = Record<Locale, string>;

export type CtaVariant = "primary" | "secondary" | "outline";

export interface HomeCta {
  label: string;
  href: string;
  variant: CtaVariant;
}

export interface HomeDictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    services: string;
    process: string;
    guide: string;
    about: string;
    contact: string;
    contactCta: string;
    homeAria: string;
    mainMenu: string;
    mobileMenu: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctas: HomeCta[];
    highlights: { label: string; desc: string }[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      id: string;
      title: string;
      description: string;
      tags: string[];
    }[];
    cta: string;
    ctaHref: string;
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    steps: { step: number; title: string; description: string }[];
    cta: string;
    ctaHref: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    units: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      status: string;
      features: string[];
      cta: string;
      ctaHref: string;
      visual: "ebook" | "app" | "site" | "content" | "knowledge";
    }[];
  };
  results: {
    eyebrow: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    statusLabels: {
      demo: string;
      testing: string;
      ready: string;
      published: string;
      comingSoon: string;
    };
    viewAll: string;
    viewDetail: string;
  };
  conversion: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      id: string;
      title: string;
      description: string;
      cta: string;
      ctaHref: string;
      badge?: string;
    }[];
  };
  trust: {
    eyebrow: string;
    title: string;
    description: string;
    items: { label: string; desc: string; href: string }[];
    policyNote: string;
    policies: { label: string; href: string }[];
  };
  finalCta: {
    title: string;
    description: string;
    actions: HomeCta[];
  };
}
