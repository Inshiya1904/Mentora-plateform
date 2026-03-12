import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET",
  "GROQ_API_KEY"
];

requiredEnv.forEach((key) => {

  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }

});

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY
};