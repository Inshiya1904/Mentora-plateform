import Student from "../models/student.model.js";

export const createStudentService = async (
  user: any,
  name: string,
  age: number,
  standard: number
) => {

  if (user.role !== "parent") {
    throw new Error("Only parents can create students");
  }

  if (!name || !age || !standard) {
    throw new Error("Name, age and standard are required");
  }

  if (age <= 0 || standard <= 0) {
    throw new Error("Age and standard must be valid numbers");
  }

  return Student.create({
    name: name.trim(),
    age,
    standard,
    parentId: user._id
  });

};


export const getStudentsService = async (user: any) => {

  if (user.role !== "parent") {
    throw new Error("Only parents can view students");
  }

  return Student
    .find({ parentId: user._id })
    .sort({ createdAt: -1 })
    .lean();

};