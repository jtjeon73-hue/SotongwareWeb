import type { Locale } from "@/i18n/config";
import {
  automationCapabilityLabels,
  marketingServiceLabels,
  ventureLabels,
  type VenturePageId,
} from "@/i18n/venture-labels";
import { localizePath } from "@/i18n/localized-path";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessSiteBanner } from "@/components/business/BusinessSiteBanner";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { StructuredData } from "@/components/common/StructuredData";
import { serviceJsonLd } from "@/lib/structured-data";
import { getProductsByType } from "@/data/products";
import { automationPortfolio } from "@/data/automation";
import { marketingTiers } from "@/data/marketing";
import { isContactSubmissionAvailable } from "@/config/platform-status";
import { EbookLibraryView } from "@/components/ebook/EbookLibraryView";
import { KnowledgeHubView } from "@/components/knowledge/KnowledgeHubView";
import { ContentLibraryView } from "@/components/content/ContentLibraryView";

function VentureCtas({ locale, ventureId }: { locale: Locale; ventureId: VenturePageId }) {
  const labels = ventureLabels[locale][ventureId];
  const contactAvailable = isContactSubmissionAvailable();
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {labels.ctas.map((cta) => {
        if (!contactAvailable && cta.href.startsWith("/contact")) return null;
        return (
          <LocalizedButton key={cta.href} href={cta.href} variant={cta.variant} className="min-h-11">
            {cta.label}
          </LocalizedButton>
        );
      })}
    </div>
  );
}

export function AppsPageView({ locale }: { locale: Locale }) {
  const labels = ventureLabels[locale].apps;
  const published = getProductsByType("app");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
        <BusinessSiteBanner businessId="app" />
        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="app"
            typeLabel={labels.typeLabel}
            title={labels.emptyTitle ?? ""}
            description={labels.emptyDescription ?? ""}
          />
        )}
        <VentureCtas locale={locale} ventureId="apps" />
      </div>
    </div>
  );
}

export function EbooksPageView({ locale }: { locale: Locale }) {
  return (
    <>
      <EbookLibraryView locale={locale} />
      <div className="container-main pb-12">
        <VentureCtas locale={locale} ventureId="ebooks" />
      </div>
    </>
  );
}

export function MarketingPageView({ locale }: { locale: Locale }) {
  const labels = ventureLabels[locale].marketing;
  const services = marketingServiceLabels[locale];
  const pageDesc = labels.description;

  return (
    <>
      <StructuredData data={serviceJsonLd(labels.title, pageDesc, localizePath("/marketing", locale))} />
      <div className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
          <BusinessSiteBanner businessId="marketing" />
          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">{labels.sections?.services}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => (
                <article key={svc.id} className="rounded-xl border border-surface-200 p-5">
                  <h3 className="font-semibold text-surface-900">{svc.title}</h3>
                  <p className="mt-2 text-sm text-surface-600">{svc.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-surface-900">{labels.sections?.pricing}</h2>
            <p className="mt-2 text-sm text-surface-600">{labels.sections?.pricingNote}</p>
            <div className="mt-6">
              <PricingTiers tiers={marketingTiers} />
            </div>
          </section>
          <VentureCtas locale={locale} ventureId="marketing" />
        </div>
      </div>
    </>
  );
}

export function ContentsPageView({ locale }: { locale: Locale }) {
  return (
    <>
      <ContentLibraryView locale={locale} />
      <div className="container-main pb-12">
        <VentureCtas locale={locale} ventureId="contents" />
      </div>
    </>
  );
}

export function KnowledgePageView({ locale }: { locale: Locale }) {
  return <KnowledgeHubView locale={locale} />;
}

export function AutomationPageView({ locale }: { locale: Locale }) {
  const labels = ventureLabels[locale].automation;
  const sections = labels.sections ?? {};
  const capabilities = automationCapabilityLabels[locale];
  const published = getProductsByType("automation");
  const pageDesc = labels.description;

  return (
    <>
      <StructuredData
        data={serviceJsonLd(labels.title, pageDesc, localizePath("/automation", locale))}
      />
      <div className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
          <BusinessSiteBanner businessId="automation" />

          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">{sections.capabilities}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap) => (
                <article key={cap.id} className="rounded-xl border border-brand-100 bg-brand-50/50 p-5">
                  <h3 className="font-semibold text-surface-900">{cap.title}</h3>
                  <p className="mt-2 text-sm text-surface-600">{cap.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">{sections.portfolio}</h2>
            {automationPortfolio.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {automationPortfolio.map((item) => (
                  <li key={item.title} className="rounded-xl border border-surface-200 p-5">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-surface-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-surface-600">{sections.portfolioEmpty}</p>
            )}
          </section>

          {published.length > 0 ? (
            <>
              <h2 className="text-lg font-bold text-surface-900">{sections.products}</h2>
              <div className="mt-6">
                <ProductGrid products={published} />
              </div>
            </>
          ) : (
            <ProductEmptyState
              type="automation"
              title={labels.emptyTitle ?? ""}
              description={labels.emptyDescription ?? ""}
            />
          )}

          <VentureCtas locale={locale} ventureId="automation" />
        </div>
      </div>
    </>
  );
}
