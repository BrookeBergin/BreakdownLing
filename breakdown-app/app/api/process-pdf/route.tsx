export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    const prompt = `You will be given a research paper. Return ONLY raw json. Do not wrap in ''' or ''' json. Analyze the paper and return a valid JSON object with ONLY these keys: title, author, date, summary, litReview, researchQuestions, methodology, participants, findings, vocabulary, definitions, applications. Return ONLY valid JSON, no other text. For summary, give a general overview of the text using language that a non-expert can understand. For literature review, summarize the related work mentioned in the paper. For research questions, list the research questions or hypotheses proposed by the authors. For methodology, describe the methods used to conduct the research. For participants, provide details about the participants involved in the study. For findings, summarize the key findings of the research. For vocabulary, list any technical terms used in the paper and used in your output, and put the corresponding definitions in definitions. For applications, summarize ways this research could be applicable to practitioners, giving real-world examples of potential implementations. Throughout this, assume your reader is not a linguist, and speak with accessible language. Here is the research'

Paper content:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    const parsed = JSON.parse(output);

    const userId = formData.get("userId");

    await supabase.from("papers").insert({
      user_id: userId,
      title: parsed.title,
      summary: parsed,
    });

    return Response.json({ output: parsed });

  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: err.message || "Failed" },
      { status: 500 }
    );
  }
}