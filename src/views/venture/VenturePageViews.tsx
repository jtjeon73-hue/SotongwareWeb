import Link from "next/link";
import type { Locale } from "@/i18n/config";
import {
  automationCapabilityLabels,
  contentCategoryLabels,
  knowledgeRailLabels,
  knowledgeTierLabels,
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
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { StructuredData } from "@/components/common/StructuredData";
import { serviceJsonLd } from "@/lib/structured-data";
import { getProductsByType } from "@/data/products";
import { ebooks } from "@/data/ebooks";
import { contents } from "@/data/contents";
import { knowledgeItems, knowledgeFields } from "@/data/knowledge";
import { automationPortfolio, automationProducts } from "@/data/automation";
import { marketingTiers } from "@/data/marketing";
import { isContactSubmissionAvailable } from "@/config/platform-status";
import { EXTERNAL_SITE_MEMBER_NOTICE } from "@/data/business-access";

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
  const labels = ventureLabels[locale].ebooks;
  const published = ebooks.filter((e) => e.status !== "draft");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
        <BusinessSiteBanner businessId="ebook" />
        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="ebook"
            title={labels.emptyTitle ?? ""}
            description={labels.emptyDescription ?? ""}
          />
        )}
        <VentureCtas locale={locale} ventureId="ebooks" />
      </div>
    </div>
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
  const labels = ventureLabels[locale].contents;
  const published = contents.filter((c) => c.status !== "draft");
  const categories = contentCategoryLabels[locale];

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
        <BusinessSiteBanner businessId="content" />
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-surface-200 p-4">
              <p className="font-semibold text-surface-900">{cat.label}</p>
            </div>
          ))}
        </div>
        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="content"
            title={labels.emptyTitle ?? ""}
            description={labels.emptyDescription ?? ""}
          />
        )}
        <VentureCtas locale={locale} ventureId="contents" />
      </div>
    </div>
  );
}

export function KnowledgePageView({ locale }: { locale: Locale }) {
  const labels = ventureLabels[locale].knowledge;
  const sections = labels.sections ?? {};
  const tiers = knowledgeTierLabels[locale];
  const rails = knowledgeRailLabels[locale];
  const published = knowledgeItems.filter((k) => k.status !== "draft");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />
        <BusinessSiteBanner businessId="knowledge" />

        <div className="mb-8 rounded-xl border border-surface-200 bg-surface-50 p-5">
          <p className="text-sm font-semibold text-surface-900">{sections.portalTitle}</p>
          <p className="mt-1 text-sm text-surface-600">{sections.portalDescription}</p>
          <p className="mt-2 text-xs leading-relaxed text-surface-500">{EXTERNAL_SITE_MEMBER_NOTICE}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <LocalizedButton href="/signup?redirect=/dashboard" variant="primary" className="min-h-11">
              {sections.signup}
            </LocalizedButton>
            <LocalizedButton href="/login?redirect=/dashboard" variant="outline" className="min-h-11">
              {sections.login}
            </LocalizedButton>
          </div>
        </div>

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-surface-200 p-4">
              <p className="font-semibold text-surface-900">{tier.label}</p>
              <p className="mt-1 text-sm text-surface-600">{tier.desc}</p>
              {tier.id === "member" && (
                <p className="mt-2 text-xs text-surface-500">{sections.comingSoon}</p>
              )}
              {(tier.id === "paid" || tier.id === "subscription") && (
                <p className="mt-2 text-xs text-surface-500">{sections.paymentPrep}</p>
              )}
              <Link
                href="/signup?redirect=/dashboard"
                className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {tier.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold text-surface-900">{sections.contentAreas}</h2>
          <p className="mt-1 text-sm text-surface-600">{sections.contentAreasNote}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {rails.map((rail) => (
              <Link
                key={rail.title}
                href="/signup?redirect=/dashboard"
                className="group rounded-xl border border-surface-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/30"
              >
                <p className="font-semibold text-surface-900 group-hover:text-brand-700">{rail.title}</p>
                <p className="mt-1 text-sm text-surface-600">{rail.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">{sections.fields}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {knowledgeFields.map((field) => (
              <span key={field} className="rounded-lg bg-surface-100 px-3 py-1.5 text-sm text-surface-700">
                {field}
              </span>
            ))}
          </div>
        </div>

        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="knowledge"
            title={labels.emptyTitle ?? ""}
            description={labels.emptyDescription ?? ""}
          />
        )}

        <p className="mt-8 text-sm text-surface-500">
          <LocalizedLink href="/ebooks" className="font-medium text-brand-600 hover:text-brand-700">
            {sections.relatedEbooks} →
          </LocalizedLink>
        </p>
      </div>
    </div>
  );
}

export function AutomationPageView({ locale }: { locale: Locale }) {
  const labels = ventureLabels[locale].automation;
  const sections = labels.sections ?? {};
  const capabilities = automationCapabilityLabels[locale];
  const published = automationProducts.filter((p) => p.status !== "draft");
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
