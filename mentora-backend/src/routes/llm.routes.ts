import { Router } from "express";
import { askQuestion, summarize } from "../controllers/llm.controller.js";
import { llmLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Long text → short summary
router.post("/summarize", llmLimiter, summarize);

// Question → detailed answer
router.post("/ask",llmLimiter, askQuestion);

export default router;