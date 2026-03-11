import { Router } from "express";
import { createSession, getLessonSessions, joinSession } from "../controllers/session.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/sessions", protect, allowRoles("mentor"), createSession);

router.get("/lessons/:id/sessions", protect, getLessonSessions);

router.post("/sessions/:id/join", protect, joinSession);

export default router;