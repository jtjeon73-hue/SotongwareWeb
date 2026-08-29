"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";

function ContactFormWithParams() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") ?? undefined;
  const product = searchParams.get("product") ?? undefined;

  return <ContactForm defaultTopic={topic} defaultProductSlug={product} />;
}

export function ContactFormSection() {
  return (
    <Suspense fallback={<p className="text-sm text-surface-500">문의 폼을 불러오는 중...</p>}>
      <ContactFormWithParams />
    </Suspense>
  );
}
