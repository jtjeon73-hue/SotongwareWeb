# SotongWare 인증·회원·권한 설계

> 프로젝트: `sotongware` (절대 `sotongware-control` 사용 금지)
> 최종 업데이트: 2026-08-31
> 단계: 1단계 — 인증·권한·데이터 기반 (결제 미구현)

---

## 1. 접근 정책

| 등급 | 설명 | 비로그인 | 로그인 회원 | 프리미엄 entitlement |
|------|------|----------|-------------|----------------------|
| **public** | 공개 마케팅·소개 | ✅ | ✅ | ✅ |
| **member** | 회원 무료 콘텐츠 | 미리보기만 | ✅ | ✅ |
| **premium** | 유료·프리미엄 | 미리보기만 | 잠금 | ✅ (활성 entitlement) |

- 공개 홈페이지·사업 소개 페이지는 **로그인 없이 항상 접근 가능**
- 회원 콘텐츠 **원문(body)** 은 Firestore `memberContents`에만 저장
- 정적 export 번들(`out/`)에는 프리미엄 원문을 포함하지 않음
- 가격·결제 상태·가짜 실적은 생성하지 않음

---

## 2. 사용자 흐름

```
[비방문자]
  → 공개 홈 / 사업 소개 / SEO 페이지
  → 사업 카드에서 접근 등급 확인
  → "무료 회원으로 보기" CTA
  → /signup

[회원가입]
  → 이메일·비밀번호 또는 Google
  → users/{uid} 프로필 생성
  → 이메일 인증 안내 (선택)
  → /dashboard

[로그인]
  → /login?redirect=/dashboard
  → 인증 후 redirect 또는 /dashboard

[대시보드]
  → 이용 가능 사업 목록
  → 회원 무료 콘텐츠 (Firestore에서 권한 확인 후 로드)
  → 프리미엄 잠금 UI (entitlement 없으면 원문 미로드)

[계정]
  → /account — 프로필, 이메일 인증, 로그아웃
```

---

## 3. 라우트 구조

| 경로 | 접근 | SEO | 설명 |
|------|------|-----|------|
| `/` ~ `/guide` 등 | 공개 | index | 기존 마케팅 페이지 유지 |
| `/login` | 공개 | **noindex** | 로그인 |
| `/signup` | 공개 | **noindex** | 회원가입 |
| `/forgot-password` | 공개 | **noindex** | 비밀번호 재설정 |
| `/dashboard` | 회원 | **noindex** | 회원 대시보드 |
| `/account` | 회원 | **noindex** | 계정 설정 |

**보호 방식**
- `AuthGuard` (클라이언트): UX용 화면 전환, `/login?redirect=` 리다이렉트
- Firestore Security Rules: 실제 데이터 보호

---

## 4. Firestore 데이터 모델

### `users/{uid}`

| 필드 | 타입 | 설명 |
|------|------|------|
| uid | string | Firebase Auth UID |
| email | string | 이메일 |
| displayName | string | 표시명 |
| role | `member` \| `admin` | 역할 (admin은 Custom Claims 연동) |
| status | `active` \| `suspended` | 계정 상태 |
| emailVerified | boolean | 이메일 인증 |
| createdAt | timestamp | 가입일 |
| lastLoginAt | timestamp | 마지막 로그인 |

- 회원 본인: create(최초 1회), read, 제한된 update
- `role`, `status`, `uid`는 클라이언트에서 변경 불가

### `users/{uid}/entitlements/{businessId}`

| 필드 | 타입 | 설명 |
|------|------|------|
| businessId | string | 사업 ID (automation, app, …) |
| plan | `free` \| `member` \| `premium` | 플랜 |
| status | `active` \| `expired` \| `revoked` | 상태 |
| grantedAt | timestamp | 부여일 |
| expiresAt | timestamp? | 만료 (null = 무기한) |

- **클라이언트 write 금지** — 관리자 Custom Claims 또는 Cloud Functions에서만 부여

