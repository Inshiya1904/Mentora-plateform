import { Request, Response } from "express";
import Lesson from "../models/lesson.model.js";


// CREATE LESSON
export const createLesson = async (req: Request, res: Response) => {
  try {

    const { title, description, subject } = req.body;

    const user = (req as any).user;

    // role validation
    if (user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can create lessons"
      });
    }

    // input validation
    if (!title || !description || !subject) {
      return res.status(400).json({
        message: "Title, subject and description are required"
      });
    }

    const lesson = await Lesson.create({
      title,
      description,
      subject,
      mentorId: user._id
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson
    });

  } catch (error) {

    console.error("Create lesson error:", error);

    res.status(500).json({
      message: "Internal server error"
    });

  }
};



// GET LESSONS
// export const getLessons = async (req: Request, res: Response) => {

//   try {

//     const { subject } = req.query;

//     const filter: Record<string, any> = {};

//     if (subject) {
//       filter.subject = { $regex: subject, $options: "i" };
//     }

//     const lessons = await Lesson
//       .find(filter)
//       .populate("mentorId", "name email")
//       .sort({ createdAt: -1 });

//     res.json({
//       count: lessons.length,
//       lessons
//     });

//   } catch (error) {

//     console.error("Get lessons error:", error);

//     res.status(500).json({
//       message: "Internal server error"
//     });

//   }

// };


export const getLessons = async (req: Request, res: Response) => {
  try {

    const { subject, page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const filter: Record<string, any> = {};

    if (subject) {
      filter.subject = { $regex: subject, $options: "i" };
    }

    const totalLessons = await Lesson.countDocuments(filter);

    const lessons = await Lesson.find(filter)
      .populate("mentorId", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(201).json({
      page: pageNumber,
      limit: limitNumber,
      total: totalLessons,
      totalPages: Math.ceil(totalLessons / limitNumber),
      lessons
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const updateLesson = async (req: Request, res: Response) => {

  try {

    const lessonId = req.params.id;
    const user = (req as any).user;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found"
      });
    }

    if (lesson.mentorId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "You cannot update this lesson"
      });
    }

    const { title, description, subject } = req.body;

    if (title) lesson.title = title;
    if (description) lesson.description = description;
    if (subject) lesson.subject = subject;

    await lesson.save();

    res.status(201).json({
      message: "Lesson updated successfully",
      lesson
    });

  } catch (error) {

    res.status(500).json({
      message: "Internal server error"
    });

  }

};