import mongoose from "mongoose";
import Session from "../models/session.model.js";
import Lesson from "../models/lesson.model.js";
import Student from "../models/student.model.js";

export const createSessionService = async (
  user: any,
  lessonId: string,
  date: string,
  topic: string,
  summary?: string
) => {

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new Error("Invalid lessonId");
  }

  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // ownership validation
  if (lesson.mentorId.toString() !== user._id.toString()) {
    throw new Error("You cannot create sessions for this lesson");
  }

  return Session.create({
    lessonId,
    date,
    topic,
    summary
  });

};


export const getLessonSessionsService = async (lessonId: string) => {

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new Error("Invalid lessonId");
  }

  return Session
    .find({ lessonId })
    .sort({ date: 1 })
    .lean();

};


export const joinSessionService = async (
  user: any,
  studentId: string,
  sessionId: string
) => {

  const mongoSession = await mongoose.startSession();

  try {

    mongoSession.startTransaction();

    const student = await Student.findById(studentId)
      .session(mongoSession);

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.parentId.toString() !== user._id.toString()) {
      throw new Error("Not authorized for this student");
    }

    const session = await Session.findById(sessionId)
      .session(mongoSession);

    if (!session) {
      throw new Error("Session not found");
    }

    if (session.students?.includes(new mongoose.Types.ObjectId(studentId))) {
      throw new Error("Student already joined this session");
    }

    session.students = session.students || [];
    session.students.push(new mongoose.Types.ObjectId(studentId));

    await session.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return session;

  } catch (error) {

    await mongoSession.abortTransaction();
    mongoSession.endSession();

    throw error;

  }

};