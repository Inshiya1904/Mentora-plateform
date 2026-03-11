import { Router } from "express";
import { createLesson, getLessons, updateLesson } from "../controllers/lesson.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", protect, allowRoles("mentor"), createLesson);

router.get("/", protect, getLessons);

router.patch(
  "/:id",
  protect,
  allowRoles("mentor"),
  updateLesson
);

export default router;