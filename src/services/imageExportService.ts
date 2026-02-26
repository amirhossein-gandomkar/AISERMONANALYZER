import moment from "jalali-moment";

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
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

export const generateKhutbahNegasht = async (
  quote: string,
  type: "religious" | "political"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context not found"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const scale = canvas.width / 1000;
      ctx.direction = "rtl";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Date
      const dateStr = `نماز جمعه ${moment().locale("fa").format("DD MMMM YYYY")} دهستان میانکاله (زاغمرز)`;
      ctx.font = `bold ${10 * scale * 2}px 'B Nazanin', Tahoma, Arial`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3 * scale;
      ctx.strokeText(dateStr, canvas.width / 2, canvas.height * 0.75);
      ctx.fillText(dateStr, canvas.width / 2, canvas.height * 0.75);

      // Imam Name
      const imamStr = "امام جمعه محترم دهستان میانکاله(زاغمرز) حجت الاسلام والمسلمین حاج حسین انزائی:";
      ctx.font = `bold ${15 * scale * 2}px 'B Nazanin', Tahoma, Arial`;
      ctx.strokeText(imamStr, canvas.width / 2, canvas.height * 0.75 + 30 * scale * 2);
      ctx.fillText(imamStr, canvas.width / 2, canvas.height * 0.75 + 30 * scale * 2);

      // Quote
      ctx.font = `bold ${15.5 * scale * 2}px 'B Titr', Tahoma, Arial`;
      ctx.fillStyle = "yellow";
      const quoteY = canvas.height * 0.75 + 70 * scale * 2;
      wrapText(ctx, `«${quote}»`, canvas.width / 2, quoteY, canvas.width * 0.8, 25 * scale * 2);

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => {
      console.error("Image load error", err);
      reject(new Error("Failed to load background image."));
    };
    img.src = "https://raw.githubusercontent.com/amirhossein-gandomkar/AISERMONANALYZER/a3bbbbbe683533ce44b9f00bbc618e66eabbc9f9/kh.png";
  });
};
