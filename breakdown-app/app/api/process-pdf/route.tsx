export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (err) => {
      if ('parserError' in err) {
        reject(err.parserError);
      } else {
        reject(err);
      }
    });

    parser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) => t.R[0].T).join(" ")
      ).join("\n");

      resolve(text);
    });

    parser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parsePDF(buffer);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent(`
Summarize and structure this document:

${text}
    `);

    const response = await result.response;
    const output = response.text();

    return Response.json({ output });

  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  }
}