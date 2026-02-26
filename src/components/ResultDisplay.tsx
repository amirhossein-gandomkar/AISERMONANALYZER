import { useState } from "react";
import { SermonData } from "../types";
import { Copy, FileText, FileDown, Image as ImageIcon } from "lucide-react";
import { exportToWord, exportToPDF } from "../utils/exportUtils";
import ImageGenerator from "./ImageGenerator";

export default function ResultDisplay({ data }: { data: SermonData }) {
  const [showImages, setShowImages] = useState(false);
  const introText =
    "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم\nبه گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه های این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:";

  const handleCopy = () => {
    let text = `${introText}\n\n`;
    text += `**${data.impactfulTitle}**\n\n`;
    text += `**خطبه اول: ${data.khutbah1.title}**\n`;
    data.khutbah1.summary.forEach((s) => {
      text += `- ${s.heading}: ${s.explanation}\n`;
    });
    text += `\n**خطبه دوم: ${data.khutbah2.title}**\n`;
    data.khutbah2.summary.forEach((s) => {
      text += `- ${s.heading}: ${s.explanation}\n`;
    });
    text += `\n**${data.overallSummary.title}**\n${data.overallSummary.text}`;

    navigator.clipboard.writeText(text);
    alert("متن کپی شد!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-slate-900/50 cursor-pointer"
        >
          <Copy className="w-5 h-5" /> کپی متن
        </button>
        <button
          onClick={() => exportToWord(data)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <FileText className="w-5 h-5" /> خروجی Word
        </button>
        <button
          onClick={() => exportToPDF("pdf-content")}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-600/30 cursor-pointer"
        >
          <FileDown className="w-5 h-5" /> خروجی PDF
        </button>
        <button
          onClick={() => setShowImages(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
        >
          <ImageIcon className="w-5 h-5" /> ایجاد خطبه نگاشت
        </button>
      </div>

      {/* Content Display */}
      <div
        id="pdf-content"
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-slate-200 text-right"
        dir="rtl"
      >
        <div className="text-center mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">
            بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم
          </h2>
          <p className="text-lg leading-relaxed text-slate-300">
            به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله
            (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه های این هفته
            از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:
          </p>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center">
            {data.impactfulTitle}
          </h1>

          <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-2xl font-bold text-blue-400 border-b border-slate-700 pb-2">
              خطبه اول: {data.khutbah1.title}
            </h3>
            <ul className="space-y-3 list-disc list-inside marker:text-blue-500">
              {data.khutbah1.summary.map((item, i) => (
                <li key={i} className="text-lg">
                  <span className="font-bold text-white">{item.heading}: </span>
                  <span className="text-slate-300">{item.explanation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-2xl font-bold text-emerald-400 border-b border-slate-700 pb-2">
              خطبه دوم: {data.khutbah2.title}
            </h3>
            <ul className="space-y-3 list-disc list-inside marker:text-emerald-500">
              {data.khutbah2.summary.map((item, i) => (
                <li key={i} className="text-lg">
                  <span className="font-bold text-white">{item.heading}: </span>
                  <span className="text-slate-300">{item.explanation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-indigo-300 border-b border-indigo-500/30 pb-2">
              {data.overallSummary.title}
            </h3>
            <p className="text-lg text-slate-200 leading-relaxed">
              {data.overallSummary.text}
            </p>
          </div>
        </div>
      </div>

      {/* Image Generators */}
      {showImages && (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-500">
          <ImageGenerator quote={data.khutbah1.bestQuote} type="religious" />
          <ImageGenerator quote={data.khutbah2.bestQuote} type="political" />
        </div>
      )}
    </div>
  );
}
