# SotongWare 홈페이지 사이트 기획 문서

> Cursor/Codex가 SotongWare 홈페이지를 개발할 때 참조하는 기준 문서입니다.
> **현재 구현**과 **향후 구현**을 명확히 구분합니다.

---

## 1. SotongWare 브랜드 포지셔닝

**SotongWare / 소통웨어**는 단순 홈페이지 제작업체나 일반 AI 회사가 아닙니다.

산업자동화, 소프트웨어 개발, AI 활용, 디지털 콘텐츠, 온라인 사업화를 결합하여 **「기술과 디지털 자산을 만들어 실제 문제를 해결하고 지속적인 가치를 만드는 기술 기반 디지털 제작 회사」**로 포지셔닝합니다.

---

## 2. 사업 목표

- 자체적으로 앱, 전자책, 웹, 콘텐츠, 산업 프로그램을 지속 제작·공개
- 검색·플랫폼 유입 → 사용·구매·감상 → 관련 서비스 이동 → 수익
- 24시간 무인 운영 가능한 디지털 사업 플랫폼 구축

---

## 3. 핵심 고객군

- 산업 현장 자동화·모니터링이 필요한 제조업
- 앱·웹·전자책을 통해 사업·정보를 확장하려는 사업자
- 디지털 콘텐츠로 유입·수익을 만들려는 크리에이터·기업
- 기술 기반 솔루션을 찾는 B2B·B2C 방문자

---

## 4. 5개 핵심 사업

| 영역 | 설명 |
|------|------|
| A. 산업자동화 | PLC, MES, Modbus, 설비 모니터링, 생산 데이터 |
| B. 앱 개발 | Android, Web App, Google Play 출시·수익화 |
| C. 웹·사이트 | 홈페이지, 지식 사이트, 온라인 사업 플랫폼 |
| D. 전자책 | 기획~판매, 다중 플랫폼 연동 |
| E. 콘텐츠 | Shorts, 영상, 음악, 지식 콘텐츠 |

---

## 5. 무인 디지털 사업장 개념

홈페이지는 **회사소개 → 상담 → 전화** 구조가 아닙니다.

```
방문자 유입 → 목적 파악 → 서비스/콘텐츠 안내 → 체험 → 추천 → 플랫폼 이동 → 수익 → 재추천
```

직접 상담은 자동 안내로 해결 불가 시 **최종 수단**.

---

## 6. 사이트 정보 구조 (장기)

```
HOME
SERVICES (5개 핵심 사업)
PRODUCTS / WORKS (Apps, E-books, Websites, Automation, Music, Shorts, Content)
SOLUTIONS (Business Automation, AI, Digital Business, Industrial)
PORTFOLIO / CASES
INSIGHTS (기술자료, 사업, AI, 산업, 앱, 웹, 콘텐츠)
ABOUT
AI GUIDE
CONTACT
[향후] STORE, MY PROJECT, CUSTOMER PORTAL, KO/EN
```

**현재 구현:** HOME, SERVICES, WORKS, SOLUTIONS, INSIGHTS, ABOUT, AI GUIDE, CONTACT, privacy/terms placeholder

---

## 7. 메인 페이지 구성

| # | 섹션 | 현재 상태 |
|---|------|-----------|
| 01 | Header | ✅ 구현 |
| 02 | Hero | ✅ 구현 |
| 03 | What We Build | ✅ 구현 |
| 04 | Latest Works | ✅ 구현 (빈 상태 UI) |
| 05 | Why SotongWare | ✅ 구현 |
| 06 | How It Works | ✅ 구현 |
| 07 | Explore by Goal | ✅ 구현 |
| 08 | Technology | ✅ 구현 |
| 09 | AI Guide Preview | ✅ 구현 (구조만) |
| 10 | Ecosystem | ✅ 구현 |
| 11 | Final CTA | ✅ 구현 |
| 12 | Footer | ✅ 구현 |

---

## 8. CTA 전략

우선순위:

1. 결과물 둘러보기
2. 내게 필요한 서비스 찾기
3. 앱 사용하기
4. 전자책 둘러보기
5. 사이트/서비스 체험
6. 콘텐츠 감상
7. AI 안내
8. 직접 문의 (보조)

---

## 9. 결과물 중심 마케팅 전략

- 가짜 프로젝트 금지
- `src/data/works.ts` + `WorkItem` 타입으로 확장
- 향후 Sotong24Work 완료 → 자동 홈페이지 등록

---

## 10. AI 자동 안내 방향

**현재:** 목적 선택 → 관련 페이지 링크 (`/ai-guide`, 홈 Preview 섹션)

**향후:** LLM API, 요구사항 정리, 견적 요청, 관리자 전달

---

## 11. 앱 → Google Play 전략

- `playStoreUrl`, `storeUrl`, `distributionLinks` 필드
- Publisher Adapter로 Google Play API 연동 (미구현)

---

## 12. 전자책 배포 전략

- 단일 플랫폼 비종속
- `purchaseUrl`, `distributionLinks` 다중 판매처

---

## 13. 웹/지식사이트 수익화 전략

- SEO 구조, Insights, 관련 Works 연결
- `relatedItems`, `relatedServices`

---

## 14. Shorts/YouTube 전략

- `youtubeUrl`, type `shorts`
- 지정 채널 자동 등록 (Sotong24Work 연동, 미구현)

---

## 15. 음악 배포 전략

- type `music`, YouTube → 향후 음원 유통

---

## 16. 콘텐츠 상호 연결 전략

Apps ↔ E-books ↔ Websites ↔ Content ↔ Automation 순환 구조.
데이터 모델: `relatedItems`, `relatedServices`, `relatedContent` (향후)

---

## 17. SEO 전략

**현재 구현:**

- Metadata, Open Graph, Title/Description
- semantic HTML, H1/H2 계층
- `robots.ts`, `sitemap.ts`
- 키워드 스팸 없이 자연스러운 복사

**향후:** 서비스별 랜딩, canonical, 구조화 데이터

---

## 18. KO/EN 확장 전략

- 현재 한국어 중심
- 텍스트는 `src/data/` 분리 (향후 `data/ko`, `data/en` 또는 i18n)
- Header KO placeholder

---

## 19. 결제 확장 방향

STORE, purchaseUrl, 결제 API — **미구현**

---

## 20. Sotong24Work 연동 방향

```
Sotong24Work 제작 → 검수 → 승인 → 플랫폼 배포 → 홈페이지 등록 → 홍보 → 성과 추적
```

Distribution Adapter / Publisher Adapter 패턴으로 느슨한 결합.

**현재:** `works.ts` 빈 배열, 타입·UI 준비만.

---

## 데이터 모델 (WorkItem)

```typescript
id, slug, type, title, subtitle, description, thumbnail,
category, tags, language, status, publishedAt, featured,
externalUrl, storeUrl, playStoreUrl, youtubeUrl, purchaseUrl, demoUrl,
distributionLinks, relatedItems, relatedServices
```

type: `app | ebook | website | automation | music | shorts | video | article`

---

## 이번 단계에서 의도적으로 하지 않은 것

- DNS, Firebase Hosting 배포, 외부 API, AI 챗봇, 결제, 회원, Firestore, 이메일
- SotongWareControl / Sotong24Work 수정
- 가짜 결과물, 허위 연락처, 허위 통계

---

## 다음 권장 작업

1. 첫 실제 Work(앱/전자책 등) 데이터 등록 및 상세 페이지 UI
2. AI Guide LLM 연동 및 견적 요청 폼
3. Firebase Hosting 배포 및 sotongware.com 연결
