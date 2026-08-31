import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function KnowledgeEntrySection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="knowledge-entry-heading">
      <div className="container-main">
        <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/80 to-white p-6 sm:p-8">
          <SectionHeader
            id="knowledge-entry-heading"
            eyebrow="Knowledge & Education"
            title="지식·무료 콘텐츠부터 시작하기"
            description="무료 정보부터 회원·유료·구독까지 — SotongWare 지식·교육 채널과 회원 포털에서 탐색할 수 있습니다."
            className="!mb-0"
          />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/knowledge" variant="primary" className="min-h-11">
              지식·교육 허브
            </Button>
            <Button href="/signup?redirect=/dashboard" variant="outline" className="min-h-11">
              무료 회원으로 보기
            </Button>
            <Link
              href="/ebooks"
              className="inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              관련 전자책 보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
