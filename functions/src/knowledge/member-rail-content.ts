/**
 * Knowledge Basic member benefit — unified learning rail body (SERVER ONLY).
 *
 * This text must never be imported by the public client bundle
 * (src/data/service-catalog/knowledge-member-rail.ts carries public meta only).
 */

export type KnowledgeMemberLocalized = { ko: string; en: string };

export type KnowledgeMemberDisclaimer = "ymyl_health" | "ymyl_finance";

export type KnowledgeMemberRailSection = {
  id: string;
  title: KnowledgeMemberLocalized;
  paragraphs: KnowledgeMemberLocalized[];
  /** Public hub slugs (match src/data/service-catalog/knowledge.ts) */
  relatedSiteSlugs: string[];
  disclaimerType?: KnowledgeMemberDisclaimer;
};

export type KnowledgeMemberRailBody = {
  guideId: string;
  title: KnowledgeMemberLocalized;
  summary: KnowledgeMemberLocalized;
  sections: KnowledgeMemberRailSection[];
};

export const KNOWLEDGE_MEMBER_RAIL_GUIDE_ID = "unified-learning-rail";

const UNIFIED_LEARNING_RAIL: KnowledgeMemberRailBody = {
  guideId: KNOWLEDGE_MEMBER_RAIL_GUIDE_ID,
  title: {
    ko: "통합 학습 레일",
    en: "Unified learning rail",
  },
  summary: {
    ko: "열두 개 공개 허브를 목적별 순서로 엮은 Basic 회원 전용 학습 안내서입니다.",
    en: "A Basic-member study guide that strings the twelve public hubs into goal-based routes.",
  },
  sections: [
    {
      id: "start",
      title: { ko: "시작하기: 이 레일을 쓰는 법", en: "Getting started: how to use this rail" },
      relatedSiteSlugs: ["save-live", "ai-story"],
      paragraphs: [
        {
          ko: "소통웨어 통합 학습 레일은 열두 개 허브를 하나의 순서로 엮는 회원 전용 안내서입니다. 공개 허브는 누구나 무료로 읽을 수 있고, 이 레일은 그 허브들을 '무엇을 먼저, 어떤 순서로, 어디까지' 볼지 정해 주는 지도 역할을 합니다.",
          en: "The SotongWare unified learning rail is a member-only guide that strings the twelve hubs into one sequence. The hubs stay free to read; this rail is the map that tells you what to read first, in what order, and how far to go.",
        },
        {
          ko: "먼저 오늘 쓸 수 있는 시간을 정하세요. 하루 10분이면 허브 하나의 대표 카드 한 장, 주말 1시간이면 한 경로의 첫 두 단계를 끝낼 수 있습니다. 욕심내어 여러 경로를 동시에 열기보다 한 경로를 끝까지 따라가는 편이 기억에 훨씬 오래 남습니다.",
          en: "Start by deciding how much time you actually have. Ten minutes a day covers one featured card from a hub; one weekend hour covers the first two steps of a route. Finishing one route beats opening several at once — it sticks much longer.",
        },
        {
          ko: "각 경로 끝에는 '오늘의 확인 질문'이 있습니다. 답을 종이에 한 줄로 적어 보세요. 이 서비스는 진도나 북마크를 서버에 저장하지 않으므로, 기록은 본인의 메모장이 가장 확실한 저장소입니다.",
          en: "Each route ends with a short check question. Write the answer in one line on paper. This service does not store progress or bookmarks on the server, so your own notebook is the most reliable record.",
        },
      ],
    },
    {
      id: "how-to-use-12-hubs",
      title: { ko: "12개 공개 허브 사용 지도", en: "Using the 12 public hubs" },
      relatedSiteSlugs: [
        "ai-story",
        "electric",
        "car",
        "finance",
        "language",
        "health",
        "plc",
        "smart-farm",
        "development",
        "web-app-dev",
        "country-ai",
        "save-live",
      ],
      paragraphs: [
        {
          ko: "열두 허브는 네 묶음으로 보면 쉽습니다. 만들기(AI 스토리·소프트웨어 개발·웹·앱 제작), 현장 기술(전기·PLC·스마트팜), 생활(모빌리티·생활 절약·시골 AI 생활), 그리고 기초 체력(언어·금융·건강)입니다.",
          en: "Think of the twelve hubs in four groups: Build (AI Story, Software Development, Web & App Build), Field tech (Electrical, PLC, Smart Farm), Daily life (Mobility, Life & Savings, Rural AI Life), and Foundations (Language, Finance, Health).",
        },
        {
          ko: "허브를 열면 먼저 대표 콘텐츠 한 개만 읽고 돌아오세요. 대표 카드는 해당 허브에서 가장 입문 난도가 낮은 자료로 골라 두었습니다. 이해가 되면 같은 허브의 다음 자료로, 막히면 이 레일의 '선수 지식' 안내로 돌아와 앞 경로를 먼저 밟으세요.",
          en: "When you open a hub, read only its featured item first and come back. Featured cards are the lowest-difficulty entry on each hub. If it clicks, continue on the same hub; if you get stuck, return to this rail and take the prerequisite route first.",
        },
        {
          ko: "허브 외부 사이트는 새 창으로 열리며 각 사이트의 운영 상태에 따라 내용이 바뀔 수 있습니다. 이 레일의 안내는 허브 주제 순서를 정리한 것이지, 외부 사이트 자료의 정확성을 보증하는 것은 아닙니다. 중요한 결정은 반드시 원문과 전문가 확인을 거치세요.",
          en: "Hub sites open in a new window and their content may change as each site is maintained. This rail organizes the order of topics; it does not guarantee the accuracy of third-party site content. Verify important decisions against primary sources and qualified professionals.",
        },
      ],
    },
    {
      id: "path-ai-to-dev",
      title: { ko: "경로 1: AI에서 개발로", en: "Route 1: from AI to development" },
      relatedSiteSlugs: ["ai-story", "development", "web-app-dev"],
      paragraphs: [
        {
          ko: "1단계(AI 스토리): 생성형 AI에 질문하는 방법을 익힙니다. 목표, 맥락, 원하는 출력 형식 세 가지를 문장에 넣는 연습만으로 결과 품질이 눈에 띄게 달라집니다. 답변을 그대로 믿지 말고 출처와 숫자를 한 번씩 되물어 확인하는 습관을 함께 들이세요.",
          en: "Step 1 (AI Story): learn how to ask a generative AI. Simply putting goal, context, and desired output format into your prompt changes quality noticeably. Build the habit of questioning sources and numbers instead of trusting answers as-is.",
        },
        {
          ko: "2단계(소프트웨어 개발): 작은 자동화 하나를 정해 로컬 환경을 세팅합니다. 에디터, 버전 관리, 터미널 세 가지만 익히면 충분합니다. 이때 AI에게 코드를 요청하되, 실행 전에 한 줄씩 의미를 설명하게 해서 이해하지 못한 코드는 쓰지 않는 원칙을 지키세요.",
          en: "Step 2 (Software Development): pick one small automation and set up a local environment. An editor, version control, and a terminal are enough. Ask AI for code, but have it explain each line before you run it, and never use code you do not understand.",
        },
        {
          ko: "3단계(웹·앱 제작): 주말 프로젝트 한 개를 끝까지 완성합니다. 화면 하나, 기능 하나, 배포 한 번이 목표입니다. 완성도보다 '공개해 보았다'는 경험이 다음 프로젝트의 속도를 결정합니다. 확인 질문: 이번 주에 내가 끝낸 가장 작은 결과물은 무엇인가?",
          en: "Step 3 (Web & App Build): finish one weekend project end to end — one screen, one feature, one deploy. Having shipped something matters more than polish for the speed of your next project. Check question: what is the smallest thing I finished this week?",
        },
      ],
    },
    {
      id: "path-elec-plc-farm",
      title: { ko: "경로 2: 전기에서 PLC, 스마트팜으로", en: "Route 2: electrical to PLC to smart farm" },
      relatedSiteSlugs: ["electric", "plc", "smart-farm"],
      paragraphs: [
        {
          ko: "1단계(전기): 전압·전류·저항의 관계와 접지·차단기의 역할을 그림으로 이해합니다. 이 단계의 첫 원칙은 안전입니다. 배전반 작업과 고전압 작업은 자격을 갖춘 전기기술자가 해야 하며, 학습 자료는 현장 작업 허가를 대신하지 않습니다.",
          en: "Step 1 (Electrical): understand voltage, current, resistance, grounding, and breakers through diagrams. Safety comes first: panel and high-voltage work must be done by a qualified electrician, and study material is never a substitute for work authorization.",
        },
        {
          ko: "2단계(PLC·자동화): 입력, 연산, 출력의 흐름으로 래더 로직을 읽습니다. 알람이 울렸을 때는 설비를 임의로 우회하지 말고, 알람 이름·발생 시각·직전 동작 세 가지를 기록하는 것부터 시작하세요. 안전 회로를 해제하거나 잠금·표지 절차를 생략하는 행동은 어떤 경우에도 권하지 않습니다.",
          en: "Step 2 (PLC & automation): read ladder logic as input, logic, output. When an alarm fires, do not bypass equipment — first record the alarm name, time, and the preceding action. Disabling safety circuits or skipping lockout/tagout is never recommended.",
        },
        {
          ko: "3단계(스마트팜): 센서 값(온도·습도·토양수분)과 관수·환기 제어를 PLC에서 배운 입력-출력 사고로 다시 읽습니다. 작은 온실 하나를 가정해 '센서 값이 기준을 넘으면 어떤 출력이 켜져야 하는가'를 표로 적어 보세요. 확인 질문: 센서가 고장 났을 때 시스템은 어떤 안전 상태로 가야 하는가?",
          en: "Step 3 (Smart Farm): reread sensors (temperature, humidity, soil moisture) and irrigation/ventilation control through the input-output thinking from PLC. Imagine one small greenhouse and tabulate which output should turn on when a reading crosses its limit. Check question: what safe state should the system fall back to when a sensor fails?",
        },
      ],
    },
    {
      id: "path-english-ai",
      title: { ko: "경로 3: 영어에서 AI 활용으로", en: "Route 3: from English to working with AI" },
      relatedSiteSlugs: ["language", "ai-story", "country-ai"],
      paragraphs: [
        {
          ko: "1단계(언어): 매일 10분 루틴으로 자주 쓰는 표현 다섯 개를 소리 내어 말합니다. 새 표현을 외우기보다 이미 아는 표현을 자기 상황에 맞게 바꿔 말하는 연습이 더 빨리 늡니다.",
          en: "Step 1 (Language): speak five common expressions aloud in a daily ten-minute routine. Adapting expressions you already know to your own situation builds fluency faster than memorizing new ones.",
        },
        {
          ko: "2단계(AI 스토리): 영어 AI 도구의 설명서와 영어 질문을 활용합니다. 번역기를 켜 둔 채 읽되, 모르는 단어는 문맥으로 먼저 추측한 뒤 확인하세요. AI에게 '내 영어 문장을 고쳐 주고 왜 고쳤는지 한국어로 설명해 줘'라고 요청하면 학습 효과가 커집니다.",
          en: "Step 2 (AI Story): use English documentation and English prompts for AI tools. Keep a translator on, but guess unknown words from context first, then check. Asking AI to correct your English and explain why in your native language improves learning.",
        },
        {
          ko: "3단계(시골·AI 생활): 생활 속 작은 문제를 영어로 AI에게 설명해 보는 것으로 마무리합니다. 확인 질문: 이번 주 나는 영어로 AI에게 몇 번, 어떤 문제를 설명했는가? 개인정보와 주소, 계정 정보는 어떤 언어로든 AI에 입력하지 마세요.",
          en: "Step 3 (Rural AI Life): finish by describing small everyday problems to AI in English. Check question: how many times, and about what problem, did I explain something to AI in English this week? Never enter personal data, addresses, or account details into AI in any language.",
        },
      ],
    },
    {
      id: "path-car",
      title: { ko: "경로 4: 모빌리티·차량 기초", en: "Route 4: mobility and car basics" },
      relatedSiteSlugs: ["car", "electric"],
      paragraphs: [
        {
          ko: "차량 경로는 '내가 직접 할 일'과 '정비소에 맡길 일'을 구분하는 데서 시작합니다. 타이어 공기압, 워셔액, 와이퍼, 계기판 경고등 의미 확인은 스스로 할 수 있는 점검입니다. 브레이크, 조향, 에어백, 고전압 배터리 관련 작업은 반드시 전문 정비 인력에게 맡겨야 합니다.",
          en: "The car route starts by separating what you do yourself from what you leave to a shop. Tire pressure, washer fluid, wipers, and learning what dashboard warning lights mean are self-checks. Brake, steering, airbag, and high-voltage battery work must go to qualified technicians.",
        },
        {
          ko: "정기 점검 체크리스트를 만들어 계절이 바뀔 때마다 한 번씩 확인하세요. 엔진오일·냉각수·타이어 마모·배터리 상태를 기록해 두면 정비소에서 증상을 설명하기도 쉬워집니다. 전기차와 하이브리드는 고전압 계통이 있으므로 전기 허브의 안전 카드를 먼저 읽어 두면 도움이 됩니다.",
          en: "Make a routine-check list and run it every time the season changes. Noting engine oil, coolant, tire wear, and battery condition makes it easier to describe symptoms at the shop. Electric and hybrid cars have high-voltage systems, so reading the electrical hub safety cards first helps.",
        },
        {
          ko: "확인 질문: 지금 내 차의 경고등 중 의미를 모르는 것이 있는가? 경고등이 켜진 채로 장거리 운행을 하지 마시고 제조사 설명서와 정비소의 안내를 따르세요.",
          en: "Check question: is there a warning light on my car whose meaning I do not know? Do not drive long distances with a warning light on; follow the manufacturer manual and your shop's advice.",
        },
      ],
    },
    {
      id: "path-life-save-live",
      title: { ko: "경로 5: 생활·절약과 일상 설계", en: "Route 5: life, savings, and daily design" },
      relatedSiteSlugs: ["save-live", "country-ai", "finance"],
      paragraphs: [
        {
          ko: "생활 경로는 지출을 줄이는 기술이 아니라 '새는 곳을 눈으로 보는 습관'에서 시작합니다. 한 달치 고정 지출(통신·보험·구독)을 한 장에 나열하고, 지난 석 달 동안 실제로 쓴 것만 표시해 보세요. 쓰지 않은 항목이 첫 번째 절약 후보입니다.",
          en: "The life route starts not with cutting skills but with seeing where money leaks. List one month of fixed costs (telecom, insurance, subscriptions) on one page and mark only what you actually used in the last three months. Unused items are your first savings candidates.",
        },
        {
          ko: "시골·AI 생활 허브와 연결해서 보면, 집 안 전기 사용량, 텃밭 관수, 이동 횟수처럼 반복되는 생활 데이터를 AI에게 요약시키는 방식으로 작은 개선을 만들 수 있습니다. 다만 결과는 참고용이며, 계약 해지나 요금제 변경은 각 사업자의 공식 안내를 기준으로 하세요.",
          en: "Combined with the Rural AI Life hub, you can ask AI to summarize repeating household data — home power use, garden watering, trips — to find small improvements. Treat results as reference only, and base cancellations or plan changes on each provider's official terms.",
        },
        {
          ko: "확인 질문: 이번 달 쓰지 않으면서 계속 나가는 고정 지출 한 가지는 무엇인가? 이 경로의 내용은 일반적인 생활 정보이며 개인 맞춤 재무 설계가 아닙니다.",
          en: "Check question: what is one fixed cost that keeps going out this month without being used? This route is general life information, not personalized financial planning.",
        },
      ],
    },
    {
      id: "health-ymyl",
      title: { ko: "건강: 일반 정보로 읽는 방법", en: "Health: reading general information safely" },
      relatedSiteSlugs: ["health", "save-live"],
      disclaimerType: "ymyl_health",
      paragraphs: [
        {
          ko: "건강 경로는 수면·식사·활동·스트레스 같은 생활 습관을 스스로 점검하는 데 초점을 둡니다. 이는 일반적인 교육 정보이며 진단, 치료, 처방을 대신하지 않습니다. 증상이 있거나 약을 복용 중이라면 자료가 아니라 의료진의 판단을 따르세요.",
          en: "The health route focuses on self-checking habits such as sleep, meals, activity, and stress. It is general educational information and does not replace diagnosis, treatment, or prescriptions. If you have symptoms or take medication, follow your clinician, not reading material.",
        },
        {
          ko: "건강 정보를 읽을 때는 세 가지를 확인하세요. 누가 썼는가, 언제 갱신되었는가, 근거가 무엇인가. 특정 식품이나 보조제가 질병을 낫게 한다는 주장, 단기간에 극적인 효과를 약속하는 문구는 일단 의심하고 공식 보건 기관의 안내와 대조하세요.",
          en: "When reading health information, check three things: who wrote it, when it was updated, and what evidence backs it. Treat claims that a food or supplement cures disease, or that promise dramatic short-term effects, with suspicion and compare them with official public-health guidance.",
        },
        {
          ko: "가슴 통증, 호흡 곤란, 갑작스러운 마비·언어 장애, 심한 출혈 등 응급 증상이 있으면 이 자료를 읽지 말고 즉시 응급 서비스나 의료기관을 이용하세요.",
          en: "If you have emergency symptoms such as chest pain, trouble breathing, sudden weakness or speech difficulty, or heavy bleeding, stop reading and contact emergency services or a medical facility immediately.",
        },
      ],
    },
    {
      id: "finance-ymyl",
      title: { ko: "금융: 교육용 개념 정리", en: "Finance: educational concepts" },
      relatedSiteSlugs: ["finance", "save-live"],
      disclaimerType: "ymyl_finance",
      paragraphs: [
        {
          ko: "금융 경로는 예산, 현금흐름, 비상금, 이자와 수수료 같은 기본 개념을 이해하는 것이 목적입니다. 특정 상품 추천이나 수익 보장 정보가 아니며, 개인 맞춤 투자·세무·법률 조언도 아닙니다. 결정과 그 결과의 책임은 이용자 본인에게 있습니다.",
          en: "The finance route aims to build basic understanding of budgets, cash flow, emergency funds, interest, and fees. It is not a product recommendation or a promise of returns, nor personalized investment, tax, or legal advice. Decisions and their outcomes are your own responsibility.",
        },
        {
          ko: "기초 순서는 이렇습니다. 첫째, 한 달 수입과 지출을 구분해 기록합니다. 둘째, 갑작스러운 지출에 대비한 예비 자금의 목표 기간을 정합니다. 셋째, 대출이 있다면 금리와 상환 조건을 문서로 확인합니다. 원금 손실이 가능한 상품은 손실을 감당할 수 있는 범위인지 스스로 따져 보아야 합니다.",
          en: "A basic order: first, record income and spending separately. Second, decide how many months of emergency funds you want. Third, if you have loans, confirm rates and repayment terms in writing. For products that can lose principal, judge for yourself whether you can absorb the loss.",
        },
        {
          ko: "높은 수익을 빠르게 약속하거나 연락처·인증번호를 요구하는 제안은 사기일 가능성이 큽니다. 세금·법률 문제는 세무사·변호사 같은 자격 있는 전문가와 상담하고, 금융 상품은 금융회사의 공식 설명서와 약관을 기준으로 판단하세요.",
          en: "Offers that promise fast high returns or ask for contact details or verification codes are likely scams. For tax or legal questions consult qualified professionals, and judge financial products against the provider's official documents and terms.",
        },
      ],
    },
    {
      id: "checklist",
      title: { ko: "통합 체크리스트", en: "Unified checklist" },
      relatedSiteSlugs: [
        "ai-story",
        "electric",
        "car",
        "finance",
        "language",
        "health",
        "plc",
        "smart-farm",
        "development",
        "web-app-dev",
        "country-ai",
        "save-live",
      ],
      paragraphs: [
        {
          ko: "- [ ] 이번 주에 끝낼 경로를 하나만 정했다.\n- [ ] 선택한 경로의 첫 허브 대표 카드를 읽었다.\n- [ ] 확인 질문의 답을 한 줄로 적었다.\n- [ ] 모르는 용어는 공개 허브에서 다시 찾아보았다.",
          en: "- [ ] I picked only one route to finish this week.\n- [ ] I read the featured card on the first hub of that route.\n- [ ] I wrote a one-line answer to the check question.\n- [ ] I looked up unknown terms again on the public hubs.",
        },
        {
          ko: "- [ ] 전기·PLC·차량 작업은 자격과 안전 절차를 지킬 수 있는 범위에서만 했다.\n- [ ] 건강·금융 내용은 일반 정보로만 받아들이고 전문가 확인이 필요한 결정은 미뤘다.\n- [ ] AI에 개인정보와 계정 정보를 입력하지 않았다.",
          en: "- [ ] I kept electrical, PLC, and car tasks within my qualifications and safety procedures.\n- [ ] I treated health and finance content as general information and deferred decisions that need a professional.\n- [ ] I did not enter personal or account data into AI.",
        },
        {
          ko: "한 경로를 끝냈다면 다음 경로를 고르기 전에 하루를 쉬세요. 이 레일은 기간제 Basic 회원 이용권이 활성인 동안 열람할 수 있으며 자동갱신 결제가 아닙니다. 공개 허브는 이용권과 관계없이 계속 무료입니다.",
          en: "When you finish a route, rest a day before choosing the next. This rail is readable while a prepaid Basic membership term is active and is not auto-renewing billing. The public hubs remain free regardless of membership.",
        },
      ],
    },
  ],
};

const BODIES: Record<string, KnowledgeMemberRailBody> = {
  [KNOWLEDGE_MEMBER_RAIL_GUIDE_ID]: UNIFIED_LEARNING_RAIL,
};

/** Server-side lookup — returns null for unknown guide ids. */
export function getKnowledgeMemberRailBody(guideId: string): KnowledgeMemberRailBody | null {
  if (typeof guideId !== "string") return null;
  return Object.prototype.hasOwnProperty.call(BODIES, guideId) ? BODIES[guideId] : null;
}