### `memberContents/{contentId}`

| 필드 | 타입 | 설명 |
|------|------|------|
| businessId | string | 소속 사업 |
| title | string | 제목 |
| summary | string | 요약 |
| body | string | **원문 (Rules로 보호)** |
| accessLevel | `public` \| `member` \| `premium` | 접근 등급 |
| publicationStatus | `draft` \| `published` \| `comingSoon` | 공개 상태 |
| updatedAt | timestamp | 수정일 |

### 정적 카탈로그 (미리보기만)

- `src/data/member-content-catalog.ts` — teaser만 포함, body 없음
- `src/data/business-access.ts` — 사업별 portal 접근 정책

---

## 5. 보안 경계

```
[브라우저 — 정적 HTML/JS]
  ├── 공개 마케팅 콘텐츠 (SEO 유지)
  ├── AuthGuard (UX만, 우회 가능)
  └── Firebase Auth ID Token

[Firestore Rules]
  ├── users: 본인 read/update (role/status 보호)
  ├── entitlements: 본인 read, admin write
  └── memberContents: accessLevel + entitlement 검증 후 read

[Cloud Functions — 향후]
  ├── 결제 webhook → entitlement 부여
  ├── Custom Claims (admin)
  └── contactInquiries (기존)
```

**절대 하지 말 것**
- Middleware/AuthGuard만으로 유료 콘텐츠 보호 (static export 한계)
- JS 번들에 premium body 포함
- 클라이언트에서 entitlement self-grant

---

## 6. 별도 사업 사이트와 인증 공유

각 전문 사이트(`*.web.app`, 향후 `*.sotongware.com`)는 **링크 숨김만으로 보호 불가**.

### 권장 확장 설계

1. **공통 Firebase 프로젝트 `sotongware` Auth 사용**
   - 동일 Web API Key / Auth Domain
   - 각 사이트에서 Firebase Auth SDK로 로그인

2. **ID Token 검증 (사이트별 구현 필수)**
   - 클라이언트: `user.getIdToken()` → API/Functions에 전달
   - 서버/Functions: `admin.auth().verifyIdToken(token)`
   - Firestore Rules: 동일 `request.auth.uid`로 entitlement 확인

3. **사이트별 보호 콘텐츠**
   - 회원 전용 API/Functions 엔드포인트에서 token + entitlement 검증
   - 정적 promo 사이트에 회원 원문을 embed하지 않음

4. **중앙 Hub 역할**
   - `www.sotongware.com` = Business Gateway + 회원 포털 진입점
   - 전문 사이트 = 서비스·콘텐츠 채널 (각자 token 검증)

### UI 정책 (1단계)

- `canExposeExternalSiteLink()` — **public** 사업만 외부 사이트 직접 링크 노출
- **member / premium** 사업(지식·교육, 콘텐츠)은 공유 인증 연동 전까지 외부 URL 버튼 숨김
- 대시보드·푸터·Mega Menu·Contact 안내에 보안 고지 문구 표시
- 전문 사이트 링크는 **대상 사이트 접근을 보호하지 않음** — 링크 제공 ≠ 권한 검증

### redirect 보안

- `sanitizeRedirectPath()` (`src/lib/safe-redirect.ts`)
- `/`로 시작하는 내부 경로만 허용, `//`·프로토콜·`javascript:`·역슬래시·외부 URL 거부
- 유효하지 않으면 `/dashboard` 사용

### Firestore Rules 핵심 (memberContents)

- `publicationStatus == 'published'`만 읽기 허용
- `users/{uid}.status == 'active'`인 사용자만 member/premium 읽기
- premium: `entitlement.status == 'active'` **AND** `entitlement.plan == 'premium'`
- `entitlement.businessId` == 문서 ID(`businessId`) 일치 필수
- `expiresAt` 만료 검사 유지

Rules 테스트: `npm run test:firestore:rules`

