import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  studentId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>(
{
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  }
},
{ timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;