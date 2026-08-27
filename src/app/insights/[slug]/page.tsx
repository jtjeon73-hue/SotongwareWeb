import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

const insightCategories = [
  { slug: "tech", title: "기술자료", description: "기술 문서와 자료" },
  { slug: "industrial", title: "산업자동화", description: "산업자동화 인사이트" },
  { slug: "digital", title: "앱·웹", description: "앱과 웹 관련 인사이트" },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return insightCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = insightCategories.find((c) => c.slug === slug);
  return { title: cat?.title ?? "Insights", description: cat?.description };
}

export default async function InsightCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = insightCategories.find((c) => c.slug === slug);
  if (!cat) {
    return (
      <PlaceholderPage
        title="Insight"
        description="인사이트 상세"
        backHref="/insights"
        backLabel="Insights 목록"
      />
    );
  }

  return (
    <PlaceholderPage
      title={cat.title}
      description={cat.description}
      backHref="/insights"
      backLabel="Insights 목록"
    />
  );
}
