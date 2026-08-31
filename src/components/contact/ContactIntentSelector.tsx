"use client";

import { useRouter } from "next/navigation";
import { TOPIC_TO_INQUIRY, type InquiryType } from "@/types/contact";
import { trackEvent } from "@/lib/analytics";

const INTENT_OPTIONS = [
  { topic: "automation", label: "산업자동화" },
  { topic: "app", label: "앱 제작" },
  { topic: "website", label: "웹사이트" },
  { topic: "ebook", label: "전자책" },
  { topic: "knowledge", label: "지식·교육" },
  { topic: "content", label: "콘텐츠" },
  { topic: "marketing", label: "마케팅" },
  { topic: "general", label: "기타" },
] as const;

interface ContactIntentSelectorProps {
  selectedTopic?: string;
  onSelect?: (topic: string, inquiryType: InquiryType) => void;
}

export function ContactIntentSelector({ selectedTopic, onSelect }: ContactIntentSelectorProps) {
  const router = useRouter();

  function handleSelect(topic: string) {
    const inquiryType = TOPIC_TO_INQUIRY[topic] ?? "general";
    trackEvent("service_intent_click", {
      intent_id: topic,
      destination: `/contact?topic=${topic}`,
      context: "contact",
    });
    onSelect?.(topic, inquiryType);
    router.push(`/contact?topic=${topic}#contact-form`);
  }

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-surface-900">무엇이 필요하신가요?</h2>
      <p className="mt-1 text-sm text-surface-600">
        아이디어가 완성되어 있지 않아도 괜찮습니다. 필요한 목적부터 알려주세요.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {INTENT_OPTIONS.map((opt) => (
          <button
            key={opt.topic}
            type="button"
            onClick={() => handleSelect(opt.topic)}
            className={`min-h-11 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
              selectedTopic === opt.topic
                ? "border-brand-600 bg-brand-50 text-brand-700"
                : "border-surface-200 bg-white text-surface-700 hover:border-brand-300 hover:bg-brand-50/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
