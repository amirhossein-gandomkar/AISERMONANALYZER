import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export interface SummaryResponse {
  impactfulTitle: string;
  khutbah1: {
    title: string;
    summary: { heading: string; explanation: string }[];
  };
  khutbah2: {
    title: string;
    summary: { heading: string; explanation: string }[];
  };
  overallSummary: {
    title: string;
    text: string;
  };
  khutbah1Quote: string;
  khutbah2Quote: string;
}

export async function summarizeKhutbahs(khutbah1Text: string, khutbah2Text: string): Promise<SummaryResponse> {
  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ khutbah1Text, khutbah2Text }),
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در پردازش خطبه‌ها");
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON error:", text);
        throw new Error("سرور با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      }
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Expected JSON but got:", text);
      throw new Error("پاسخ نامعتبر از سرور دریافت شد.");
    }

    return response.json();
  } catch (error: any) {
    console.error("Summarize Error:", error);
    throw error;
  }
}
