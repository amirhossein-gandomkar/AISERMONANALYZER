import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SermonData } from "../types";

const createRTLParagraph = (
  text: string,
  bold: boolean = false,
  size: number = 28,
  color: string = "000000",
) => {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    bidirectional: true,
    children: [
      new TextRun({
        text,
        rightToLeft: true,
        font: "B Nazanin",
        size: size,
        bold: bold,
        color: color,
      }),
    ],
  });
};

export const exportToWord = async (data: SermonData) => {
  const introText =
    "به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبه های این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:";

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      children: [
        new TextRun({
          text: "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم",
          rightToLeft: true,
          font: "B Nazanin",
          size: 28,
          bold: true,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    createRTLParagraph(introText, false, 28),
    new Paragraph({ text: "" }),
    createRTLParagraph(data.impactfulTitle, true, 32, "1D4ED8"),
    new Paragraph({ text: "" }),
    createRTLParagraph(`خطبه اول: ${data.khutbah1.title}`, true, 30, "2563EB"),
  ];

  data.khutbah1.summary.forEach((item) => {
    children.push(
      createRTLParagraph(`- ${item.heading}: ${item.explanation}`, false, 28),
    );
  });

  children.push(new Paragraph({ text: "" }));
  children.push(
    createRTLParagraph(`خطبه دوم: ${data.khutbah2.title}`, true, 30, "059669"),
  );

  data.khutbah2.summary.forEach((item) => {
    children.push(
      createRTLParagraph(`- ${item.heading}: ${item.explanation}`, false, 28),
    );
  });

  children.push(new Paragraph({ text: "" }));
  children.push(
    createRTLParagraph(data.overallSummary.title, true, 30, "4F46E5"),
  );
  children.push(createRTLParagraph(data.overallSummary.text, false, 28));

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "khutbah_summary.docx";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Aggressive strategy to fix oklab/oklch issue
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = "800px";
  clone.style.padding = "40px";
  clone.style.background = "#ffffff";
  clone.style.color = "#000000";
  clone.style.direction = "rtl";
  clone.style.fontFamily = "Tahoma, Arial, sans-serif";

  // Remove tailwind classes that might cause issues and set inline styles
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.color = "#000000";
    htmlEl.style.background = "transparent";
    htmlEl.style.borderColor = "#cccccc";
    htmlEl.style.textShadow = "none";
    htmlEl.style.boxShadow = "none";
  });

  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("khutbah_summary.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("خطا در تولید فایل PDF");
  } finally {
    document.body.removeChild(clone);
  }
};
