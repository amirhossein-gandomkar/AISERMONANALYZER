import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { SummaryResponse } from "./geminiService";

export const generateWordDocument = async (summary: SummaryResponse) => {
  const preamble = "بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم\nبه گزارش معاونت ارتباطات و رسانه دفتر امام جمعه دهستان میانکاله (زاغمرز)، حجت الاسلام والمسلمین حاج حسین انزائی در خطبههای این هفته از نماز جمعه، ضمن سفارش به تقوا اظهار کرد:";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            bidirectional: true,
            children: [
              new TextRun({
                text: summary.impactfulTitle,
                bold: true,
                size: 32, // 16pt
                font: "B Nazanin",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            bidirectional: true,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: preamble,
                size: 28, // 14pt
                font: "B Nazanin",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: summary.khutbah1.title,
                bold: true,
                size: 30, // 15pt
                font: "B Nazanin",
              }),
            ],
          }),
          ...summary.khutbah1.summary.map(
            (item) =>
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                bidirectional: true,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: item.heading + ": ",
                    bold: true,
                    size: 28, // 14pt
                    font: "B Nazanin",
                  }),
                  new TextRun({
                    text: item.explanation,
                    size: 28, // 14pt
                    font: "B Nazanin",
                  }),
                ],
              })
          ),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: summary.khutbah2.title,
                bold: true,
                size: 30, // 15pt
                font: "B Nazanin",
              }),
            ],
          }),
          ...summary.khutbah2.summary.map(
            (item) =>
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                bidirectional: true,
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: item.heading + ": ",
                    bold: true,
                    size: 28, // 14pt
                    font: "B Nazanin",
                  }),
                  new TextRun({
                    text: item.explanation,
                    size: 28, // 14pt
                    font: "B Nazanin",
                  }),
                ],
              })
          ),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: summary.overallSummary.title,
                bold: true,
                size: 30, // 15pt
                font: "B Nazanin",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            bidirectional: true,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: summary.overallSummary.text,
                size: 28, // 14pt
                font: "B Nazanin",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "خلاصه_خطبه.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
