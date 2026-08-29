# 검색엔진 등록 준비

공식 홈페이지의 기준 URL은 `https://sotongware.com`입니다.

## 소유권 확인 meta tag

검색 서비스에서 실제 인증 토큰을 발급받은 뒤 로컬 `.env.local`에 필요한 값만 추가하고 다시 빌드·배포합니다.

```dotenv
GOOGLE_SITE_VERIFICATION=Google에서_발급한_content_값
NAVER_SITE_VERIFICATION=네이버에서_발급한_content_값
```

- Google 값은 `<meta name="google-site-verification" ...>`로 생성됩니다.
- 네이버 값은 `<meta name="naver-site-verification" ...>`로 생성됩니다.
- 값이 비어 있거나 환경변수가 없으면 해당 meta tag를 생성하지 않습니다.
- Search Console의 도메인 속성을 DNS 방식으로 확인할 경우 Google meta tag는 필요하지 않습니다.

## Google Search Console

1. `sotongware.com` 도메인 속성 또는 `https://sotongware.com/` URL 접두어 속성을 추가합니다.
2. Google이 안내하는 DNS TXT 또는 HTML meta tag 방식으로 소유권을 확인합니다.
3. `https://sotongware.com/sitemap.xml`을 제출합니다.
4. URL 검사에서 홈페이지와 주요 페이지의 색인 생성을 요청합니다.

## 네이버 서치어드바이저

1. 사이트 관리에서 `https://sotongware.com`을 추가합니다.
2. HTML 태그 방식으로 확인할 경우 발급된 `content` 값만 `NAVER_SITE_VERIFICATION`에 넣고 다시 배포합니다.
3. 요청 > 사이트맵 제출에서 `https://sotongware.com/sitemap.xml`을 제출합니다.
4. 검증 > robots.txt에서 수집 가능 여부를 확인하고 주요 페이지 수집을 요청합니다.

## 배포 후 확인 URL

- `https://sotongware.com/`
- `https://sotongware.com/robots.txt`
- `https://sotongware.com/sitemap.xml`
