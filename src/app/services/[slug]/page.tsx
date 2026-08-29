import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service" };
  return createPageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <PlaceholderPage
      title={service.title}
      description={service.description}
      backHref="/services"
      backLabel="서비스 목록"
    />
  );
}
