import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import validator from "validator";

const JWT_SECRET = process.env.JWT_SECRET as string;


// Generate JWT
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d"
  });
};

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6+ chars" });
    }

    if (!["parent", "mentor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};


// LOGIN
export const login = async (req: Request, res: Response) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }
};


// GET CURRENT USER
export const getMe = async (req: Request, res: Response) => {

  try {

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal server error"
    });

  }

};