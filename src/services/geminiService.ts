import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SummaryResponse {
  impactfulTitle: string;
  khutbah1: {
    title: string;
    summary: { heading: string; explanation: string }[];
    quote: string;
  };
  khutbah2: {
    title: string;
    summary: { heading: string; explanation: string }[];
    quote: string;
  };
  overallSummary: {
    title: string;
    text: string;
  };
}

export const generateSummary = async (
  khutbah1Text: string,
  khutbah2Text: string
): Promise<SummaryResponse> => {
  const prompt = `شما یک دستیار متخصص در خلاصهسازی و تحلیل محتوای خطبههای نماز جمعه هستید.
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
8. khutbah1.quote: بهترین و زیباترین بخش از خطبه اول (مذهبی) برای قرار دادن در تصویر (حداقل ۳۰ کلمه).
9. khutbah2.quote: بهترین و زیباترین بخش از خطبه دوم (سیاسی) برای قرار دادن در تصویر (حداقل ۳۰ کلمه).`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
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
                },
              },
              quote: { type: Type.STRING },
            },
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
                },
              },
              quote: { type: Type.STRING },
            },
          },
          overallSummary: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              text: { type: Type.STRING },
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as SummaryResponse;
};
