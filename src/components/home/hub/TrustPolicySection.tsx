import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HomeDictionary } from "@/i18n/types";

interface TrustPolicySectionProps {
  dict: HomeDictionary;
}

export function TrustPolicySection({ dict }: TrustPolicySectionProps) {
  const { trust } = dict;

  return (
    <section className="section-padding bg-white" aria-labelledby="trust-heading">
      <div className="container-main">
        <SectionHeader
          id="trust-heading"
          eyebrow={trust.eyebrow}
          title={trust.title}
          description={trust.description}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trust.items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-xl border border-surface-200 bg-surface-50/50 p-5 transition-colors hover:border-brand-200 hover:bg-brand-50/30"
            >
              <p className="font-semibold text-surface-900 group-hover:text-brand-800">{item.label}</p>
              <p className="mt-1 text-sm text-surface-600">{item.desc}</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-surface-500">{trust.policyNote}</p>
        <nav className="mt-4 flex flex-wrap gap-4" aria-label="Policies">
          {trust.policies.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
