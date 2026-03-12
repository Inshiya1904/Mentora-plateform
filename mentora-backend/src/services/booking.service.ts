import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Student from "../models/student.model.js";
import Lesson from "../models/lesson.model.js";

export const createBookingService = async (
  user: any,
  studentId: string,
  lessonId: string
) => {

  const session = await mongoose.startSession();

  try {

    session.startTransaction();

    const student = await Student.findById(studentId).session(session);

    if (!student) {
      throw new Error("Student not found");
    }

    if (student.parentId.toString() !== user._id.toString()) {
      throw new Error("Not authorized for this student");
    }

    const lesson = await Lesson.findById(lessonId).session(session);

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const existingBooking = await Booking.findOne({
      studentId,
      lessonId
    }).session(session);

    if (existingBooking) {
      throw new Error("Student already booked this lesson");
    }

    const booking = await Booking.create([{
      studentId,
      lessonId
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return booking[0];

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    throw error;

  }

};