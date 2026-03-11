import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  age: number;
  standard: number;
  parentId: mongoose.Types.ObjectId;
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },
    standard: {
      type: Number,
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
