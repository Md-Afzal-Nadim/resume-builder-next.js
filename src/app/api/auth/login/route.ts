import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import UserModel from "@/models/User.model"
import { generateToken } from "@/lib/jwt"
import { LoginBody } from "@/types/user.type"
import { ApiResponse } from "@/types/api.types"



export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: LoginBody = await req.json();
    const { email, password, mobile } = body;

    if ( !mobile || !email || !password) {
      return NextResponse.json<ApiResponse>({ 
        success: false,
        message: "Mobile number, email and password are required" 
      }, { 
        status: 400 
      });
    }

    const isExistingUser = await UserModel.findOne({ email, mobile });
    if (!isExistingUser) {
      return NextResponse.json<ApiResponse>({ 
        success: false,
        message: "User not found" 
      }, { 
        status: 404
      });
    }

    const matchpassword=isExistingUser.comparePassword(password);
    if (!matchpassword) {
      return NextResponse.json<ApiResponse>({ 
        success: false,
        message: "Invalid credentials" 
      }, { 
        status: 401 
      });
    }

    const token = generateToken({ _userId: isExistingUser._id.toString() });

    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          _id: isExistingUser._id,
          name: isExistingUser.name,
          email: isExistingUser.email,
          mobile: isExistingUser.mobile,
        },
        
      },
    }, {
      status: 201,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite:'lax',
      maxAge: 60 * 60 * 1000
    })

    return response


  } catch (error) {
    console.log("error in register api",error);
    return NextResponse.json<ApiResponse>({ 
      success: false,
      message: "Something went wrong" , error: { error }
    }, { 
      status: 500 
    });
    
  }
}