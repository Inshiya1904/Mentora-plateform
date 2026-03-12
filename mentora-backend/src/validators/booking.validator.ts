import { z } from "zod";

export const createBookingSchema = z.object({
  studentId: z
    .string()
    .min(1, "studentId is required"),

  lessonId: z
    .string()
    .min(1, "lessonId is required")
});