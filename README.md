# SotongwareWeb

SotongWare(소통웨어) 공식 대외 홈페이지 — **SotongWare Digital Business Platform**의 기초 골격입니다.

단순 회사 소개 사이트가 아니라, 앱·전자책·웹·콘텐츠·산업자동화 결과물을 연결하고 24시간 자동으로 사업이 운영되는 디지털 플랫폼으로 발전할 프로젝트입니다.

## 목적

- SotongWare 브랜드와 사업을 대외에 명확히 전달
- 결과물(Works) 중심 마케팅 구조
- 향후 Sotong24Work, Firestore, CMS, 플랫폼 API 연동 기반
- SEO·접근성·성능을 고려한 마케팅 사이트

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **ESLint**

## 개발 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 빌드

```bash
npm run build    # static export → out/
```

로컬 미리보기는 `npm run dev` 사용. 프로덕션은 Firebase Hosting에 `out/`을 배포합니다.

## Firebase Hosting 배포

- **Project ID:** `sotongware` (SotongWareControl `sotongware-control`과 분리)
- **URL:** https://sotongware.web.app

```bash
npm run deploy:hosting
```

상세: [`docs/deploy-firebase-hosting.md`](docs/deploy-firebase-hosting.md)

## Lint

```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지·라우팅
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 홈페이지
│   ├── services/           # 서비스 페이지
│   ├── works/              # 결과물 페이지
│   ├── solutions/          # 솔루션 페이지
│   ├── insights/           # 인사이트 페이지
│   ├── about/              # 소개
│   ├── ai-guide/           # AI 안내 (확장 지점)
│   ├── contact/            # 문의
│   ├── robots.ts           # robots.txt
│   └── sitemap.ts          # sitemap.xml
├── components/
│   ├── layout/             # Header, Footer, SiteLayout
│   ├── home/               # 홈 섹션 컴포넌트
│   ├── ui/                 # Button, SectionHeader, Icons
│   └── shared/             # PlaceholderPage 등
├── data/                   # 정적 데이터 (향후 API/CMS 교체)
│   ├── navigation.ts
│   ├── services.ts
│   ├── works.ts
│   └── home.ts
├── lib/                    # 유틸, metadata
├── types/                  # TypeScript 타입 정의
└── styles/
    └── globals.css
```

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 홈페이지 (12개 섹션) |
| `/services` | 제작 서비스 목록 |
| `/works` | 결과물 카탈로그 |
| `/solutions` | 목적별 솔루션 |
| `/insights` | 기술·사업 인사이트 |
| `/about` | 회사 소개 |
| `/ai-guide` | AI 자동 안내 (확장 준비) |
| `/contact` | 문의 |

## 메인 홈페이지 섹션

1. Header
2. Hero
3. What We Build (5개 핵심 사업)
4. Latest Works (결과물, 빈 상태 UI)
5. Why SotongWare
6. How It Works
7. Explore by Goal
8. Technology & Capability
9. AI Guide Preview
10. Ecosystem
11. Final CTA
12. Footer

## 향후 배포 방향

- Firebase Hosting (`sotongware` 프로젝트) — **배포 완료**
- 도메인: `sotongware.com` (Custom Domain DNS 연결은 사용자 작업)
- CI/CD: `npm run deploy:hosting`

## 관련 저장소

- **SotongWareControl** — 수정하지 않음
- **Sotong24Work** — 수정하지 않음 (향후 결과물 자동 등록 연동)

## 문서

상세 사업·사이트 기획은 [`docs/site-plan.md`](docs/site-plan.md) 참고.
