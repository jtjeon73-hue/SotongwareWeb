"use client";

import Link from "next/link";
import type { SotongProduct } from "@/types/product";
import type { CommerceChannel } from "@/types/commerce";
import {
  COMMERCE_STATUS_LABELS,
  resolveCommerceChannels,
} from "@/lib/commerce";
import { formatPrice, STATUS_LABELS } from "@/lib/products";
import { hasValidUrl } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";
import { isContactSubmissionAvailable } from "@/config/platform-status";

interface CommerceConversionPanelProps {
  product: SotongProduct;
}

function trackChannelClick(
  channel: CommerceChannel,
  product: SotongProduct,
): void {
  trackEvent("commerce_channel_click", {
    channel_type: channel.type,
    channel_status: channel.status,
    product_slug: product.slug,
    product_type: product.type,
  });
  if (channel.status === "active") {
    trackEvent("conversion_start", {
      conversion_type: channel.type,
      product_slug: product.slug,
      product_type: product.type,
    });
  }
}

export function CommerceConversionPanel({ product }: CommerceConversionPanelProps) {
  const channels = resolveCommerceChannels(product);
  const contactAvailable = isContactSubmissionAvailable();

  return (
    <section className="mt-10 rounded-xl border border-surface-200 bg-surface-50 p-5 sm:p-6" aria-labelledby="commerce-panel-heading">
      <h2 id="commerce-panel-heading" className="text-lg font-bold text-surface-900">
        이용 방법
      </h2>

      <dl className="mt-5 space-y-4">
        {channels.map((channel) => (
          <div key={channel.type + channel.label} className="border-b border-surface-200 pb-4 last:border-0 last:pb-0">
            <dt className="text-sm font-semibold text-surface-900">{channel.label}</dt>
            <dd className="mt-1">
              <ChannelAction
                channel={channel}
                contactAvailable={contactAvailable}
                onActivate={() => trackChannelClick(channel, product)}
              />
            </dd>
          </div>
        ))}

        <div className="border-b border-surface-200 pb-4">
          <dt className="text-sm font-semibold text-surface-900">가격</dt>
          <dd className="mt-1 text-sm text-surface-700">{formatPrice(product)}</dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-surface-900">현재 상태</dt>
          <dd className="mt-1 text-sm text-surface-700">{STATUS_LABELS[product.status]}</dd>
        </div>
      </dl>
    </section>
  );
}

function ChannelAction({
  channel,
  contactAvailable,
  onActivate,
}: {
  channel: CommerceChannel;
  contactAvailable: boolean;
  onActivate: () => void;
}) {
  if (channel.status === "preparing" || channel.status === "paused") {
    return (
      <span className="inline-flex min-h-11 items-center text-sm text-surface-500">
        {COMMERCE_STATUS_LABELS[channel.status]}
      </span>
    );
  }

  if (channel.type === "inquiry") {
    if (!contactAvailable) {
      return (
        <span className="inline-flex min-h-11 items-center text-sm text-surface-500">
          문의 접수 준비 중
        </span>
      );
    }
    if (channel.url && !channel.external) {
      return (
        <Link
          href={channel.url}
          className="inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
          onClick={onActivate}
        >
          {channel.label} →
        </Link>
      );
    }
  }

  if (channel.url && channel.external && hasValidUrl(channel.url)) {
    return (
      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
        onClick={onActivate}
      >
        {channel.label} ↗
      </a>
    );
  }

  if (channel.url && !channel.external) {
    return (
      <Link
        href={channel.url}
        className="inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
        onClick={onActivate}
      >
        {channel.label} →
      </Link>
    );
  }

  return (
    <span className="text-sm text-surface-500">
      {COMMERCE_STATUS_LABELS[channel.status]}
    </span>
  );
}
