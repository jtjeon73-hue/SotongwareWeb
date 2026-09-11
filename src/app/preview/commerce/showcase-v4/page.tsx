import type { Metadata } from "next";
import Link from "next/link";
import {
  PREVIEW_BASE,
  previewBusinesses,
  type PreviewBusinessSlug,
} from "@/data/preview-commerce";
import {
  ShowcaseShell,
  SHOWCASE_PATH,
  SHOWCASE_V4_PATH,
} from "@/components/preview/commerce/showcase/ShowcaseChrome";
import { EcosystemDiagramV4 } from "@/components/preview/commerce/showcase/EcosystemDiagramV4";
import {
  PremiumBusinessIcon,
  PremiumIconStage,
} from "@/components/preview/commerce/showcase/Premium3DIcons";

export const metadata: Metadata = {
  title: "Commerce Showcase V4 | SotongWare",
  description: "입체 프리미엄 아이콘 시안 — 검토용 시제품, 실제 결제 없음",
  robots: { index: false, follow: false },
};

const vibe: Record<
  PreviewBusinessSlug,
  { ring: string; glow: string; tag: string }
> = {
  automation: {
    ring: "border-cyan-400/45",
    glow: "from-slate-950/90 to-cyan-950/55",
    tag: "Precision Tech",
  },
  apps: {
    ring: "border-sky-400/45",
    glow: "from-blue-950/90 to-sky-900/45",
    tag: "Product Stage",
  },
  ebooks: {
    ring: "border-amber-400/45",
    glow: "from-amber-950/80 to-orange-900/40",
    tag: "Digital Library",
  },
  knowledge: {
    ring: "border-emerald-400/45",
    glow: "from-emerald-950/80 to-teal-900/40",
    tag: "Learn & Explore",
  },
  marketing: {
    ring: "border-rose-400/45",
    glow: "from-rose-950/70 to-fuchsia-900/40",
    tag: "Growth Signal",
  },
  contents: {
    ring: "border-fuchsia-400/45",
    glow: "from-indigo-950/80 to-pink-900/45",
    tag: "K-Content Stage",
  },
};

const mockEbooks = [
  { title: "현장 자동화 첫걸음", tone: "from-amber-600 to-orange-900", badge: "단건" },
  { title: "스마트공장 체크리스트", tone: "from-slate-700 to-cyan-900", badge: "Basic" },
  { title: "K-Tech 스토리", tone: "from-rose-700 to-fuchsia-900", badge: "새 콘텐츠" },
];

const mockApps = [
  { title: "현장 점검", screens: ["홈", "점검", "보고"] },
  { title: "작업 보드", screens: ["할 일", "일정", "알림"] },
];

const mockShorts = [
  { title: "30초 공정 팁", tone: "from-fuchsia-600 to-indigo-900" },
  { title: "만화: 설비 대화", tone: "from-amber-500 to-rose-800" },
  { title: "루프 사운드", tone: "from-cyan-500 to-violet-900" },
];

const glass =
  "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_40px_-20px_rgba(34,211,238,0.4)] backdrop-blur-md motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-cyan-300/35 motion-safe:hover:shadow-[0_0_48px_-12px_rgba(34,211,238,0.5)] focus-within:ring-2 focus-within:ring-cyan-300";

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-white drop-shadow" aria-hidden>
      <path fill="currentColor" d="M8 6.5v11l9-5.5-9-5.5z" />
    </svg>
  );
}

