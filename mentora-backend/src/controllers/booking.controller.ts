import { Request, Response, NextFunction } from "express";
import { createBookingService } from "../services/booking.service.js";
import { createBookingSchema } from "../validators/booking.validator.js";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const user = (req as any).user;

    const validated = createBookingSchema.parse(req.body);

    const booking = await createBookingService(
      user,
      validated.studentId,
      validated.lessonId
    );

    res.status(201).json({
      message: "Lesson booked successfully",
      booking
    });

  } catch (error) {
    next(error);
  }

};