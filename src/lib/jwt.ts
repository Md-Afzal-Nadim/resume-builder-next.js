import jwt from "jsonwebtoken";
import { JWTPayload } from "@/types/user.type";

export const generateToken = (payload:JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};


export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!)
}