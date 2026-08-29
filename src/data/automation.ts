import type { AutomationCapability } from "@/types/product";
import type { SotongProduct } from "@/types/product";

export const automationProducts: SotongProduct[] = [];

export const automationCapabilities: AutomationCapability[] = [
  { id: "plc", title: "PLC 연동", description: "PLC 통신, 데이터 수집, 제어 로직 연동" },
  { id: "hmi", title: "HMI", description: "운전 화면, 알람, 트렌드, 레시피 관리" },
  { id: "mes", title: "MES 연동", description: "생산실적, 작업지시, 품질 데이터 연동" },
  { id: "monitoring", title: "설비 모니터링", description: "실시간 설비 상태, 알림, 이력" },
  { id: "vision", title: "비전검사", description: "영상 검사, 불량 판별, 데이터 기록" },
  { id: "data", title: "데이터 수집", description: "생산·설비 데이터 자동 수집·저장" },
  { id: "line", title: "생산라인 소프트웨어", description: "라인별 공정 제어·모니터링" },
  { id: "remote", title: "설비 원격관리", description: "원격 모니터링, 알림, 진단" },
];

export const automationPortfolio: { title: string; description: string }[] = [];
