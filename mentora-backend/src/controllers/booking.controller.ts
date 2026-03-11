import { Request, Response } from "express";
import Booking from "../models/booking.model.js";
import Student from "../models/student.model.js";
import Lesson from "../models/lesson.model.js";
import mongoose from "mongoose";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { studentId, lessonId } = req.body;

    const user = (req as any).user;

    // role validation
    if (user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can create bookings",
      });
    }

    // input validation
    if (!studentId || !lessonId) {
      return res.status(400).json({
        message: "studentId and lessonId are required",
      });
    }

    // validate Mongo ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(lessonId)
    ) {
      return res.status(400).json({
        message: "Invalid studentId or lessonId",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // ensure student belongs to this parent
    if (student.parentId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized for this student",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const existingBooking = await Booking.findOne({
      studentId,
      lessonId,
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "Student already booked this lesson",
      });
    }

    const booking = await Booking.create({
      studentId,
      lessonId,
    });

    const populatedBooking = await booking.populate([
      { path: "studentId", select: "name" },
      { path: "lessonId", select: "title subject" },
    ]);

    res.status(201).json({
      message: "Lesson booked successfully",
      booking,
      populatedBooking
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
