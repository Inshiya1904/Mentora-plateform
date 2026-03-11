import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

router.post("/", protect, allowRoles("parent"), createBooking);

export default router;