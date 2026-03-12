import { z } from "zod";

export const createSessionSchema = z.object({
  lessonId: z
    .string()
    .min(1, "lessonId is required"),

  date: z
    .string()
    .min(1, "date is required"),

  topic: z
    .string()
    .min(2, "topic must be at least 2 characters"),

  summary: z
    .string()
    .optional()
});

export const joinSessionSchema = z.object({
  studentId: z
    .string()
    .min(1, "studentId is required")
});