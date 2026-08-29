# SotongWare Firebase Hosting 배포

SotongWare **공식 홈페이지 전용** Firebase 프로젝트입니다.  
`SotongWareControl` (`sotongware-control`)과 **완전히 분리**되어 있습니다.

## Firebase Project

| 항목 | 값 |
|------|-----|
| Display Name | SotongWare |
| Project ID | `sotongware` |
| Hosting URL | https://sotongware.web.app |
| Canonical Domain (목표) | https://sotongware.com |

## 배포 방식

- Next.js **static export** (`output: "export"`)
- 빌드 출력: `out/`
- Firebase Hosting `public`: `out`
- `cleanUrls: true` — `/services` → `services.html` 자동 매핑

## 로컬 빌드·배포

```bash
npm install
npm run lint
npm run build          # out/ 생성
npm run deploy:hosting # build + firebase deploy (project: sotongware)
```

수동 배포:

```bash
firebase deploy --only hosting --project sotongware
```

**절대 사용하지 말 것:** `--project sotongware-control`

## 문의 폼 (Firebase Functions)

문의 접수는 `submitContactInquiry` Callable Function + Firestore `contactInquiries` 컬렉션을 사용합니다.

**Blaze(종량제) 플랜 필요:** Cloud Functions 배포에는 Firebase Blaze 업그레이드가 필요합니다.

```bash
# Functions + Firestore rules + Hosting 일괄 배포
npm run deploy:all

# Functions만
npm run deploy:functions
```

로컬 빌드 전 `.env.local`에 Web SDK 설정 필요 (`.env.example` 참고).  
Firebase Console → Project settings → Your apps → **SotongWare Web** 에서 API Key 확인.

## sotongware.com Custom Domain 연결 (사용자 작업)

### 1. Firebase Console

1. [Firebase Console → sotongware → Hosting](https://console.firebase.google.com/project/sotongware/hosting)
2. **Add custom domain** 클릭
3. `sotongware.com` 입력 → Continue
4. Firebase가 표시하는 **DNS 레코드**를 복사 (프로젝트마다 TXT/A 값이 다를 수 있음)

### 2. Apex domain — `sotongware.com`

가비아(또는 현재 DNS 관리자) DNS 관리에서:

| Type | Host | Value | 비고 |
|------|------|-------|------|
| A | `@` (또는 비움) | Firebase Console에 표시된 IP | 보통 2개 A 레코드 |
| TXT | `@` | Firebase verification TXT | 도메인 소유 확인용 |

**기존 MX(메일), 다른 A/CNAME 레코드를 삭제하지 말 것.**  
이메일이 같은 도메인을 사용 중이면 MX 레코드는 유지.

### 3. www — `www.sotongware.com`

Firebase Console에서 `www.sotongware.com`도 추가한 뒤:

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `sotongware.web.app` (Console 표시값 사용) |

### 4. www → apex Redirect (권장)

Firebase Hosting Custom Domain 설정에서:

- **Canonical:** `sotongware.com` (apex)
- **Redirect:** `www.sotongware.com` → `sotongware.com` (Firebase Console 옵션)

권장 정책:

- Canonical: `https://sotongware.com`
- `https://www.sotongware.com` → `https://sotongware.com` (301)

### 5. HTTPS

DNS 전파 후 Firebase가 Let's Encrypt 인증서를 자동 발급합니다.  
상태가 **Connected** + **SSL active**인지 Console에서 확인.

### 6. DNS 전파 확인

```bash
nslookup sotongware.com
nslookup www.sotongware.com
```

전파는 수분~48시간 걸릴 수 있습니다.

## 배포 후 확인 체크리스트

- [ ] https://sotongware.web.app/
- [ ] /services, /works 및 상세 경로
- [ ] /robots.txt, /sitemap.xml
- [ ] 모바일 메뉴·Footer
- [ ] 직접 URL 접근 및 새로고침 (404 없음)

## 관련 저장소 (수정 금지)

- SotongWareControl → `sotongware-control` Firebase
- Sotong24Work
