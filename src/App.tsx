import { useState, MouseEvent } from "react";
import { useMotionValue, useMotionTemplate, motion } from "motion/react";
import { GoogleGenAI, Type } from "@google/genai";
import SummarizerForm from "./components/SummarizerForm";
import ResultDisplay from "./components/ResultDisplay";
import { SermonData } from "./types";
import { BookOpen } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const schema = {
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
        bestQuote: {
          type: Type.STRING,
          description:
            "A beautiful, impactful quote from Khutbah 1 for the image (20-30 words)",
        },
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
        bestQuote: {
          type: Type.STRING,
          description:
            "A strong, impactful political/social quote from Khutbah 2 for the image (20-30 words)",
        },
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
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SermonData | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleSummarize = async (
    khutbah1Text: string,
    khutbah2Text: string,
  ) => {
    setIsLoading(true);
    setResult(null);

    const prompt = `شما یک دستیار متخصص در خلاصه سازی و تحلیل محتوای خطبه های نماز جمعه هستید.
متن خطبه اول: ${khutbah1Text}
متن خطبه دوم: ${khutbah2Text}
دستورالعمل ها:
impactfulTitle: تیتر کلی، تاثیرگذار و جذاب (یک جمله).
khutbah1.title: تیتر خطبه اول (۲ تا ۴ کلمه).
khutbah1.summary: خلاصه خطبه اول (مذهبی/اخلاقی) بین ۳ تا ۵ بخش (heading و explanation).
khutbah1.bestQuote: بهترین، زیباترین و تاثیرگذارترین بخش خطبه اول (مذهبی/اخلاقی) برای قرار دادن در عکس نوشته (حدود ۲۰ تا ۳۰ کلمه).
khutbah2.title: تیتر خطبه دوم (۲ تا ۴ کلمه).
khutbah2.summary: خلاصه خطبه دوم (سیاسی/اجتماعی) بین ۳ تا ۵ بخش.
khutbah2.bestQuote: بهترین، زیباترین و تاثیرگذارترین بخش خطبه دوم (سیاسی/اجتماعی) برای قرار دادن در عکس نوشته (حدود ۲۰ تا ۳۰ کلمه).
overallSummary.title: تیتر خلاصه نهایی.
overallSummary.text: خلاصه کلی (حدود ۴ خط).`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text) as SermonData;
        setResult(data);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("خطایی در ارتباط با هوش مصنوعی رخ داد. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.10),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/10">
            <BookOpen className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 animate-gradient">
            دستیار هوشمند خطبه های نماز جمعه
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto" dir="rtl">
            متن خطبه ها را وارد کنید تا هوش مصنوعی به صورت خودکار خلاصه ای
            ساختاریافته، جذاب و آماده انتشار تولید کند.
          </p>
        </div>

        <SummarizerForm onSubmit={handleSummarize} isLoading={isLoading} />

        {result && <ResultDisplay data={result} />}
      </div>
    </div>
  );
}
