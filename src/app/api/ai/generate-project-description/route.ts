import { generateAiContent } from "@/lib/gemini";
import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProjectDescriptionBody = await req.json();
    const { experienceLevel, jobTitle, techStack } = body;

    if (!experienceLevel  || !jobTitle || !techStack) {
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

Generate a professional, ATS-friendly project description based on the following details:

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}
Tech Stack Used: ${techStack}

Requirements:
- Write 3-4 bullet points describing a realistic project this candidate could have built
- Start each bullet with a strong action verb (e.g., "Developed", "Built", "Implemented", "Optimized", "Designed")
- Naturally incorporate the tech stack as keywords across the bullets
- Focus on functionality, features, and technical implementation appropriate to the experience level
- Use quantifiable impact language where realistic (e.g., "reduced load time", "improved performance") — do not invent fake specific numbers/metrics
- Keep each bullet point concise (1-2 lines, under 25 words)
- Use active voice and industry-standard terminology for ATS parsing
- Avoid generic filler phrases like "worked on a project" or "helped build"

Output format rules:
- Return ONLY the bullet points, one per line
- Start each line with "- " (hyphen space)
- No headers, no title, no explanation, no labels
- No quotation marks`;


   const result = await generateAiContent(prompt);

   const projectDescription = result;

   return NextResponse.json<ApiResponse>({
      success: true,
      message: "Project description generated successfully",
      data: {
        projectDescription
      }
    }, {
      status: 201
    })

  } catch (error) {
    console.error("Error generating project description:", error);
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
