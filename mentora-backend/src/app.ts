import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import llmRoutes from "./routes/llm.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan("dev"));

// CORS
app.use(cors());
// Body parser
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", sessionRoutes);
app.use("/llm", llmRoutes);


// Global error handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Mentora Backend Running");
});

export default app;