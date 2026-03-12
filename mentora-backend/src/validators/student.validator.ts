import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().positive("Age must be positive"),
  standard: z.number().positive("Standard must be positive")
});