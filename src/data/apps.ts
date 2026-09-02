import type { SotongProduct } from "@/types/product";
import type { SotongProductI18n } from "@/lib/product-i18n";

/** SotongWare 제작 앱 — 향후 Sotong24Work 자동 등록 */
export const apps: (SotongProduct & { i18n?: SotongProductI18n })[] = [
  {
    id: "app-electrical-inspection-check",
    slug: "electrical-inspection-check",
    type: "app",
    title: "전기 점검 체크 앱",
    subtitle: "전기설비 점검 현장 지원",
    description:
      "전기설비 점검 업무에서 체크리스트와 점검 기록을 지원하는 앱입니다. 현장 점검 업무의 기본 흐름을 돕는 것을 목표로 개발·검증 중입니다.",
    category: "산업·전기",
    tags: ["전기", "점검", "체크리스트", "현장"],
    language: "ko",
    status: "testing",
    accessMode: "free",
    priceLabel: "출시 후 무료 예정",
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-29",
    featured: false,
    publicationGate: {
      productionStatus: "completed",
      validationStatus: "internal_validation",
      qualityStatus: "pending",
      complianceStatus: "pending",
      publicationStatus: "internal_validation",
      userFinalApproval: false,
    },
    i18n: {
      en: {
        title: "Electrical Inspection Checklist",
        subtitle: "Field support for electrical facility inspections",
        description:
          "A mobile app that supports checklists and inspection records for electrical facility work. Currently in development and validation to help standardize on-site inspection workflows.",
        category: "Industrial · Electrical",
        priceLabel: "Free after launch",
        features: [
          "Manage electrical inspection items",
          "Support on-site inspection checks",
          "Track inspection records",
        ],
      },
    },
    storeLinks: {},
    commerceChannels: [
      {
        type: "play_store",
        label: "Google Play",
        status: "preparing",
        external: true,
      },
      {
        type: "inquiry",
        label: "앱 제작 문의",
        url: "/contact?topic=app",
        status: "preparing",
        external: false,
      },
    ],
    appMeta: {
      version: "0.1.0",
      os: ["Android"],
      releaseStatus: "ready",
      features: [
        "전기설비 점검 항목 관리",
        "현장 점검 체크 지원",
        "점검 기록 관리",
      ],
    },
  },
];

export function getAppBySlug(slug: string): SotongProduct | undefined {
  return apps.find((a) => a.slug === slug && a.type === "app");
}
