import { useEffect, useRef, useState } from "react";
import { format } from "date-fns-jalali";
import { Download } from "lucide-react";

interface ImageGeneratorProps {
  quote: string;
  type: "religious" | "political";
}

export default function ImageGenerator({ quote, type }: ImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    // Using raw github URL to avoid CORS issues
    img.src =
      "https://raw.githubusercontent.com/amirhossein-gandomkar/AISERMONANALYZER/a3bbbbbe683533ce44b9f00bbc618e66eabbc9f9/kh.png";

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Setup text styles
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.direction = "rtl";

      const scale = canvas.width / 1080;
      const blueBoxX = canvas.width - 150 * scale; // Right edge of text area
      const blueBoxY = canvas.height * 0.55; // Start Y
      const maxWidth = canvas.width - 300 * scale; // Width of text area

      // 1. Date
      const dateStr = `نماز جمعه ${format(new Date(), "dd MMMM yyyy")} دهستان میانکاله (زاغمرز)`;
      ctx.font = `bold ${30 * scale}px "B Nazanin", Tahoma, Arial`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4 * scale;
      ctx.strokeText(dateStr, blueBoxX, blueBoxY);
      ctx.fillText(dateStr, blueBoxX, blueBoxY);

      // 2. Imam Name
      const imamStr =
        "امام جمعه محترم دهستان میانکاله(زاغمرز) حجت الاسلام والمسلمین حاج حسین انزائی:";
      ctx.font = `bold ${45 * scale}px "B Nazanin", Tahoma, Arial`;
      const imamY = blueBoxY + 50 * scale;
      ctx.strokeText(imamStr, blueBoxX, imamY);
      ctx.fillText(imamStr, blueBoxX, imamY);

      // 3. Quote
      ctx.font = `bold ${50 * scale}px "B Titr", Tahoma, Arial`;
      ctx.fillStyle = "#ffff00"; // Yellow
      const quoteY = imamY + 80 * scale;

      wrapText(ctx, quote, blueBoxX, quoteY, maxWidth, 70 * scale);

      setIsReady(true);
    };

    img.onerror = (err) => {
      console.error("Failed to load image", err);
    };
  }, [quote]);

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.strokeText(line, x, currentY);
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.strokeText(line, x, currentY);
    ctx.fillText(line, x, currentY);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `khutbah_${type}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("خطایی در تولید تصویر رخ داد. لطفا از مرورگر دیگری استفاده کنید.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white">
        خطبه نگاشت {type === "religious" ? "مذهبی" : "سیاسی"}
      </h3>
      <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-2xl border border-slate-600">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain bg-slate-900"
        />
      </div>
      <button
        onClick={handleDownload}
        disabled={!isReady}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Download className="w-5 h-5" />
        دانلود تصویر
      </button>
    </div>
  );
}
