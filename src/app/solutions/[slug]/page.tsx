import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

const solutions = [
  { slug: "digital-business", title: "Digital Business", description: "온라인 사업 구축 솔루션" },
  { slug: "business-automation", title: "Business Automation", description: "업무 자동화 솔루션" },
  { slug: "ai-utilization", title: "AI Utilization", description: "AI 활용 솔루션" },
  { slug: "industrial-solutions", title: "Industrial Solutions", description: "산업 솔루션" },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sol = solutions.find((s) => s.slug === slug);
  return { title: sol?.title ?? "Solutions", description: sol?.description };
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const sol = solutions.find((s) => s.slug === slug);
  if (!sol) {
    return (
      <PlaceholderPage
        title="Solution"
        description="솔루션 상세 페이지"
        backHref="/solutions"
        backLabel="Solutions 목록"
      />
    );
  }

  return (
    <PlaceholderPage
      title={sol.title}
      description={sol.description}
      backHref="/solutions"
      backLabel="Solutions 목록"
    />
  );
}
