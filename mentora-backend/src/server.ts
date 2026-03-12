
import "dotenv/config"
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

console.log("ENV TEST:", env.OPENAI_API_KEY);
console.log("ENV TEST:", env.GROQ_API_KEY);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});