import type { MarketingTier } from "@/types/product";
import { Button } from "@/components/ui/Button";

export function PricingTiers({ tiers }: { tiers: MarketingTier[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {tiers.map((tier) => (
        <article
          key={tier.id}
          className="flex flex-col rounded-xl border border-surface-200 bg-white p-6"
        >
          <h3 className="text-lg font-bold text-surface-900">{tier.name}</h3>
          <p className="mt-2 text-sm text-surface-600">{tier.description}</p>
          <p className="mt-4 text-2xl font-bold text-brand-700">{tier.priceLabel}</p>
          <ul className="mt-6 flex-1 space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button href={`/contact?topic=marketing&plan=${tier.id}`} variant="outline" className="w-full">
              상담 요청
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
