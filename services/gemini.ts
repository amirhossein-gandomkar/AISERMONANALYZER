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
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    شما یک دستیار متخصص در خلاصهسازی و تحلیل محتوای خطبههای نماز جمعه هستید.
    متن خطبه اول: ${khutbah1Text}
    متن خطبه دوم: ${khutbah2Text}
    دستورالعملها:
    1. impactfulTitle: تیتر کلی، تاثیرگذار و جذاب (یک جمله).
    2. khutbah1.title: تیتر خطبه اول (۲ تا ۴ کلمه).
    3. khutbah1.summary: خلاصه خطبه اول (مذهبی/اخلاقی) بین ۳ تا ۵ بخش (heading و explanation).
    4. khutbah2.title: تیتر خطبه دوم (۲ تا ۴ کلمه).
    5. khutbah2.summary: خلاصه خطبه دوم (سیاسی/اجتماعی) بین ۳ تا ۵ بخش.
    6. overallSummary.title: تیتر خلاصه نهایی.
    7. overallSummary.text: خلاصه کلی (حدود ۴ خط).
    8. khutbah1Quote: زیباترین و تاثیرگذارترین جمله یا بخش کوتاه از خطبه اول برای طراحی گرافیکی (حداکثر ۱۵ کلمه).
    9. khutbah2Quote: زیباترین و تاثیرگذارترین جمله یا بخش کوتاه از خطبه دوم برای طراحی گرافیکی (حداکثر ۱۵ کلمه).
    خروجی را دقیقا در قالب JSON مشخص شده برگردانید.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          impactfulTitle: { type: Type.STRING },
          khutbah1: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["heading", "explanation"],
                },
              },
            },
            required: ["title", "summary"],
          },
          khutbah2: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["heading", "explanation"],
                },
              },
            },
            required: ["title", "summary"],
          },
          overallSummary: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              text: { type: Type.STRING },
            },
            required: ["title", "text"],
          },
          khutbah1Quote: { type: Type.STRING },
          khutbah2Quote: { type: Type.STRING },
        },
        required: ["impactfulTitle", "khutbah1", "khutbah2", "overallSummary", "khutbah1Quote", "khutbah2Quote"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
}
