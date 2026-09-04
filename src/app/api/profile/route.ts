import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User.model";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Cookie se token nikalo
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Token verify karo
    const decoded = verifyToken(token);

    // JWT se user ID nikalo
    const userId = decoded._userId;

    // MongoDB se user data lao
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in profile API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
}