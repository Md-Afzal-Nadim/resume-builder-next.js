import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import ResumeModel from "@/models/Resume.model";
import { ApiResponse } from "@/types/api.types";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getCurrentUser();

    const newResume = await ResumeModel.create({
       user_id: userId ,
       title: "",
       summary: "",
       personalDetails: {},
       workExperience: [],
       projects: [],
       skills: [],
       education: [],
       certificates: [],
    });
      
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Resume created successfully",
      data: newResume
    }, {
      status: 201
    })

  }catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Error creating resume",
    }, {
      status: 500
    })
    
  }
}