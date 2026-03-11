import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  subject: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);

export default Lesson;
