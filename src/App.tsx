/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Quote
} from 'lucide-react';
import { summarizeKhutbahs, SummaryResponse } from './services/gemini';
import { exportToWord } from './utils';

export default function App() {
  const [khutbah1, setKhutbah1] = useState('');
  const [khutbah2, setKhutbah2] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Mouse tracking for background effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSummarize = async () => {
    if (!khutbah1 || !khutbah2) {
      setError('لطفاً متن هر دو خطبه را وارد کنید.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeKhutbahs(khutbah1, khutbah2);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || 'خطایی در برقراری ارتباط با هوش مصنوعی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    const intro = `بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم\nبه گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه‌های این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:\n\n`;
    
    let text = intro;
    text += `${summary.impactfulTitle}\n\n`;
    text += `خطبه اول: ${summary.khutbah1.title}\n`;
    summary.khutbah1.summary.forEach(s => {
      text += `${s.heading}: ${s.explanation}\n`;
    });
    text += `\nخطبه دوم: ${summary.khutbah2.title}\n`;
    summary.khutbah2.summary.forEach(s => {
      text += `${s.heading}: ${s.explanation}\n`;
    });
    text += `\n${summary.overallSummary.title}\n${summary.overallSummary.text}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden" dir="rtl">
      {/* Interactive Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: `radial-gradient(circle 600px at ${springX}px ${springY}px, rgba(16, 185, 129, 0.15), transparent 80%)`
        }}
      />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-0" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>قدرت گرفته از هوش مصنوعی Gemini 3.1 Pro</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            سامانه هوشمند تلخیص خطبه‌ها
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            تحلیل و خلاصه سازی دقیق خطبه‌های نماز جمعه با رعایت موازین مذهبی و سیاسی
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Input Section 1 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-[#121215] border border-white/5 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">خطبه اول (مذهبی/اخلاقی)</h2>
              </div>
              <textarea
                value={khutbah1}
                onChange={(e) => setKhutbah1(e.target.value)}
                placeholder="متن خطبه اول را اینجا وارد کنید..."
                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
              />
            </div>
          </motion.div>

          {/* Input Section 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-[#121215] border border-white/5 rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-4 text-teal-400">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">خطبه دوم (سیاسی/اجتماعی)</h2>
              </div>
              <textarea
                value={khutbah2}
                onChange={(e) => setKhutbah2(e.target.value)}
                placeholder="متن خطبه دوم را اینجا وارد کنید..."
                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all resize-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSummarize}
            disabled={loading}
            className="relative group px-12 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  در حال پردازش هوشمند...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  خلاصه سازی و تحلیل
                </>
              )}
            </span>
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-[2rem] blur-2xl opacity-50" />
              
              <div className="relative bg-[#121215] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
                {/* Result Header */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <h3 className="text-emerald-400 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      خروجی نهایی آماده است
                    </h3>
                    <p className="text-slate-500 text-sm">بر اساس تحلیل هوش مصنوعی از محتوای ارائه شده</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'کپی شد' : 'کپی متن'}</span>
                    </button>
                    <button
                      onClick={() => exportToWord(summary)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>خروجی Word</span>
                    </button>
                  </div>
                </div>

                {/* Content Display */}
                <div className="space-y-10 leading-relaxed text-slate-300">
                  <div className="text-center space-y-4">
                    <p className="text-2xl font-serif text-emerald-500/80">بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم</p>
                    <p className="text-lg text-slate-400">
                      به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه‌های این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:
                    </p>
                  </div>

                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {summary.impactfulTitle}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Khutbah 1 Summary */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-emerald-400 border-b border-emerald-500/20 pb-4">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/10">خطبه اول</span>
                        <h4 className="text-xl font-bold">{summary.khutbah1.title}</h4>
                      </div>
                      <div className="space-y-6">
                        {summary.khutbah1.summary.map((item, idx) => (
                          <div key={idx} className="relative pr-6 border-r border-emerald-500/20">
                            <div className="absolute top-2 right-[-5px] w-2 h-2 rounded-full bg-emerald-500" />
                            <h5 className="text-emerald-300 font-bold mb-2">{item.heading}</h5>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Khutbah 2 Summary */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-teal-400 border-b border-teal-500/20 pb-4">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-teal-500/10">خطبه دوم</span>
                        <h4 className="text-xl font-bold">{summary.khutbah2.title}</h4>
                      </div>
                      <div className="space-y-6">
                        {summary.khutbah2.summary.map((item, idx) => (
                          <div key={idx} className="relative pr-6 border-r border-teal-500/20">
                            <div className="absolute top-2 right-[-5px] w-2 h-2 rounded-full bg-teal-500" />
                            <h5 className="text-teal-300 font-bold mb-2">{item.heading}</h5>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Final Summary */}
                  <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                    <div className="flex items-center gap-3 mb-4 text-white">
                      <Quote className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-xl font-bold">{summary.overallSummary.title}</h4>
                    </div>
                    <p className="text-slate-300 leading-loose italic">
                      {summary.overallSummary.text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} سامانه هوشمند دفتر امام جمعه دهستان میانکاله</p>
      </footer>
    </div>
  );
}
