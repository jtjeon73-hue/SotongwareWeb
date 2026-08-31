export const commonProcessSteps = [
  { step: "01", title: "요구 이해", description: "고객의 목적, 현장·서비스 상황, 제약을 파악합니다." },
  { step: "02", title: "기획", description: "범위, 우선순위, 일정, 산출물을 정리합니다." },
  { step: "03", title: "설계", description: "구조, 화면, 기술·콘텐츠 구성을 설계합니다." },
  { step: "04", title: "제작", description: "소프트웨어·콘텐츠·자료를 실제로 제작합니다." },
  { step: "05", title: "검증", description: "요구사항과 품질 기준에 맞는지 확인합니다." },
  { step: "06", title: "보완", description: "검증 결과를 반영해 수정·개선합니다." },
  { step: "07", title: "최종 확인", description: "고객과 함께 최종 결과를 확인합니다." },
  { step: "08", title: "배포·운영", description: "배포·공개 후 운영·업데이트를 이어갑니다." },
] as const;

export interface BusinessProcess {
  id: string;
  titleKo: string;
  steps: string[];
}

export const businessProcesses: BusinessProcess[] = [
  {
    id: "automation",
    titleKo: "산업자동화",
    steps: [
      "현장 요구 파악",
      "설비/PLC/통신 분석",
      "시스템 설계",
      "프로그램 개발",
      "현장 테스트",
      "안정화",
      "운영/유지보수",
    ],
  },
  {
    id: "app",
    titleKo: "앱개발",
    steps: [
      "아이디어",
      "기능 정의",
      "UI/UX",
      "개발",
      "테스트",
      "사용자 검증",
      "Store 출시 준비",
      "배포/업데이트",
    ],
  },
  {
    id: "ebook",
    titleKo: "전자책",
    steps: [
      "주제 기획",
      "독자 정의",
      "목차",
      "원고 제작",
      "편집",
      "검수",
      "표지/파일",
      "판매 플랫폼 등록",
    ],
  },
  {
    id: "knowledge",
    titleKo: "지식·교육",
    steps: [
      "주제 선정",
      "자료 조사",
      "콘텐츠 제작",
      "검수",
      "무료/회원/유료 분류",
      "공개",
      "업데이트",
    ],
  },
  {
    id: "marketing",
    titleKo: "마케팅",
    steps: [
      "목표 정의",
      "대상 고객 분석",
      "메시지",
      "콘텐츠 제작",
      "채널 배포",
      "성과 확인",
      "개선",
    ],
  },
  {
    id: "content",
    titleKo: "콘텐츠",
    steps: [
      "아이디어",
      "기획",
      "제작",
      "편집",
      "검수",
      "채널 배포",
      "반응 분석",
    ],
  },
];
