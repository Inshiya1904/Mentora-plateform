import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  lessonId: mongoose.Types.ObjectId;
  date: Date;
  topic: string;
  summary?: string;
   students: mongoose.Types.ObjectId[];
}

const sessionSchema = new Schema<ISession>(
{
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  topic: {
    type: String,
    required: true,
    trim: true
  },

  summary: {
    type: String,
   
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student"
    }
  ]
},
{ timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;