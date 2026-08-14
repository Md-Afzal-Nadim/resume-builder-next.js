import { generateAiContent } from "@/lib/gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ImproveContentBody = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Content is required",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `You are an expert resume writer specializing in ATS-optimized content.

Improve the following resume content to make it more professional, impactful, and ATS-friendly:

Original Content:
"""
${content}
"""

Requirements:
- Preserve the original meaning and factual information — do NOT invent new facts, numbers, technologies, or achievements not present in the original
- Replace weak or passive phrasing with strong action verbs (e.g., "Developed", "Led", "Optimized", "Implemented")
- Improve clarity, conciseness, and professional tone
- Use industry-standard keywords and terminology relevant to the content for better ATS parsing
- Fix any grammar, spelling, or punctuation issues
- Remove filler words and generic phrases (e.g., "responsible for", "worked on", "helped with")
- Maintain the same format as the original (if it's a single sentence, keep it a sentence; if it's bullet points, keep it as bullet points)
- Keep roughly the same length — do NOT significantly expand or shrink the content

Output format rules:
- Return ONLY the improved content
- No labels like "Improved Content:", no explanation, no notes
- No quotation marks wrapping the output
- If the input was bullet points, return bullet points in the same "- " format`;

      const result = await generateAiContent(prompt);

      const contentImproved = result;

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Content improved successfully",
          data: { contentImproved },
        },
        {
          status: 201,
        },
      );


  } catch (error) {
    console.error("Error improving content:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
