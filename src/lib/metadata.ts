import type { Metadata } from "next";
import { siteConfig } from "@/data/navigation";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
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
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.nameKo}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: "/icon.svg",
  },
};
