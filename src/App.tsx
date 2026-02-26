import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { Copy, FileText, Download, Image as ImageIcon, Loader2, FileDown } from "lucide-react";
import { generateSummary, SummaryResponse } from "./services/geminiService";
import { generateWordDocument } from "./services/wordExportService";
import { generatePdfDocument } from "./services/pdfExportService";
import { generateKhutbahNegasht } from "./services/imageExportService";

export default function App() {
  const [khutbah1, setKhutbah1] = useState("");
  const [khutbah2, setKhutbah2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [religiousImage, setReligiousImage] = useState<string | null>(null);
  const [politicalImage, setPoliticalImage] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const handleSummarize = async () => {
    if (!khutbah1 || !khutbah2) {
      alert("لطفا متن هر دو خطبه را وارد کنید.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateSummary(khutbah1, khutbah2);
      setSummary(result);
      setReligiousImage(null);
      setPoliticalImage(null);
    } catch (error) {
      console.error(error);
      alert("خطایی در خلاصه سازی رخ داد. لطفا دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    const preamble = "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم\nبه گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبههای این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:";
    
    let text = `${summary.impactfulTitle}\n\n${preamble}\n\n`;
    text += `${summary.khutbah1.title}\n`;
    summary.khutbah1.summary.forEach(item => {
      text += `${item.heading}: ${item.explanation}\n`;
    });
    text += `\n${summary.khutbah2.title}\n`;
    summary.khutbah2.summary.forEach(item => {
      text += `${item.heading}: ${item.explanation}\n`;
    });
    text += `\n${summary.overallSummary.title}\n`;
    text += `${summary.overallSummary.text}\n`;

    navigator.clipboard.writeText(text);
    alert("متن با موفقیت کپی شد!");
  };

  const handleGenerateImages = async () => {
    if (!summary) return;
    setIsGeneratingImages(true);
    try {
      const relImg = await generateKhutbahNegasht(summary.khutbah1.quote, "religious");
      const polImg = await generateKhutbahNegasht(summary.khutbah2.quote, "political");
      setReligiousImage(relImg);
      setPoliticalImage(polImg);
    } catch (error) {
      console.error(error);
      alert("خطایی در تولید تصویر رخ داد.");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleDownloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white font-sans overflow-x-hidden relative" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: mousePosition.x * -50,
            y: mousePosition.y * -50,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", x: { duration: 0.5 }, y: { duration: 0.5 } }}
          className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-800/30 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
            x: mousePosition.x * 50,
            y: mousePosition.y * 50,
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", x: { duration: 0.5 }, y: { duration: 0.5 } }}
          className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-emerald-600/20 to-teal-800/20 blur-[120px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-lg">
            دستیار هوشمند نماز جمعه
          </h1>
          <p className="text-gray-400 text-lg">خلاصه سازی و تولید خطبه نگاشت با هوش مصنوعی</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-emerald-500/50 hover:shadow-[0_8px_32px_rgba(16,185,129,0.2)] transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <label className="block text-emerald-400 font-bold mb-3 text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              متن خطبه اول (مذهبی/اخلاقی)
            </label>
            <textarea
              value={khutbah1}
              onChange={(e) => setKhutbah1(e.target.value)}
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none transition-all placeholder:text-gray-600"
              placeholder="متن خطبه اول را اینجا قرار دهید..."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-500/50 hover:shadow-[0_8px_32px_rgba(6,182,212,0.2)] transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <label className="block text-cyan-400 font-bold mb-3 text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              متن خطبه دوم (سیاسی/اجتماعی)
            </label>
            <textarea
              value={khutbah2}
              onChange={(e) => setKhutbah2(e.target.value)}
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none transition-all placeholder:text-gray-600"
              placeholder="متن خطبه دوم را اینجا قرار دهید..."
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <button
            onClick={handleSummarize}
            disabled={isLoading}
            className="relative group overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 px-10 py-4 font-bold text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2 text-lg">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                <>
                  <FileText />
                  خلاصه سازی خطبه ها
                </>
              )}
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-cyan-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>

        {summary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-12"
          >
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                نتیجه خلاصه سازی
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <Copy size={18} /> کپی متن
                </button>
                <button
                  onClick={() => generateWordDocument(summary)}
                  className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
                >
                  <FileDown size={18} /> خروجی Word
                </button>
                <button
                  onClick={() => generatePdfDocument(summary)}
                  className="flex items-center gap-2 bg-red-600/80 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors"
                >
                  <FileDown size={18} /> خروجی PDF
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none font-['B_Nazanin',Tahoma,Arial] text-lg leading-loose space-y-6">
              <h3 className="text-2xl font-bold text-center text-emerald-300 mb-6">{summary.impactfulTitle}</h3>
              
              <p className="text-justify text-gray-300">
                بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم<br/>
                به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبههای این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:
              </p>

              <div className="bg-black/20 rounded-xl p-6 border border-emerald-500/30">
                <h4 className="text-xl font-bold text-emerald-400 mb-4">{summary.khutbah1.title}</h4>
                <ul className="space-y-3 list-disc list-inside text-gray-300">
                  {summary.khutbah1.summary.map((item, i) => (
                    <li key={i} className="text-justify">
                      <strong className="text-emerald-200">{item.heading}:</strong> {item.explanation}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/20 rounded-xl p-6 border border-cyan-500/30">
                <h4 className="text-xl font-bold text-cyan-400 mb-4">{summary.khutbah2.title}</h4>
                <ul className="space-y-3 list-disc list-inside text-gray-300">
                  {summary.khutbah2.summary.map((item, i) => (
                    <li key={i} className="text-justify">
                      <strong className="text-cyan-200">{item.heading}:</strong> {item.explanation}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/20 rounded-xl p-6 border border-purple-500/30">
                <h4 className="text-xl font-bold text-purple-400 mb-4">{summary.overallSummary.title}</h4>
                <p className="text-justify text-gray-300">{summary.overallSummary.text}</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center">
              <button
                onClick={handleGenerateImages}
                disabled={isGeneratingImages}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-8 py-3 rounded-full font-bold shadow-lg transition-all disabled:opacity-70"
              >
                {isGeneratingImages ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                ایجاد خطبه نگاشت (تصویر)
              </button>

              {(religiousImage || politicalImage) && (
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  {religiousImage && (
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                      <h4 className="text-emerald-400 font-bold mb-4">خطبه نگاشت مذهبی</h4>
                      <img src={religiousImage} alt="Religious Khutbah Negasht" className="w-full rounded-xl mb-4" />
                      <button
                        onClick={() => handleDownloadImage(religiousImage, "khutbah_negasht_mazhabi.png")}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg transition-colors"
                      >
                        <Download size={18} /> دانلود تصویر
                      </button>
                    </div>
                  )}
                  {politicalImage && (
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                      <h4 className="text-cyan-400 font-bold mb-4">خطبه نگاشت سیاسی</h4>
                      <img src={politicalImage} alt="Political Khutbah Negasht" className="w-full rounded-xl mb-4" />
                      <button
                        onClick={() => handleDownloadImage(politicalImage, "khutbah_negasht_siasi.png")}
                        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 py-2 rounded-lg transition-colors"
                      >
                        <Download size={18} /> دانلود تصویر
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
