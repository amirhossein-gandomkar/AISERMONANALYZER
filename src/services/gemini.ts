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
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ khutbah1Text, khutbah2Text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to summarize khutbahs");
  }

  return response.json();
}
