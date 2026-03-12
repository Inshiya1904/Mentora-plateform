import { Request, Response, NextFunction } from "express";
import {
  createSessionService,
  getLessonSessionsService,
  joinSessionService
} from "../services/session.service.js";
import {
  createSessionSchema,
  joinSessionSchema
} from "../validators/session.validator.js";


export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = (req as any).user;

    if (user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can create sessions"
      });
    }

    const validated = createSessionSchema.parse(req.body);

    const session = await createSessionService(
      user,
      validated.lessonId,
      validated.date,
      validated.topic,
      validated.summary
    );

    res.status(201).json({
      message: "Session created successfully",
      session
    });

  } catch (error) {
    next(error);
  }

};


export const getLessonSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const lessonId = req.params.id as string;

    const sessions = await getLessonSessionsService(lessonId);

    res.json({
      count: sessions.length,
      sessions
    });

  } catch (error) {
    next(error);
  }

};


export const joinSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const sessionId = req.params.id as string;
    const user = (req as any).user;

    if (user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can join sessions"
      });
    }

    const validated = joinSessionSchema.parse(req.body);

    const session = await joinSessionService(
      user,
      validated.studentId,
      sessionId 
    );

    res.status(201).json({
      message: "Student joined session successfully",
      session
    });

  } catch (error) {
    next(error);
  }

};