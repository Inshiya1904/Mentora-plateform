import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (userId: string) => {

  const secret = env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: "7d" }
  );

};