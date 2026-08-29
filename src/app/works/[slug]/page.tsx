import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";
import { createPageMetadata } from "@/lib/metadata";

const workCategories = [
  { slug: "apps", title: "Apps", description: "SotongWare가 개발한 앱 목록" },
  { slug: "ebooks", title: "E-books", description: "SotongWare 전자책 목록" },
  { slug: "websites", title: "Websites", description: "SotongWare 웹사이트 목록" },
  { slug: "automation", title: "Automation", description: "산업자동화 프로그램 목록" },
  { slug: "content", title: "Content", description: "음악, Shorts, 영상 콘텐츠" },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return workCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = workCategories.find((c) => c.slug === slug);
  if (!cat) return { title: "Works" };
  return createPageMetadata({
    title: cat.title,
    description: cat.description,
    path: `/works/${cat.slug}`,
  });
}

export default async function WorksCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = workCategories.find((c) => c.slug === slug);
  if (!cat) {
    return (
      <PlaceholderPage
        title="Work Detail"
        description="개별 결과물 상세 페이지입니다."
        backHref="/works"
        backLabel="Works 목록"
      />
    );
  }

  return (
    <PlaceholderPage
      title={cat.title}
      description={cat.description}
      backHref="/works"
      backLabel="Works 목록"
    />
  );
}
