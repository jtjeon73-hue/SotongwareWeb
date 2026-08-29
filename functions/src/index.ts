import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

initializeApp();

const ALLOWED_INQUIRY_TYPES = new Set([
  "automation",
  "app",
  "ebook",
  "website",
  "knowledge",
  "content",
  "marketing",
  "general",
]);

const MAX = {
  name: 100,
  email: 200,
  phone: 30,
  company: 200,
  subject: 200,
  message: 5000,
};

function trimStr(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX.email;
}

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  subject?: string;
  message?: string;
  source?: string;
  sourcePage?: string;
  productSlug?: string;
  website?: string;
}

export const submitContactInquiry = onCall(
  { cors: true, maxInstances: 10 },
  async (request) => {
    const data = request.data as ContactPayload;

    // honeypot — 스팸은 성공처럼 응답
    if (trimStr(data.website, 200)) {
      return { success: true, id: "ignored" };
    }

    const name = trimStr(data.name, MAX.name);
    const email = trimStr(data.email, MAX.email);
    const phone = trimStr(data.phone, MAX.phone);
    const company = trimStr(data.company, MAX.company);
    const inquiryType = trimStr(data.inquiryType, 50);
    const subject = trimStr(data.subject, MAX.subject);
    const message = trimStr(data.message, MAX.message);
    const source = trimStr(data.source, 50) || "sotongware-web";
    const sourcePage = trimStr(data.sourcePage, 200);
    const productSlug = trimStr(data.productSlug, 100);

    if (!name) throw new HttpsError("invalid-argument", "이름을 입력해 주세요.");
    if (!email || !isValidEmail(email)) {
      throw new HttpsError("invalid-argument", "올바른 이메일을 입력해 주세요.");
    }
    if (!phone) throw new HttpsError("invalid-argument", "연락처를 입력해 주세요.");
    if (!ALLOWED_INQUIRY_TYPES.has(inquiryType)) {
      throw new HttpsError("invalid-argument", "문의 유형이 올바르지 않습니다.");
    }
    if (!subject) throw new HttpsError("invalid-argument", "제목을 입력해 주세요.");
    if (!message) throw new HttpsError("invalid-argument", "문의 내용을 입력해 주세요.");

    const db = getFirestore();

    // 동일 이메일+제목 5분 내 중복 방지
    const fiveMinutesAgo = Timestamp.fromMillis(Date.now() - 5 * 60 * 1000);
    const recentSnap = await db
      .collection("contactInquiries")
      .where("email", "==", email)
      .where("createdAt", ">", fiveMinutesAgo)
      .limit(20)
      .get();

    const duplicate = recentSnap.docs.some((doc) => doc.data().subject === subject);
    if (duplicate) {
      throw new HttpsError(
        "resource-exhausted",
        "동일한 문의가 최근에 접수되었습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    const docRef = await db.collection("contactInquiries").add({
      name,
      email,
      phone,
      company: company || null,
      inquiryType,
      subject,
      message,
      status: "new",
      source,
      sourcePage: sourcePage || null,
      productSlug: productSlug || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  },
);