---

## 7. 향후 결제 연동 지점

| 단계 | 작업 | 위치 |
|------|------|------|
| 2단계 | Toss / Stripe Checkout | Cloud Functions |
| 2단계 | `orders/{orderId}` 컬렉션 | Firestore |
| 2단계 | webhook → entitlement 활성화 | Functions |
| 3단계 | 구독 갱신/만료 | Functions scheduled |
| 3단계 | 대시보드 결제 내역 | `/account` 확장 |

기존 타입: `src/types/payment.ts` (`Order`, `Subscription`, `AccessGrant`)

---

## 8. 향후 운영 구조 (관리자)

1. **Custom Claims `role: admin`**
   - Firebase Admin SDK로 부여
   - Firestore Rules `isAdmin()` 연동

2. **관리자 CMS (미구현)**
   - 사업별 `accessLevel` / `publicationStatus` 등록
   - `memberContents` CRUD
   - entitlement 수동 부여 (환불·이벤트)

3. **Sotong24Work 자동등록**
   - 상품 등록 시 `accessMode` + `commerceChannels` 동기화
   - 공개 카탈로그 vs 회원 원문 분리 유지

---

## 9. Firebase Console 설정 (사용자 작업)

### Authentication

1. Firebase Console → `sotongware` → **Authentication** → Sign-in method
2. **이메일/비밀번호** 활성화
3. **Google** 활성화 (OAuth 클라이언트 ID 자동 생성)
4. Authorized domains에 추가:
   - `sotongware.com`
   - `www.sotongware.com`
   - `sotongware.web.app`
   - `localhost` (개발)

### Firestore

1. **Firestore Database** 생성 (없는 경우)
2. Rules 배포: `firebase deploy --only firestore:rules --project sotongware`
3. (선택) 초기 `memberContents` 문서 수동 등록

### 환경 변수 (`.env.local`)

기존 `.env.example` 값 사용 — **임의 값 금지**

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sotongware.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sotongware
```

### 로컬 테스트

```bash
# 에뮬레이터 (선택)
NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true
firebase emulators:start --only auth,firestore,functions
```

### 배포 순서

1. Firebase Console에서 Auth 활성화
2. Firestore Rules 배포
3. `npm run lint && npm run build`
4. Auth E2E 수동 테스트 (signup/login/logout/dashboard)
5. `firebase deploy --only hosting --project sotongware`

---

## 10. 코드 구조

```
src/
├── contexts/AuthProvider.tsx    # Auth 상태·메서드
├── components/auth/             # AuthGuard, AuthNav, 폼 UI
├── components/membership/       # AccessBadge, BusinessPortalCta
├── lib/
│   ├── firebase.ts              # Auth + Firestore 싱글톤
│   ├── auth-errors.ts           # 한국어 오류 메시지
│   ├── user-profile.ts          # users 컬렉션 CRUD
│   └── entitlements.ts          # 권한 검사
├── types/membership.ts
├── data/business-access.ts
├── data/member-content-catalog.ts
└── app/
    ├── login/
    ├── signup/
    ├── forgot-password/
    ├── dashboard/
    └── account/
```

---

## 11. 1단계 완료 기준 체크리스트

- [x] 공개 페이지·SEO 유지 (sitemap/robots/canonical/OG 변경 없음)
- [x] 회원가입·로그인·로그아웃·비밀번호 재설정 UI
- [x] `/dashboard` 비로그인 → `/login` 리다이렉트
- [x] 로그인 후 redirect 또는 dashboard
- [x] 회원 전용 UI (대시보드·계정)
- [x] 프리미엄 원문 — Firestore Rules + 동적 로드
- [x] Firestore Rules 초안
- [x] 확장 설계 문서 (본 문서)
- [ ] Firebase Console Auth 활성화 (사용자)
- [ ] Rules 배포 (사용자)
- [ ] Production Hosting 배포 (Auth 테스트 후)
