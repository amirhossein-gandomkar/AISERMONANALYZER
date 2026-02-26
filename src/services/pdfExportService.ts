import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SummaryResponse } from "./geminiService";

export const generatePdfDocument = async (summary: SummaryResponse) => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.padding = "40px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000";
  container.style.fontFamily = "'B Nazanin', Tahoma, Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.textAlign = "justify";
  container.style.lineHeight = "2";
  container.style.fontSize = "18px";

  const preamble = "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم<br/>به گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبههای این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:";

  let htmlContent = `
    <h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">${summary.impactfulTitle}</h1>
    <p style="margin-bottom: 20px;">${preamble}</p>
    
    <h2 style="text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; margin-bottom: 15px;">${summary.khutbah1.title}</h2>
  `;

  summary.khutbah1.summary.forEach((item) => {
    htmlContent += `<p style="margin-bottom: 10px;"><strong>${item.heading}:</strong> ${item.explanation}</p>`;
  });

  htmlContent += `<h2 style="text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; margin-bottom: 15px;">${summary.khutbah2.title}</h2>`;

  summary.khutbah2.summary.forEach((item) => {
    htmlContent += `<p style="margin-bottom: 10px;"><strong>${item.heading}:</strong> ${item.explanation}</p>`;
  });

  htmlContent += `
    <h2 style="text-align: right; font-size: 20px; font-weight: bold; margin-top: 30px; margin-bottom: 15px;">${summary.overallSummary.title}</h2>
    <p style="margin-bottom: 10px;">${summary.overallSummary.text}</p>
  `;

  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("خلاصه_خطبه.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
};
