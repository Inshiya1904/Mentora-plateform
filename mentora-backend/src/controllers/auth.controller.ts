import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const validated = signupSchema.parse(req.body);
    const { name, email, password, role } = validated;

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
    next(error);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;

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

    res.status(200).json({
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
    next(error);
  }
};


export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    next(error);
  }
};