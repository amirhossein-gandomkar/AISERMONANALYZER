import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface SummarizerFormProps {
  onSubmit: (khutbah1: string, khutbah2: string) => void;
  isLoading: boolean;
}

export default function SummarizerForm({
  onSubmit,
  isLoading,
}: SummarizerFormProps) {
  const [khutbah1, setKhutbah1] = useState("");
  const [khutbah2, setKhutbah2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!khutbah1.trim() || !khutbah2.trim()) {
      alert("لطفا متن هر دو خطبه را وارد کنید.");
      return;
    }
    onSubmit(khutbah1, khutbah2);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-lg font-bold text-blue-400" dir="rtl">
            متن خطبه اول (مذهبی/اخلاقی)
          </label>
          <textarea
            dir="rtl"
            value={khutbah1}
            onChange={(e) => setKhutbah1(e.target.value)}
            placeholder="متن خطبه اول را اینجا قرار دهید..."
            className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none shadow-inner"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-lg font-bold text-emerald-400" dir="rtl">
            متن خطبه دوم (سیاسی/اجتماعی)
          </label>
          <textarea
            dir="rtl"
            value={khutbah2}
            onChange={(e) => setKhutbah2(e.target.value)}
            placeholder="متن خطبه دوم را اینجا قرار دهید..."
            className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
          )}
          <span>
            {isLoading ? "در حال پردازش..." : "خلاصه سازی با هوش مصنوعی"}
          </span>
        </button>
      </div>
    </form>
  );
}
