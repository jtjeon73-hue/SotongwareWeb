import type { CapabilitySlug } from "./capabilities-config";

export interface CapabilityPageDictionary {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctas: { label: string; href: string; variant: "primary" | "outline" }[];
  };
  problems: { title: string; items: { title: string; description: string }[] };
  strengths: { title: string; items: { title: string; description: string }[] };
  flow: {
    title: string;
    description: string;
    nodes: { id: string; label: string; description: string }[];
  };
  applications: {
    title: string;
    applicable: { title: string; description: string }[];
    note: string;
  };
  deliverables: { title: string; items: string[] };
  process: { title: string; steps: { step: number; title: string; description: string }[] };
  portfolio: {
    title: string;
    emptyNote: string;
    statusLabel: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  finalCta: { title: string; description: string; cta: string; ctaHref: string };
}

export type CapabilityDictionaryMap = Record<CapabilitySlug, CapabilityPageDictionary>;

export interface SiteNavDictionary {
  technology: string;
  digitalVentures: string;
  portfolio: string;
  about: string;
  contact: string;
  contactCta: string;
  process: string;
  guide: string;
  homeAria: string;
  mainMenu: string;
  mobileMenu: string;
  openMenu: string;
  closeMenu: string;
  viewService: string;
  viewAllServices: string;
  externalSite: string;
  brandSubtitle: string;
  digitalVenturesBadge: string;
  digitalVenturesBlurb: string;
  digitalVenturesHubCta: string;
  technologyItems: { label: string; slug: CapabilitySlug }[];
  ventureItems: { label: string; href: string }[];
}

export interface SiteFooterDictionary {
  tagline: string;
  description: string;
  externalServices: string;
  guide: string;
  company: string;
  legal: string;
  rights: string;
}

export interface SiteCommonDictionary {
  home: string;
  backHome: string;
  learnMore: string;
  contactUs: string;
  launchPrep: string;
  inValidation: string;
  live: string;
  comingSoon: string;
  notFoundTitle: string;
  notFoundDescription: string;
  notFoundCta: string;
}

export interface AboutPageDictionary {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  description: string;
  journeyTitle: string;
  blocks: { title: string; titleEn: string; description: string }[];
  servicesTitle: string;
  servicesDescription: string;
  ctaContact: string;
  ctaProducts: string;
}

export interface ContactPageDictionary {
  meta: { title: string; description: string };
  title: string;
  description: string;
  ctaGuide: string;
}

export interface SiteDictionary {
  nav: SiteNavDictionary;
  footer: SiteFooterDictionary;
  common: SiteCommonDictionary;
  pages: {
    about: AboutPageDictionary;
    contact: ContactPageDictionary;
  };
}

export interface FullDictionary {
  site: SiteDictionary;
  capabilityPages: CapabilityDictionaryMap;
}
