import type { Metadata } from "next";
import { siteConfig } from "@/data/navigation";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
};

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const naverSiteVerification = process.env.NAVER_SITE_VERIFICATION?.trim();

function absoluteUrl(path: PageMetadataOptions["path"]): string {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description,
    },
  };
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | ${siteConfig.nameKo} — 기술 기반 디지털 제작`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "산업자동화 프로그램",
    "공장 자동화",
    "PLC 프로그램",
    "앱 개발",
    "웹사이트 개발",
    "전자책 제작",
    "디지털 콘텐츠",
    "소통웨어",
    "SotongWare",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.nameKo}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} | ${siteConfig.nameKo}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      ko: `${siteConfig.url}/ko`,
      en: `${siteConfig.url}/en`,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
  verification:
    googleSiteVerification || naverSiteVerification
      ? {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(naverSiteVerification
            ? { other: { "naver-site-verification": naverSiteVerification } }
            : {}),
        }
      : undefined,
};
