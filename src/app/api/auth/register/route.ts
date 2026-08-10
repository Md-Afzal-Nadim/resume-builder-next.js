import { NextRequest, NextResponse } from "next/server";
import { RegisterBody } from "@/types/user.type";
import  connectDB  from "@/lib/mongodb";
import { ApiResponse } from "@/types/api.types";
import UserModel from "@/models/User.model";
import { generateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: RegisterBody = await req.json();
    const { name, email, password, mobile } = body;

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>({ 
        success: false,
        message: "Name, email and password are required" 
      }, { 
        status: 400 
      });
    }

    const isExistingUser = await UserModel.findOne({ email });
    if (isExistingUser) {
      return NextResponse.json<ApiResponse>({ 
        success: false,
        message: "User already exists" 
      }, { 
        status: 409 
      });
    }


    const newUser = await UserModel.create({ name, email, password, mobile });

    const token = generateToken({ _userId: newUser._id.toString() });

    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
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