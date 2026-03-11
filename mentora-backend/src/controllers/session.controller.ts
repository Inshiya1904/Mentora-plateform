import { Request, Response } from "express";
import mongoose from "mongoose";
import Session from "../models/session.model.js";
import Lesson from "../models/lesson.model.js";
import Student from "../models/student.model.js";

// CREATE SESSION
export const createSession = async (req: Request, res: Response) => {
  try {
    const { lessonId, date, topic, summary } = req.body;
    const user = (req as any).user;

    // role validation
    if (user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can create sessions",
      });
    }

    // input validation
    if (!lessonId || !date || !topic) {
      return res.status(400).json({
        message: "lessonId, date and topic are required",
      });
    }

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        message: "Invalid lessonId",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    // ensure mentor owns this lesson
    if (lesson.mentorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You cannot create sessions for this lesson",
      });
    }

    const session = await Session.create({
      lessonId,
      date,
      topic,
      summary,
    });

    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Create session error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET SESSIONS FOR A LESSON
export const getLessonSessions = async (req: Request, res: Response) => {
  try {
    const lessonId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        message: "Invalid lessonId",
      });
    }

    const sessions = await Session.find({ lessonId }).sort({ date: 1 }).lean();

    res.status(201).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// student join session

export const joinSession = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const sessionId = req.params.id as string;
    const user = (req as any).user;

    // role validation
    if (user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can join sessions for students",
      });
    }

    // basic validation
    if (!studentId) {
      return res.status(400).json({
        message: "studentId is required",
      });
    }

    // validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(sessionId)
    ) {
      return res.status(400).json({
        message: "Invalid studentId or sessionId",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ensure student belongs to parent
    if (student.parentId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized for this student",
      });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // optional: prevent duplicate join
    if (session.students?.includes(studentId)) {
      return res.status(409).json({
        message: "Student already joined this session",
      });
    }

    // add student to session
    session.students = session.students || [];
    session.students.push(studentId);

    await session.save();

    // populate session and student
    const populatedSession = await Session.findById(sessionId)
      .populate("lessonId", "title subject")
      .populate("students", "name standard");


    res.status(201).json({
      message: "Student joined session successfully",
      session: populatedSession
    });
  } catch (error) {
    console.error("Join session error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
