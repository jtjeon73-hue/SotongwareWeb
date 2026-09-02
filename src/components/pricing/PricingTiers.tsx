"use client";

import type { Locale } from "@/i18n/config";
import type { MarketingTier } from "@/types/product";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { useLocale } from "@/contexts/LocaleProvider";

const tierCta: Record<Locale, string> = {
  ko: "상담 요청",
  en: "Request consultation",
};

export function PricingTiers({ tiers }: { tiers: MarketingTier[] }) {
  const { locale } = useLocale();

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {tiers.map((tier) => (
        <article key={tier.id} className="flex flex-col rounded-xl border border-surface-200 bg-white p-6">
          <h3 className="text-lg font-bold text-surface-900">{tier.name}</h3>
          <p className="mt-2 text-sm text-surface-600">{tier.description}</p>
          <p className="mt-4 text-2xl font-bold text-brand-700">
            {locale === "en" && tier.priceLabel === "상담 후 결정" ? "Quoted after consultation" : tier.priceLabel}
          </p>
          <ul className="mt-6 flex-1 space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <LocalizedButton
              href={`/contact?topic=marketing&plan=${tier.id}`}
              variant="outline"
              className="w-full"
            >
              {tierCta[locale]}
            </LocalizedButton>
          </div>
        </article>
      ))}
    </div>
  );
}
