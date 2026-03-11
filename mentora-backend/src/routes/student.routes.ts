import { Router } from "express";
import { createStudent, getStudents } from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createStudent);
router.get("/", protect, getStudents);

export default router;