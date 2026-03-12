import Lesson from "../models/lesson.model.js";

export const createLessonService = async (
  user: any,
  title: string,
  description: string,
  subject: string
) => {

  if (user.role !== "mentor") {
    throw new Error("Only mentors can create lessons");
  }

  if (!title || !description || !subject) {
    throw new Error("Title, subject and description are required");
  }

  return Lesson.create({
    title,
    description,
    subject,
    mentorId: user._id
  });

};


export const getLessonsService = async (
  subject: any,
  page: number,
  limit: number
) => {

  const filter: Record<string, any> = {};

  if (subject) {
    filter.subject = { $regex: subject, $options: "i" };
  }

  const totalLessons = await Lesson.countDocuments(filter);

  const lessons = await Lesson.find(filter)
    .populate("mentorId", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    lessons,
    totalLessons
  };

};


export const updateLessonService = async (
  user: any,
  lessonId: string,
  data: any
) => {

  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.mentorId.toString() !== user._id.toString()) {
    throw new Error("You cannot update this lesson");
  }

  if (data.title) lesson.title = data.title;
  if (data.description) lesson.description = data.description;
  if (data.subject) lesson.subject = data.subject;

  await lesson.save();

  return lesson;

};