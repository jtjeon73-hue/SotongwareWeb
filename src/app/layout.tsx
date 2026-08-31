import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AnalyticsScripts } from "@/components/common/AnalyticsScripts";
import { AppProviders } from "@/components/providers/AppProviders";
import { defaultMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AppProviders>
          <AnalyticsScripts />
          <SiteLayout>{children}</SiteLayout>
        </AppProviders>
      </body>
    </html>
  );
}
