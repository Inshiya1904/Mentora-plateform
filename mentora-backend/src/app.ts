import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import llmRoutes from "./routes/llm.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/bookings", bookingRoutes);
app.use("/", sessionRoutes);
app.use("/llm", llmRoutes);

app.get("/", (req, res) => {
  res.send("Mentora Backend Running");
});

export default app;