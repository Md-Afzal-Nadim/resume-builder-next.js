import { generateAiContent } from "@/lib/gemini";
import { GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSummaryBody = await req.json();
    const { experienceLevel, skills, jobTitle } = body;

    if (!experienceLevel || !skills || !jobTitle) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `You are an expert resume writer specializing in ATS-optimized content.

     Generate a professional, ATS-friendly resume summary (3-4 sentences, 50-80 words) based on the following details:
     
     Job Title: ${jobTitle}
     Experience Level: ${experienceLevel}
     Skills: ${skills}

     Requirements:
     - Start with a strong professional identifier (e.g., "Results-driven ${jobTitle}...")
     - Naturally incorporate the listed skills as keywords (avoid keyword stuffing)
     - Use quantifiable impact language where appropriate (e.g., "improved", "led", "delivered") — do not invent specific numbers/metrics not provided
     - Write in third person implied (no "I" or "my")
     - Use active voice and industry-standard terminology for better ATS parsing
     - Avoid buzzwords like "hardworking", "team player", "detail-oriented" unless directly tied to a skill
     - Keep formatting plain text — no bullet points, no headers, no markdown

     Output rules:
     - Return ONLY the summary text
     - No preamble, no explanation, no labels like "Summary:", no quotation marks
      - No follow-up questions or notes after the summary`;

      const result = await generateAiContent(prompt);

      const summary = result;

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Summary generated successfully",
          data: { summary },
        },
        {
          status: 201,
        },
      );


  } catch (error) {
    console.error("Error in Genarate summary api", error);
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
