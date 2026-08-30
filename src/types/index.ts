export type WorkType =
  | "app"
  | "ebook"
  | "website"
  | "automation"
  | "music"
  | "shorts"
  | "video"
  | "article";

export type WorkStatus = "draft" | "published" | "archived";

export interface DistributionLink {
  platform: string;
  url: string;
  label?: string;
}

export interface WorkItem {
  id: string;
  slug: string;
  type: WorkType;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  language?: string;
  status: WorkStatus;
  publishedAt?: string;
  featured?: boolean;
  externalUrl?: string;
  storeUrl?: string;
  playStoreUrl?: string;
  youtubeUrl?: string;
  purchaseUrl?: string;
  demoUrl?: string;
  distributionLinks?: DistributionLink[];
  relatedItems?: string[];
  relatedServices?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  makesWhat: string;
  customerValue: string;
  valuePoints: string[];
  href: string;
  worksHref?: string;
  icon: string;
  featured?: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface TechnologyItem {
  id: string;
  name: string;
  category: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface WhyPoint {
  title: string;
  description: string;
}

export interface EcosystemNode {
  id: string;
  label: string;
  description: string;
}

export interface AiGuideOption {
  id: string;
  label: string;
  description: string;
  href: string;
}
