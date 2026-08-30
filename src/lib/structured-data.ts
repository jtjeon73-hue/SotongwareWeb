import type { SotongProduct } from "@/types/product";
import { siteConfig } from "@/data/navigation";

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    alternateName: siteConfig.nameKo,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function productJsonLd(product: SotongProduct): Record<string, unknown> {
  const base = {
    "@context": "https://schema.org",
    name: product.title,
    description: product.description,
    url: `${siteConfig.url}/products/${product.slug}`,
  };

  if (product.type === "app") {
    return {
      ...base,
      "@type": "SoftwareApplication",
      applicationCategory: product.category ?? "UtilitiesApplication",
      operatingSystem: product.appMeta?.os?.join(", ") ?? "Android",
      offers: product.accessMode === "free"
        ? { "@type": "Offer", price: "0", priceCurrency: product.currency ?? "KRW" }
        : product.price
          ? { "@type": "Offer", price: product.price, priceCurrency: product.currency ?? "KRW" }
          : undefined,
    };
  }

  if (product.type === "ebook") {
    return {
      ...base,
      "@type": "Book",
      author: product.ebookMeta?.author
        ? { "@type": "Person", name: product.ebookMeta.author }
        : undefined,
    };
  }

  if (product.type === "knowledge") {
    return { ...base, "@type": "Article" };
  }

  if (product.type === "content") {
    return { ...base, "@type": "CreativeWork" };
  }

  if (product.type === "marketing" || product.type === "automation") {
    return { ...base, "@type": "Service", provider: { "@type": "Organization", name: siteConfig.name } };
  }

  return { ...base, "@type": "Product" };
}

export function serviceJsonLd(name: string, description: string, url: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteConfig.url}${url}`,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}
