import { Request, Response } from "express";
import Student from "../models/student.model.js";


// CREATE STUDENT
export const createStudent = async (req: Request, res: Response) => {

  try {

    const { name, age, standard } = req.body;
    const user = (req as any).user;

    if (user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can create students"
      });
    }

    if (!name || !age || !standard) {
      return res.status(400).json({
        message: "Name, age and standard are required"
      });
    }

    if (age <= 0 || standard <= 0) {
      return res.status(400).json({
        message: "Age and standard must be valid numbers"
      });
    }

    const student = await Student.create({
      name: name.trim(),
      age,
      standard,
      parentId: user._id
    });

    res.status(201).json({
      message: "Student created successfully",
      student
    });

  } catch (error) {

    console.error("Create student error:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }

};


// GET STUDENTS
export const getStudents = async (req: Request, res: Response) => {

  try {

    const user = (req as any).user;

    if (user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can view students"
      });
    }

    const students = await Student
      .find({ parentId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.status(201).json({
      count: students.length,
      students
    });

  } catch (error) {

    console.error("Get students error:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }

};