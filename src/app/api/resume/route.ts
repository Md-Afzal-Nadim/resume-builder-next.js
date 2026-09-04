import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";


// =====================
// GET USER RESUMES
// =====================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getCurrentUser();

    const resumes = await ResumeModel.find({
      user_id: userId,
    }).sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resumes fetched successfully",
        data: resumes,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching resumes:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Error fetching resumes",
      },
      {
        status: 500,
      }
    );
  }
}