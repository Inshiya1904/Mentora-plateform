import { Request, Response, NextFunction } from "express";
import {
  createLessonService,
  getLessonsService,
  updateLessonService
} from "../services/lesson.service.js";
import { createLessonSchema } from "../validators/lesson.validator.js";


export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = (req as any).user;

    const validated = createLessonSchema.parse(req.body);

    const lesson = await createLessonService(
      user,
      validated.title,
      validated.description,
      validated.subject
    );

    res.status(201).json({
      message: "Lesson created successfully",
      lesson
    });

  } catch (error) {
    next(error);
  }

};


export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { subject, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const { lessons, totalLessons } = await getLessonsService(
      subject,
      pageNumber,
      limitNumber
    );

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalLessons,
      totalPages: Math.ceil(totalLessons / limitNumber),
      lessons
    });

  } catch (error) {
    next(error);
  }

};


export const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const lessonId = req.params.id as string;
    const user = (req as any).user;

    const lesson = await updateLessonService(user, lessonId, req.body);

    res.json({
      message: "Lesson updated successfully",
      lesson
    });

  } catch (error) {
    next(error);
  }

};