
import "dotenv/config"
import app from "./app.js";
import connectDB from "./config/db.js";

console.log("ENV TEST:", process.env.OPENAI_API_KEY);
console.log("ENV TEST:", process.env.GROQ_API_KEY);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});