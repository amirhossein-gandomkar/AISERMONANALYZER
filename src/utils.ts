import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { SummaryResponse } from "./services/gemini";

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
                size: 28, // 14pt * 2
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
