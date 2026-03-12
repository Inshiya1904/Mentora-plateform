import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI as string);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDB;