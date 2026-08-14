import { generateAiContent } from "@/lib/gemini";
import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateExperienceDescriptionBody = await req.json();
    const { jobRole, experienceLevel, experienceYears, techStack } = body;

    if (!experienceLevel  || !jobRole || !techStack || !experienceYears) {
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

    

    const prompt = `You are an expert resume writer.

Generate a short professional experience description for the following profile:

Job Role: ${jobRole}
Experience Level: ${experienceLevel} (${experienceYears} years)
Tech Stack: ${techStack.join(", ")}

Requirements:
- Write 1 concise sentence (max 20-25 words) describing what this experience level typically means for this role
- Naturally reflect the tech stack context without just listing technologies
- Focus on responsibility level, autonomy, and typical scope of work
- Do NOT use generic filler like "hardworking", "passionate", "team player"

Output format rules:
- Return ONLY the single sentence description
- No labels, no quotation marks, no explanation`;


   const result = await generateAiContent(prompt);

   const ExperienceDescription = result;

   return NextResponse.json<ApiResponse>({
      success: true,
      message: "Experience description generated successfully",
      data: {
        ExperienceDescription
      }
    }, {
      status: 201
    })

  } catch (error) {
    console.error("Error generating experience description:", error);
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
