import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { SummaryResponse } from "./services/gemini";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToWord(summary: SummaryResponse) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم",
                font: "B Nazanin",
                size: 28,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: "به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه‌های این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:",
                font: "B Nazanin",
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: summary.impactfulTitle,
                font: "B Nazanin",
                size: 32,
                bold: true,
                color: "2563eb",
              }),
            ],
            spacing: { before: 400, after: 200 },
          }),
          
          // Khutbah 1
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `خطبه اول: ${summary.khutbah1.title}`,
                font: "B Nazanin",
                size: 28,
                bold: true,
              }),
            ],
            spacing: { before: 200 },
          }),
          ...summary.khutbah1.summary.flatMap(s => [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: s.heading,
                  font: "B Nazanin",
                  size: 28,
                  bold: true,
                }),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: s.explanation,
                  font: "B Nazanin",
                  size: 28,
                }),
              ],
            }),
          ]),

          // Khutbah 2
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `خطبه دوم: ${summary.khutbah2.title}`,
                font: "B Nazanin",
                size: 28,
                bold: true,
              }),
            ],
            spacing: { before: 400 },
          }),
          ...summary.khutbah2.summary.flatMap(s => [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: s.heading,
                  font: "B Nazanin",
                  size: 28,
                  bold: true,
                }),
              ],
              spacing: { before: 100 },
            }),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: s.explanation,
                  font: "B Nazanin",
                  size: 28,
                }),
              ],
            }),
          ]),

          // Overall Summary
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: summary.overallSummary.title,
                font: "B Nazanin",
                size: 28,
                bold: true,
              }),
            ],
            spacing: { before: 400 },
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: summary.overallSummary.text,
                font: "B Nazanin",
                size: 28,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Khutbah_Summary.docx");
}

export async function exportToImage(elementId: string, fileName: string = "Khutbah_Negasht.png") {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Wait a bit to ensure image is rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: true, // Enable logging to help debug
    });

    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imgData;
    link.click();
  } catch (error) {
    console.error("Image Export Error:", error);
    alert("خطایی در تولید تصویر رخ داد. لطفاً مطمئن شوید تصویر پس‌زمینه به درستی بارگذاری شده است.");
  }
}

export async function exportToPDF(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const buttons = element.querySelector('.export-buttons') as HTMLElement;
  const originalDisplay = buttons ? buttons.style.display : '';

  try {
    // Hide buttons during capture
    if (buttons) buttons.style.display = 'none';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#121215",
      logging: false,
      onclone: (clonedDoc) => {
        // 1. Remove all original style tags that might contain oklch/oklab
        const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(s => s.remove());

        // 2. Add a very basic, safe stylesheet for the PDF
        const safeStyle = clonedDoc.createElement('style');
        safeStyle.innerHTML = `
          * { 
            box-sizing: border-box; 
            font-family: sans-serif !important;
            color-scheme: dark;
          }
          body { background-color: #0a0a0c; color: #cbd5e1; direction: rtl; }
          #${elementId} { 
            background-color: #121215 !important; 
            color: #cbd5e1 !important; 
            padding: 40px !important;
            border-radius: 0 !important;
            width: 800px !important;
            display: block !important;
          }
          h2, h3, h4, h5 { color: #ffffff !important; font-weight: bold !important; }
          .text-emerald-400, .text-emerald-500, .text-emerald-300 { color: #10b981 !important; }
          .text-teal-400, .text-teal-500, .text-teal-300 { color: #14b8a6 !important; }
          .bg-emerald-500\\/10 { background-color: rgba(16, 185, 129, 0.1) !important; }
          .bg-teal-500\\/10 { background-color: rgba(20, 184, 166, 0.1) !important; }
          .border-emerald-500\\/20 { border-color: rgba(16, 185, 129, 0.2) !important; }
          .border-teal-500\\/20 { border-color: rgba(20, 184, 166, 0.2) !important; }
          .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
          .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
          .pr-6 { padding-right: 1.5rem !important; }
          .border-r { border-right-width: 1px !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .mb-12 { margin-bottom: 3rem !important; }
          .grid { display: block !important; }
          .md\\:grid-cols-2 { display: block !important; }
          .space-y-6 > * + * { margin-top: 1.5rem !important; }
          .space-y-10 > * + * { margin-top: 2.5rem !important; }
          .leading-relaxed { line-height: 1.625 !important; }
          .text-center { text-align: center !important; }
          .font-bold { font-weight: 700 !important; }
          .text-3xl { font-size: 1.875rem !important; }
          .text-4xl { font-size: 2.25rem !important; }
          .text-lg { font-size: 1.125rem !important; }
          .text-sm { font-size: 0.875rem !important; }
          .export-buttons { display: none !important; }
        `;
        clonedDoc.head.appendChild(safeStyle);

        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.display = 'block';
          clonedElement.style.position = 'relative';
          clonedElement.style.top = '0';
          clonedElement.style.left = '0';
          clonedElement.style.margin = '0';
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Khutbah_Summary.pdf");
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("خطایی در تولید فایل PDF رخ داد. این مشکل معمولاً به دلیل ناسازگاری استایل‌های مدرن با خروجی PDF است. لطفاً از دکمه Word استفاده کنید یا متن را کپی کنید.");
  } finally {
    // Always restore buttons
    if (buttons) buttons.style.display = originalDisplay;
  }
}
