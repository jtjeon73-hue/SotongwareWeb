# ADR-001: SotongWare Commerce · Membership · Security · Monetization

| 항목 | 값 |
|------|-----|
| Status | **Accepted** |
| Date | 2026-09-11 |
| Project | SotongwareWeb (`sotongware.com` / Firebase `sotongware`) |
| Supersedes | — |
| Related | `docs/auth-membership-plan.md`, `docs/publication-gate-contract.md`, Commerce READ-ONLY Audit (2026-09-11) |

## Context

SotongWare 공식 홈페이지는 중앙 영업·회원·결제·수익화 허브로 확장할 예정이다.
READ-ONLY 감사 결과, Auth·회원 프로필·entitlement Rules 골격은 존재하나 **실제 결제·주문·webhook·보호 Storage·Basic 요금제·법무 문서는 미구현**이다.

본 ADR은 구현 전에 **시스템 경계, 회원·상품·결제·권한, 보안, 환불 초안, 단계별 구현 순서**를 확정한다.
코드·Rules·Functions·Firebase 데이터·배포는 변경하지 않는다.

### 감사와의 정합성

- 정적 Hosting (`next export` → Firebase Hosting) 유지 → 결제·권한 쓰기는 **Cloud Functions(+ Admin SDK)** 만 담당한다.
- 브라우저 `결제 성공`만으로 entitlement를 부여하는 경로는 **금지**한다 (현재 코드에도 해당 경로 없음).
- 기존 `users` / `users/{uid}/entitlements/{businessId}` / `memberContents` / `contactInquiries` 및 fail-closed Firestore Rules를 **확장 기반**으로 삼는다.
- Sotong24Work·SotongWareControl·`sotongware-control`은 본 ADR에서 **구현·배포 대상이 아니다**.

---

## Decision Drivers

1. 운영 주체: 개인사업자 **소통웨어** 통합 (휴업 중인 소통창고는 첫 출시 범위 제외).
2. 회원 등급: Guest / Free / Basic / Admin.
3. Basic 초기 가격: 월 **2,000원**, 연 **20,000원**.
4. 구독과 단건구매 병행.
5. Basic: 일부 콘텐츠 무료 + 나머지 할인 또는 회원 전용 혜택 (세부 범위는 후속 결정).
6. 초기 로그인: 이메일 + Google. 카카오·네이버는 후속.
7. 자체 웹 결제: **SotongWare 중앙 PG 한 곳** (업체는 본 ADR에서 미확정).
8. Android 앱 내부 디지털 상품: **Google Play Billing**.
9. 외부 전자책·콘텐츠 플랫폼: **각 플랫폼 결제**.
10. 외부 매출: 향후 **SotongWareControl** 통합 집계.
11. entitlement는 **서버 결제 검증 또는 검증된 webhook 이후**에만 활성화.
12. Sotong24Work는 상품 제작·사업화 패키지만; **결제 승인 권한 없음**.

---

## 1. System Responsibility Boundaries

