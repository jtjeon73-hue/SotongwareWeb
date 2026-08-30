import Link from "next/link";
import { businessAreas } from "@/data/businesses";
import { siteConfig } from "@/data/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "SotongWare 소개",
  description: `${siteConfig.name} — 산업 현장에서 시작해 디지털 제품과 서비스로 확장하는 기술 기반 회사`,
  path: "/about",
});

const storyBlocks = [
  {
    title: "Industrial Field",
    titleKo: "산업 현장",
    description: "현장 문제를 이해합니다. PLC, 설비, 생산 데이터 등 실제 산업 환경에서 출발합니다.",
  },
  {
    title: "Software Engineering",
    titleKo: "소프트웨어 개발",
    description: "문제를 프로그램으로 해결합니다. 웹, 앱, 자동화 소프트웨어를 직접 설계·개발합니다.",
  },
  {
    title: "AI Utilization",
    titleKo: "AI 활용",
    description: "제작 속도와 확장성을 강화합니다. AI를 도구로 활용해 더 빠르게 결과물을 만듭니다.",
  },
  {
    title: "Digital Product",
    titleKo: "디지털 제품화",
    description: "앱·웹·전자책·콘텐츠로 제품화합니다. 만들고 끝내지 않고 실제 사용·배포까지 연결합니다.",
  },
  {
    title: "Business Connection",
    titleKo: "사업 연결",
    description: "배포·홍보·판매로 연결합니다. 6대 전문 서비스 채널과 디지털 상품으로 고객과 만납니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-4xl">
        <SectionHeader
          eyebrow="About SotongWare"
          title="기술을 만들고 끝내지 않습니다"
          description="SotongWare는 산업 현장에서 시작해 소프트웨어, 자동화, 앱, 웹, 지식, 콘텐츠로 기술 영역을 확장합니다."
        />

        <div className="mt-8 rounded-2xl border border-surface-200 bg-surface-50 p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-surface-500">
            SotongWare의 여정
          </p>
          <ul className="mt-6 space-y-4">
            {storyBlocks.map((block, index) => (
              <li key={block.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-surface-900">
                    {block.titleKo}
                    <span className="ml-2 text-xs font-normal text-surface-500">{block.title}</span>
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-surface-600">{block.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-surface-900">6대 전문 서비스</h2>
          <p className="mt-2 text-sm text-surface-600">
            {siteConfig.name}는 다음 분야의 전문 서비스를 직접 운영합니다.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {businessAreas.map((area) => (
              <li key={area.id} className="rounded-xl border border-surface-200 p-4">
                <Link href={area.internalPath} className="font-semibold text-surface-900 hover:text-brand-700">
                  {area.titleKo}
                </Link>
                <p className="mt-1 text-sm text-surface-600">{area.tagline}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary">제작·사업 문의</Button>
          <Button href="/products" variant="outline">디지털 상품 보기</Button>
          <Button href="/" variant="outline">홈으로</Button>
        </div>
      </div>
    </div>
  );
}
