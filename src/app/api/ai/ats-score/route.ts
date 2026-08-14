import { generateAiContent } from "@/lib/gemini";
import { ResumeAtsBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ResumeAtsBody = await req.json();
    const { resumeText } = body;

    if (!resumeText) {
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
     

    
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and professional resume reviewer.

Analyze the following resume text and evaluate how well it would perform against an ATS system:

Resume Text:
"""
${resumeText}
"""

Evaluate based on:
- Formatting compatibility (no complex tables, columns, graphics that break ATS parsing)
- Use of standard section headings (e.g., Experience, Education, Skills)
- Keyword relevance and density for the likely target role
- Use of strong action verbs and quantifiable achievements
- Clarity, conciseness, and grammar
- Presence of contact information and essential sections
- Avoidance of generic filler phrases (e.g., "hardworking", "team player")

Output format rules:
- Return ONLY a valid JSON object, no markdown code blocks, no explanation, no extra text
- Follow this exact structure:

{
  "atsScore": <number between 0-100>,
  "scoreLabel": "<'Poor' | 'Needs Improvement' | 'Good' | 'Excellent'>",
  "strengths": ["<short strength point>", "..."],
  "weaknesses": ["<short weakness point>", "..."],
  "suggestions": ["<specific actionable improvement>", "..."],
  "missingKeywords": ["<relevant keyword likely missing>", "..."]
}

- "strengths" and "weaknesses": 2-4 items each, concise (max 15 words per item)
- "suggestions": 3-5 specific, actionable items
- "missingKeywords": 3-8 relevant technical/industry keywords that would strengthen ATS matching, based on the resume's apparent target role
- Do NOT invent facts about the candidate — base analysis only on the given text`;
          


      const result = await generateAiContent(prompt);

      const  AtsScore = result;

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "ATS Score generated successfully",
          data: { AtsScore },
        },
        {
          status: 201,
        },
      );


  } catch (error) {
    console.error("Error generating ATS score :", error);
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
