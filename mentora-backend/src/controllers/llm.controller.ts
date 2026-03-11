import { Request, Response } from "express";
import { summarizeText } from "../services/llm.summary.js";
import { askAI } from "../services/llm.ask.js";

export const summarize = async (req: Request, res: Response) => {

  try {

    const { text } = req.body;

    // validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: "Text is required"
      });
    }

    if (text.length < 50) {
      return res.status(400).json({
        message: "Text must be at least 50 characters"
      });
    }

    if (text.length > 10000) {
      return res.status(413).json({
        message: "Text too large"
      });
    }

    const result = await summarizeText(text);

    res.status(201).json({
      summary: result.summary,
      model: result.model
    });

  } catch (error) {

    console.error("LLM error:", error);

    res.status(502).json({
      message: "LLM service failed"
    });

  }

};


export const askQuestion = async (req: Request, res: Response) => {

  try {

    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    const result = await askAI(question);

    res.status(201).json({
      answer: result.answer,
      model: result.model
    });

  } catch (error) {

    console.error("AI error:", error);

    res.status(500).json({
      message: "AI service failed"
    });

  }
};