import { generateAiContent } from "@/lib/gemini";
import { GenerateSkillsBody} from "@/types/ai.types";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateSkillsBody = await req.json();
    const { experienceLevel, jobTitle } = body;

    if (!experienceLevel  || !jobTitle) {
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

    

     const prompt = `You are an expert technical recruiter and resume writer.

Generate a list of relevant technical skills for the following profile:

Job Title: ${jobTitle}
Experience Level: ${experienceLevel}


Requirements:
- Return ONLY technical/hard skills (programming languages, frameworks, tools, platforms, databases, technologies)
- Do NOT include soft skills (e.g., "communication", "teamwork", "leadership", "problem-solving")
- Do NOT include generic terms — be specific (e.g., "React.js" not just "Frontend")
- Skills should be relevant and realistic for the given job title and experience level
- Generate 8-12 skills, ordered from most relevant/core to least
- Include a healthy mix of: languages, frameworks/libraries, tools, and platforms/databases relevant to the role

Output format rules:
- Return ONLY a comma-separated list of skills
- No numbering, no bullet points, no headers, no explanation
- No quotation marks around individual skills
- Example output format: "React, Redux Toolkit, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, REST APIs, Git, Docker"`;

   const result = await generateAiContent(prompt);

   const skills = result;

   return NextResponse.json<ApiResponse>({
      success: true,
      message: "Skills generated successfully",
      data: {
        skills
      }
    }, {
      status: 201
    })

  } catch (error) {
    console.error("Error generating skills:", error);
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