export default function PreviewCommerceShowcaseV4Page() {
  return (
    <ShowcaseShell active="v4">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.24),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(217,70,239,0.16),transparent_48%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] max-md:opacity-[0.06] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-fuchsia-200 uppercase">
              Premium 3D Icon Showcase · V4
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              5초 안에 보이는
              <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                기술 · K-콘텐츠 · 세계 수익
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              산업기술에서 제작과 콘텐츠를 거쳐 세계 고객, 회원·수익으로 이어집니다.
              아이콘 자체에 색·깊이·하이라이트를 담은 비교용 시안입니다. (mock · 결제 없음)
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${PREVIEW_BASE}/pricing`}
                className="inline-flex min-h-12 items-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-400 px-5 text-base font-semibold text-[#071428] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Free · Basic 요금 보기
              </Link>
              <Link
                href={`${PREVIEW_BASE}/library`}
                className="inline-flex min-h-12 items-center rounded-xl border border-white/25 bg-white/5 px-5 text-base font-medium text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                내 자료실
              </Link>
              <Link
                href={SHOWCASE_PATH}
                className="inline-flex min-h-12 items-center rounded-xl px-4 text-sm font-medium text-cyan-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                V3와 비교
              </Link>
            </div>
          </div>
          <div className={`${glass} p-2 sm:p-3`}>
            <EcosystemDiagramV4 className="h-auto w-full" />
            <p className="mt-1 text-center text-xs text-slate-400">
              V4 생태계 · 방향 화살표 · 입체 노드 · SVG only
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">입체 사업부 아이콘</h2>
          <p className="mt-2 text-slate-300">
            duotone · isometric depth · highlight · soft shadow. 호버 시 앞면이 아주 살짝 떠오릅니다.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewBusinesses.map((biz) => {
            const style = vibe[biz.slug];
            return (
              <li key={biz.slug}>
                <Link
                  href={`${PREVIEW_BASE}/business/${biz.slug}`}
                  className={`group/card flex h-full flex-col overflow-hidden rounded-3xl border ${style.ring} bg-gradient-to-br ${style.glow} p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_22px_60px_-28px_rgba(34,211,238,0.7)]`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <PremiumIconStage>
                      <PremiumBusinessIcon
                        slug={biz.slug}
                        size="xl"
                        decorative={false}
                        title={biz.title}
                      />
                    </PremiumIconStage>
                    <span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-cyan-100 uppercase">
                      {style.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{biz.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-300">{biz.short}</p>
                  <p className="mt-4 text-sm font-medium text-cyan-200">
                    {biz.primaryAction} →
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-white/10 bg-[#071428]/85">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">대표 mock 전시</h2>
              <p className="mt-1 text-sm text-slate-400">실제 상품이 아닌 시안용 시각 자료입니다.</p>
            </div>
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
              MOCK ONLY
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-amber-200 uppercase">
              전자책 표지
            </h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-3">
              {mockEbooks.map((book) => (
                <li key={book.title} className={glass}>
                  <div
                    className={`relative flex h-40 items-end overflow-hidden rounded-2xl bg-gradient-to-br ${book.tone} p-4`}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-6 top-4 bottom-8 rounded-md bg-white/10 shadow-inner"
                    />
                    <span className="relative rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {book.badge}
                    </span>
                  </div>
                  <p className="mt-3 font-medium text-white">{book.title}</p>
                  <Link
                    href={`${PREVIEW_BASE}/product/factory-start-ebook`}
                    className="mt-2 inline-flex min-h-10 items-center text-sm text-cyan-300 hover:text-cyan-100"
                  >
                    미리보기 흐름 →
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-sky-200 uppercase">
                앱 화면 카드
              </h3>
              <ul className="mt-3 space-y-3">
                {mockApps.map((app) => (
                  <li key={app.title} className={glass}>
                    <p className="font-medium text-white">{app.title}</p>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {app.screens.map((s) => (
                        <div
                          key={s}
                          className="min-w-[88px] rounded-2xl border border-white/15 bg-gradient-to-b from-sky-500/80 to-slate-950 p-3 text-center text-xs text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-fuchsia-200 uppercase">
                쇼츠 · 만화 · 사운드
              </h3>
              <ul className="mt-3 grid grid-cols-3 gap-3">
                {mockShorts.map((item) => (
                  <li key={item.title} className={`${glass} p-3`}>
                    <div
                      className={`flex aspect-[3/4] items-center justify-center rounded-xl bg-gradient-to-br ${item.tone}`}
                    >
                      <PlayMark />
                    </div>
                    <p className="mt-2 text-xs leading-snug text-slate-200">{item.title}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-cyan-200 uppercase">
              산업자동화 개선 전후
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className={`${glass} border-rose-400/25`}>
                <p className="text-xs font-semibold text-rose-200">Before</p>
                <p className="mt-2 text-sm text-slate-200">수기 집계 · 비가동 원인 불명</p>
              </div>
              <div className={`${glass} border-emerald-400/30`}>
                <p className="text-xs font-semibold text-emerald-200">After</p>
                <p className="mt-2 text-sm text-slate-200">실시간 화면 · 비가동 −18% (시안 수치)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold text-white">요금 · 다음 행동</h2>
        <p className="mt-2 text-sm text-slate-300">
          입체 아이콘 시안에서도 요금·미리보기·자료실 CTA는 분명해야 합니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            ["Free", "0원 · 미리보기"],
            ["Basic 월", "2,000원"],
            ["Basic 연", "20,000원"],
            ["단건구매", "상품별"],
          ].map(([name, price]) => (
            <div
              key={name}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur"
            >
              <p className="text-xs font-semibold tracking-wide text-cyan-200 uppercase">{name}</p>
              <p className="mt-1 text-sm font-medium text-white">{price}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`${PREVIEW_BASE}/pricing`}
            className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 font-semibold text-[#071428] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            요금 비교로 이동
          </Link>
          <Link
            href={`${PREVIEW_BASE}/product/factory-start-ebook`}
            className="inline-flex min-h-12 items-center rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/15 px-5 font-medium text-fuchsia-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
          >
            전자책 미리보기
          </Link>
          <Link
            href={`${PREVIEW_BASE}/checkout?sku=basic-month&mode=subscription`}
            className="inline-flex min-h-12 items-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-5 font-medium text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            결제 확인(시제품)
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">
            V4 입체 아이콘 시안 · V2/V3 보존 · {SHOWCASE_V4_PATH}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={SHOWCASE_PATH}
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-sm text-white hover:bg-white/10"
            >
              화려한 V3 보기
            </Link>
            <span className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-blue-400 px-4 text-sm font-medium text-[#071428]">
              입체 V4 (현재)
            </span>
          </div>
        </div>
      </footer>
    </ShowcaseShell>
  );
}