| 시스템 | 책임 (DO) | 비책임 (DON'T) |
|--------|-----------|----------------|
| **SotongWare 홈페이지** | 공개 마케팅, 회원가입/로그인 UX, 상품·가격 표시, 결제 진입, 내 계정·구매내역·이용권한 표시, locale(KO/EN) | 결제 승인, entitlement 쓰기, PG secret 보관, webhook 수신 |
| **Firebase Authentication** | 신원(이메일/Google), 세션, 이메일 인증, 비밀번호 재설정 | 요금제·결제 상태 저장 |
| **Firestore** | users, products/prices(또는 동기화 메타), orders, payments, subscriptions, entitlements, contentAssets 메타, refunds, settlements, audit/security logs | 클라이언트에 의한 role/paid/plan/entitlement 변조 허용 |
| **Cloud Functions** | 주문 생성 보조, PG webhook, 서명·멱등 검증, entitlement 생성/갱신/회수, signed download URL, 감사 로그, contact 등 서버 전용 API | 브라우저 trust 기반 권한 부여 |
| **Cloud Storage** | 유료·회원 전용 파일 비공개 보관 | Hosting `public`/`out`에 유료 원본 배포 |
| **국내 중앙 PG** | 웹 결제·정기결제·환불 API | 사업부별 개별 PG 난립 (자체 웹 결제 기준) |
| **사업부 사이트** | 중앙 로그인 연동, entitlement 조회, 허용 콘텐츠만 제공 | 독자 결제 승인(중앙 웹 상품), entitlement 쓰기 |
| **Android 앱** | Play Billing 디지털 상품, 서버 영수증 검증 연동 | 웹 Basic을 Play 결제 없이 우회 부여 |
| **Sotong24Work** | 상품 파일·미리보기·가격 제안·설명·이미지·외부 등록정보·사업화 package | 결제 승인, live entitlement 부여 |
| **SotongWareControl** | 회원·매출·결제실패·환불·정산·보안·Firebase 비용 관제, 관리자 승인·조회 | 고객 결제의 **단일 실패점**이 되지 않음 (webhook은 Functions가 주경로) |
| **외부 판매 플랫폼** | 각 플랫폼 결제·정책 | SotongWare entitlement 자동 부여(별도 정산·수동/배치 연동 후) |

### Publication Gate (기존 유지)

공개 홈페이지에 노출되는 결과물은 `docs/publication-gate-contract.md`의 fail-closed 조건을 만족해야 한다.
**결제 가능 상품(판매 카탈로그)** 과 **마케팅 공개 결과물**은 별도 상태 필드로 관리할 수 있으나, 미승인 결과물을 외부에 노출하지 않는 원칙은 유지한다.

---

## 2. Membership & Authorization Model

### 2.1 Roles / Plans

| 등급 | 정의 | 비고 |
|------|------|------|
| **Guest** | 미로그인 | 공개 페이지만 |
| **Free** | 로그인 회원, Basic 미구독 | 회원 무료(accessLevel `member`) 콘텐츠 |
| **Basic** | 활성 월간 또는 연간 구독 | 포함 콘텐츠 + 할인/회원 혜택 (세부 TBD) |
| **Admin** | Firebase Custom Claims `role: admin` | Firestore Rules `isAdmin()`, Control 연동 |

기존 구현의 `UserProfile.role: member | admin` 및 entitlement `plan: free | member | premium`은 **마이그레이션 대상**이다.

권장 매핑 (구현 시):

| 기존 | 목표 |
|------|------|
| 비로그인 | Guest |
| `users.role=member` + Basic 구독 없음 | Free |
| 활성 Basic subscription / Basic entitlement | Basic |
| Custom Claims `role=admin` | Admin |
| 기존 `entitlements.plan=premium` (사업부별) | 단건·사업부 Premium 권한으로 재정의 가능 (Basic과 병행) |

### 2.2 Auth Lifecycle

| 기능 | 방침 |
|------|------|
| 가입 | 이메일/비밀번호 또는 Google |
| 로그인 | 동일 |
| 이메일 인증 | 권장; 유료 결제·민감 다운로드 전 강제 여부는 구현 단계에서 확정 |
| 비밀번호 재설정 | Firebase Auth |
| 회원 탈퇴 | 구현 필수 (계정 삭제 + 개인정보 최소 보존·삭제 정책). **미구현 → 구현 계획에 포함** |
| 세션 | Firebase Auth 클라이언트 세션; 라우트 `AuthGuard`는 UX용, **데이터 보호는 Rules/Functions** |

### 2.3 Account States

| 상태 | 의미 |
|------|------|
| `active` | 정상 |
| `suspended` | 운영 정지 (로그인 후 유료 기능 차단) |
| Basic `active` | 구독 기간 내 |
| Basic `past_due` | 정기결제 실패 유예 |
| Basic `cancelled` | 해지 예약 또는 즉시 해지(정책에 따름); 기간 종료 시 만료 |
| Basic `expired` | 기간 종료, Free로 강등 |
| `refunded` | 관련 주문/구독 환불 반영 후 entitlement 회수 |


### 2.5 State Transitions (회원·구독)

| From | Event | To | Entitlement 영향 |
|------|-------|-----|------------------|
| Guest | 가입(이메일/Google) 성공 | Free (`active`) | 없음 (member 무료만 콘텐츠 정책) |
| Free | Basic 결제 webhook 검증 | Basic (`active`) | Basic entitlement 생성/갱신 |
| Basic `active` | 정기결제 실패(유예 진입) | Basic `past_due` | 유예 중 유지 또는 제한(PG·운영 정책) |
| Basic `past_due` | 재결제 성공 | Basic `active` | 유지/연장 |
| Basic `past_due` | 재시도 소진·실패 확정 | Basic `expired` → Free | Basic entitlement 만료/회수 |
| Basic `active` | 해지 요청 (`cancelAtPeriodEnd`) | Basic `cancelled` (기간 잔여) | 기간 종료 전까지 유지(초안) |
| Basic `cancelled` | `currentPeriodEnd` 도달 | Free | Basic entitlement 만료 |
| * | 주문/구독 환불 확정 | 관련 `refunded` | 해당 entitlement revoke |
| `active` | Admin 정지 | `suspended` | 유료 기능 차단; entitlement 기록 보존·접근 거부 |
| `suspended` | Admin 해제 | `active` (구독 유효 시 Basic 복귀) | 정책에 따라 재활성화 |
| Free/Basic | 회원 탈퇴 완료 | (계정 삭제/익명화) | entitlement·개인정보 삭제 또는 법정 최소 보존 |

### 2.4 Client Write Ban (필수)

클라이언트는 다음을 **직접 변경할 수 없다**.

- `role`, `status`(정지), `uid`
- `paid`, `plan`, Basic 여부
- `entitlements/*` 생성·수정·삭제
- 주문 `paid` 확정, 결제 성공 플래그

작성 주체:

- 프로필 최초 생성·표시명 등 허용 필드: 본인 (Rules로 키 제한)
- Admin Claims: **Admin SDK / 운영 절차만**
- entitlement / orders.paid / refunds: **Cloud Functions만** (또는 Admin SDK 운영 도구)

---

## 3. Product & Sales Model

### 3.1 Offer Types

| 유형 | 설명 | 결제 채널 |
|------|------|-----------|
| 무료 콘텐츠 | Guest 또는 Free 열람 | — |
| Basic 포함 콘텐츠 | 활성 Basic만 | 중앙 PG (구독) |
| Basic 할인 콘텐츠 | Basic 가격표 할인 | 중앙 PG (단건) |
| 전자책 단건 | 영구(또는 라이선스 기간) 접근 | 중앙 PG 또는 외부 플랫폼 |
| 유료 사이트 접근권 | 기간/영구 | 중앙 PG |
| 앱 Premium | 인앱 디지털 | **Play Billing** |
| 콘텐츠 단건 | 영상·음원 등 | 중앙 PG 또는 외부 |
| 외부 플랫폼 판매 | 스토어·전자책몰 등 | 외부 PG; Control 집계 |

### 3.2 Subscription vs One-time (충돌 방지 규칙)

1. **Basic 구독**은 “멤버십 플랜” entitlement (`plan=basic`, `period=month|year`) 로 표현한다.
2. **단건구매**는 상품 단위 entitlement (`productId` 또는 `sku`, `source=one_time`) 로 표현한다.
3. Basic이 이미 **포함(free with Basic)** 인 SKU는 단건 결제를 제안하지 않거나, 결제 시 “이미 포함”으로 차단한다.
4. Basic **할인** SKU는 단건 결제 시 가격 티어만 다르며, 구매 후 단건 entitlement가 발급된다. 구독 해지 후에도 **단건 entitlement는 유지**한다 (라이선스에 명시).
5. 동일 `userId + sku` 활성 entitlement가 있으면 **중복구매 차단** (또는 갱신 정책 — 구현 시 상품 메타로 지정).
6. Play Billing 앱 Premium과 웹 Basic은 **별 SKU**로 시작한다. 결합(번들)은 후속 결정.
7. 외부 플랫폼 구매는 기본 **자동 entitlement 미부여**; Control/배치 연동 후에만 반영.

### 3.3 Pricing Baseline (초기)

| Plan | Price (KRW) | Note |
|------|-------------|------|
| Basic monthly | 2,000 | 부가세·PG 수수료 표기는 법무·세무 검토 후 |
| Basic yearly | 20,000 | 월 환산 약 1,667원 |

할인율·Basic 무료 콘텐츠 목록은 **미결정 (섹션 9)**.

---

## 4. Payment Flows

### 4.1 Happy Path (Web Central PG)

```text
고객 로그인 (Free 이상)
→ Basic 또는 단건 SKU 선택
→ Functions: order 생성 (status=pending, amount, currency, sku, userId)
→ PG Checkout 세션 생성 (서버)
→ 고객 결제
→ PG → Functions webhook (서명 검증)
→ payments 기록 + idempotency key 처리
→ order status=paid
→ entitlement 생성/갱신 (트랜잭션)
→ auditLogs 기록
→ 클라이언트는 order/entitlement 조회로 UI 갱신
```

**금지**: 클라이언트가 `paymentSuccess=true`를 보내 entitlement API를 호출하는 경로.

### 4.2 Exception Flows

| 예외 | 처리 |
|------|------|
| 결제 취소 (사용자) | order=`cancelled`; entitlement 없음 |
| 결제 실패 | order=`failed`; payment 실패 사유 기록; 재시도 가능 |
| webhook 중복 | idempotency key / provider payment id로 **한 번만** paid·entitlement 적용 |
| webhook 지연 | order는 pending 유지; 클라이언트의 “성공 화면”만으로는 권한 미부여; 폴링/재조회 |
| 정기결제 실패 | subscription=`past_due`; 유예 기간·재시도(PG 정책); 실패 확정 시 Basic 만료·강등 |
| 구독 해지 | subscription=`cancelled`; 기간 만료 시점까지 Basic 유지 여부 = 운영 초안(섹션 7) |
| 환불 | refunds 문서 + order=`refunded` + entitlement revoke/expire + audit |
| 중복구매 | 주문 생성 단계에서 거부 |
| paid 확정 후 entitlement 실패 | **재처리 큐/알람**; order에 `entitlementStatus=pending_retry`; 수동·자동 재시도; 고객 지원 티켓 |
| Play Billing | 앱 → 서버 영수증 검증 Functions → 별도 entitlement (`source=play`) |
| 외부 플랫폼 | 기본 미연동; Control 집계만 또는 배치 매핑 |

### 4.3 Reprocessing & Audit

- 모든 webhook·권한 부여·환불·해지는 `auditLogs`에 actor(system/admin), orderId, paymentId, before/after 기록.
- 재처리는 동일 idempotency key로 **안전한 재실행**이어야 한다.
- SotongWareControl은 실패·지연·재처리 대상을 **조회·승인**할 수 있으나, webhook 수신의 주경로는 Functions이다.

---

## 5. Recommended Data Model (13)

구현 코드 없음. 아래 13개 모델 각각에 **목적·주요 필드·작성 주체·읽기 권한·연결·보존 원칙**을 정의한다.

### `users/{uid}`

- **목적**: 프로필·계정 상태
- **주요 필드**: uid, email, displayName, status, emailVerified, createdAt, lastLoginAt
- **작성**: client create(제한) / Functions·Admin(정지 등)
- **읽기**: owner, admin
- **연결**: orders, subscriptions, entitlements, refunds, downloadGrants
- **보존**: 탈퇴 시 삭제 또는 익명화; 세무·분쟁용 최소 식별자는 법정 기간 보존(법무 확정)

### `products/{productId}`

- **목적**: 판매·접근 대상 정의 (웹 카탈로그와 동기화 가능)
- **주요 필드**: type, skus[], accessPolicy (free|basic_included|basic_discount|one_time|external), publication/commerce flags
- **작성**: admin / Control sync / (메타는 24Work 제안 → 승인 후)
- **읽기**: public metadata; 민감 필드 admin
- **연결**: prices, contentAssets, orders, Publication Gate
- **보존**: soft-delete 권장; 판매 이력 참조용 장기 보존

### `prices/{priceId}`

- **목적**: 금액·통화·과금 주기
- **주요 필드**: productId/sku, amount, currency, interval(null|month|year), channel(web|play|external)
- **작성**: admin
- **읽기**: public (판매가)
- **연결**: products, orders, subscriptions
- **보존**: 가격 변경 시 신규 priceId·구버전 보관(감사)

### `orders/{orderId}`

- **목적**: 구매 의도·확정
- **주요 필드**: userId, sku, amount, currency, status(pending|paid|failed|cancelled|refunded), provider, entitlementStatus
- **작성**: Functions
- **읽기**: owner, admin
- **연결**: users, payments, entitlements, refunds, products/prices
- **보존**: 세무·소비자 분쟁 대응 기간 장기 보존

### `payments/{paymentId}`

- **목적**: PG 시도·결과
- **주요 필드**: orderId, provider, providerPaymentId, status, rawRef(비밀 제외), idempotencyKey
- **작성**: Functions
- **읽기**: owner(요약), admin
- **연결**: orders, refunds, auditLogs
- **보존**: 결제 증빙 장기 보존; PG raw는 최소·비밀 제외

### `subscriptions/{subscriptionId}`

- **목적**: Basic 월/연 등 정기
- **주요 필드**: userId, plan=basic, interval, status, currentPeriodEnd, cancelAtPeriodEnd
- **작성**: Functions
- **읽기**: owner, admin
- **연결**: users, entitlements(Basic), renewing payments/orders
- **보존**: 해지·만료 후에도 이력 보존

### `users/{uid}/entitlements/{entitlementId}`

- **목적**: 접근 권한의 SSOT
- **주요 필드**: type(basic|product|business_premium), sku/productId/businessId, status, source(web_pg|play|admin|external_batch), grantedAt, expiresAt, orderId
- **작성**: **Functions only**
- **읽기**: owner, admin
- **연결**: orders, subscriptions, products/sku, downloadGrants
- **보존**: 만료·회수 후에도 이력 보존(status=revoked|expired)
- **비고**: 기존 `businessId` 문서 ID 체계는 Basic·단건을 위해 entitlementId/sku 체계로 **확장·마이그레이션**

### `contentAssets/{assetId}`

- **목적**: 보호 파일 메타 (Storage path, checksum, content-type)
- **주요 필드**: storagePath, checksum, contentType, productId, visibility=private
- **작성**: admin
- **읽기**: admin; 클라이언트는 메타 요약만 또는 Functions 경유
- **연결**: products, downloadGrants, Cloud Storage object
- **보존**: 콘텐츠 수명과 동일; 삭제 시 Storage·메타 동기 정리

### `downloadGrants/{grantId}`

- **목적**: 단기 signed URL 발급 기록
- **주요 필드**: userId, assetId, expiresAt, issuedAt
- **작성**: Functions
- **읽기**: owner(제한), admin
- **연결**: users, contentAssets, entitlements
- **보존**: 단기(예: 90일) 후 삭제 또는 집계만 남김

### `refunds/{refundId}`

- **목적**: 환불 요청·결과
- **주요 필드**: orderId, paymentId, amount, reason, status, processedAt
- **작성**: Functions / admin 승인 후 Functions
- **읽기**: owner, admin
- **연결**: orders, payments, entitlements, auditLogs
- **보존**: 세무·분쟁 대응 장기 보존

### `settlements/{settlementId}`

- **목적**: 정산·외부 매출 스냅샷 (Control)
- **주요 필드**: period, channel, amount, currency, sourceRefs[]
- **작성**: batch/Functions
- **읽기**: admin only
- **연결**: payments, external platform imports, Control
- **보존**: 회계·세무 기간에 맞춤 장기 보존

### `auditLogs/{logId}`

- **목적**: 권한·결제·환불·관리자 행위
- **주요 필드**: actor, action, entityRefs, before, after, at
- **작성**: Functions
- **읽기**: admin
- **연결**: orders, payments, entitlements, refunds, admin actions
- **보존**: 장기(보안·감사 정책 확정)

### `securityEvents/{eventId}`

- **목적**: 이상 로그인, webhook 실패, App Check 거부 등
- **주요 필드**: type, severity, uid?, ipHash?, detail, at
- **작성**: Functions
- **읽기**: admin
- **연결**: Auth, App Check, webhook failures, Control alerts
- **보존**: 중기~장기(위협 분석); 민감 식별자 최소화

---

## 6. Security Principles

1. **최소 권한**: Rules fail-closed; 컬렉션별 명시적 allow만.
2. **서버 전용 결제 검증**: PG secret·webhook secret은 Functions 환경만.
3. **webhook 서명 검증**: 미검증 payload 폐기.
4. **멱등성**: provider payment id / idempotency key.
5. **App Check**: Auth·Callable·webhook 보조(가능 범위)에 단계적 적용.
6. **Admin Custom Claims**: 이메일 문자열 비교로 관리자 판별 금지.
7. **유료 파일**: 비공개 Storage; Hosting/public/`out` 금지.
8. **다운로드**: 짧은 TTL signed URL + `downloadGrants`.
9. **비밀키**: 클라이언트 번들·Git에 금지; `.env` 값은 문서화하지 않음.
10. **개인정보 최소수집**: 초기 email, displayName, uid; 결제 시 PG가 처리하는 범위 최소화.
11. **개인정보 접근 로그**: admin 조회는 audit.
12. **Rate limiting**: contact·signup·checkout 생성.
13. **감사 로그**: 섹션 4.3.
14. **백업·복구**: Firestore/Storage 백업 주기·복구 드릴 (운영 단계).
15. **Firebase 비용 알림**: 예산 알림 설정 (Console).
16. **환경 분리**: emulator/dev 프로젝트 vs `sotongware` production; Control은 `sotongware-control`과 **혼용 금지**.

---

## 7. Refund & Cancellation Draft (운영 초안)

> **주의**: 법률 확정문·약관 대체가 아니다. 게시 전 **법률·PG 약관·디지털콘텐츠 소비자보호** 검토 필수.

| 상황 | 초안 방침 |
|------|-----------|
| 디지털 단건, 다운로드·열람 **전** | 전액 환불 검토 가능 |
| 디지털 단건, 다운로드·열람 **후** | 원칙적 환불 제한 (장애·중대 하자 예외) |
| 월간 구독 | 해지 시 남은 기간 이용; 즉시 환불은 제한적 |
| 연간 구독 | 해지 시 기간 만료까지 이용 또는 일할 정책(후속 확정) |
| 자동갱신 해지 | 다음 결제일 전 해지 시 갱신 중지 |
| 중복결제 | 전액 환불·주문 정리 |
| 서비스 장애 | 보상·연장·환불 중 운영 선택 |
| 외부 플랫폼 결제 | **해당 플랫폼 환불 정책** 우선; SotongWare가 대리 환불하지 않음 |
| Play Billing | Google Play 환불·정책 우선; 서버 entitlement 동기 회수 |

---

## 8. Phased Implementation Plan

| # | 단계 | 작업 프로젝트 | 선행조건 | 완료조건 | 테스트 | 배포 | 중단 조건 |
|---|------|---------------|----------|----------|--------|------|-----------|
| 1 | **ADR 확정** (본 문서) | Docs (SotongwareWeb) | READ-ONLY 감사 완료 | 이해관계자 Accept·본 문서 커밋 | 문서 리뷰 | 문서만 | 사업 원칙 번복 |
| 2 | Auth·users 정리 (등급 매핑·탈퇴) | SotongwareWeb + Firestore Rules | 단계 1 Accept | Guest/Free/Admin 경로·탈퇴 플로우 명세·구현 | Auth E2E, Rules | Hosting + Rules | Admin Claims 운영 절차 부재 |
| 3 | 상품·가격 모델 | SotongwareWeb + Firestore | 단계 2 | products/prices 스키마·Basic 2,000/20,000 등록 | 단가 표시 QA | Firestore/Hosting | 가격 미승인 |
| 4 | 주문 기반 | Cloud Functions (`sotongware`) | 단계 3 | pending order 생성 API | 단위·Rules | Functions | 스키마 미고정 |
| 5 | PG sandbox + webhook | Cloud Functions | 단계 4 + PG 선정 | 서명·멱등·paid 확정 | sandbox E2E | Functions | PG 미선정·sandbox 실패 |
| 6 | entitlement + Rules 강화 | Functions + Rules | 단계 5 | paid→권한; 클라 write 불가 | Rules unit + E2E | Rules/Functions | 클라 권한 부여 경로 발견 |
| 7 | 보호 Storage·다운로드 | Firebase Storage + Functions | 단계 6 | signed URL only | 부정 접근 테스트 | Storage+Fn | 유료 파일 공개 배포 발견 |
| 8 | Free/Basic·내 계정 UI | SotongwareWeb | 단계 6 | 요금제·구매내역·권한 표시 | KO/EN QA | Hosting | |
| 9 | 샘플 상품 연결 | Sotong24Work→Web | 단계 7–8 + Publication Gate | Gate+결제 통과 샘플 | Gate·구매 E2E | Hosting | 미승인 공개 |
| 10 | Control 관제 | SotongWareControl | 단계 5–6 데이터 | 매출·실패·환불 조회 | 권한 분리 | Control만 | Control이 webhook SPOF가 됨 |
| 11 | 비용·부하·복구 검증 | 전체 (`sotongware`) | 단계 6–10 | 예산·백업 드릴 리포트 | load/cost | 모니터링 | 비용 폭주 |
| 12 | 운영 출시 | Web + Functions | 단계 11 + 법무 문서 | 약관·환불·사업자 고지 게시 | smoke | Hosting+Fn | 법무 미비 |

**한 번에 전체 구현하지 않는다.** 각 단계 완료·검증 후 다음 단계.

---

## 9. Confirmed Decisions (확정 사항)

1. 운영 주체는 개인사업자 **소통웨어**로 통합한다 (휴업 소통창고는 첫 출시 제외).
2. 회원 등급은 **Guest / Free / Basic / Admin** 이다.
3. Basic 초기 가격은 월 **2,000원**, 연 **20,000원** 이다.
4. 구독과 단건구매를 **병행**한다 (섹션 3.2 충돌 규칙 적용).
5. Basic은 일부 콘텐츠 무료 + 나머지 할인/회원 혜택 (세부 범위는 미결정).
6. 초기 로그인은 **이메일 + Google**; 카카오·네이버는 후속.
7. 자체 웹 결제는 **SotongWare 중앙 PG 한 곳** (업체 미선정).
8. Android 앱 내부 디지털 상품은 **Google Play Billing**.
9. 외부 전자책·콘텐츠 플랫폼은 **각 플랫폼 결제**.
10. 외부 매출은 향후 **SotongWareControl**에서 통합 집계.
11. 브라우저 결제 성공 화면만으로 유료권한을 부여하지 **않는다**.
12. **서버 결제 검증 또는 검증된 webhook 이후**에만 entitlement 활성화.
13. Sotong24Work는 제작·사업화 패키지만; **결제 승인 권한 없음**.
14. 정적 Hosting 유지; webhook·권한 쓰기는 **Cloud Functions + Admin SDK**.
15. 유료 원본은 **비공개 Storage**; Hosting `public`/`out` 배포 금지.
16. 본 ADR 단계의 구현·배포 대상은 문서뿐이며, Auth/users 다음 단계는 별도 지시 후 시작한다.
17. Firebase 프로젝트는 **`sotongware`만**; `sotongware-control`과 혼용 금지.

---

## 10. Deferred Decisions (미결정 사항)

| 항목 | 이유 |
|------|------|
| 최종 PG 업체 | sandbox 착수 직전 선정 |
| Basic 무료 콘텐츠 범위 | 콘텐츠 준비도에 의존 |
| Basic 할인율 | 가격 실험 |
| 환불 세부 기간(일수) | 법률·약관 |
| 카카오·네이버 로그인 시기 | 우선순위 |
| 앱 Premium ↔ 웹 Basic 결합 | 제품 전략 |
| 전자책 첫 판매상품 | Publication Gate·재고 |
| 외부 플랫폼 정산 연동 방식 | Control 로드맵 |
| 이메일 인증 강제 시점 | UX vs 보안 |
| 부가세 표시·세금계산서 | 세무 |

---

## 11. Consequences

### Positive

- 중앙 웹 결제·권한의 단일 검증 경로로 보안 사고면 감소.
- 기존 Auth·Rules·문의 Functions와 충돌 없이 확장 가능.
- 24Work / Control / Play / 외부몰 책임이 분리되어 장애 격리.

### Negative / Trade-offs

- 정적 Hosting으로 Next API Route webhook 불가 → Functions 운영 필수.
- entitlement 스키마 확장·마이그레이션 비용.
- PG 미선정 상태에서 단계 5 이전 차단.
- 약관·환불·사업자 고지 없이는 운영 출시(단계 12) 불가.

### Compliance with Audit

| 감사 결과 | ADR |
|-----------|-----|
| READY FOR DESIGN | Accepted ADR로 설계 게이트 통과 |
| 결제 MISSING | 단계 4–5에서 해소 |
| entitlement PARTIAL | 단계 6에서 서버 부여 완성 |
| 약관 PLACEHOLDER | 단계 12 전 필수 |

---

## 12. References

- `docs/auth-membership-plan.md` — 1단계 Auth·Rules 기반
- `docs/publication-gate-contract.md` — 공개 결과물 Gate
- Commerce & Membership READ-ONLY Architecture Audit — 2026-09-11
- Repo: SotongwareWeb, Firebase project `sotongware` only

---

## Document Control

| Version | Date | Note |
|---------|------|------|
| 1.0 | 2026-09-11 | Initial Accepted ADR |
