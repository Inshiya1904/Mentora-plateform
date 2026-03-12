import { Request, Response, NextFunction } from "express";
import {
  createStudentService,
  getStudentsService
} from "../services/student.service.js";
import { createStudentSchema } from "../validators/student.validator.js";


export const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = (req as any).user;

    const validated = createStudentSchema.parse(req.body);

    const student = await createStudentService(
      user,
      validated.name,
      validated.age,
      validated.standard
    );

    res.status(201).json({
      message: "Student created successfully",
      student
    });

  } catch (error) {
    next(error);
  }

};


export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = (req as any).user;

    const students = await getStudentsService(user);

    res.json({
      count: students.length,
      students
    });

  } catch (error) {
    next(error);
  }

};