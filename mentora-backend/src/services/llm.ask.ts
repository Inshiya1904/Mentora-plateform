import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const askAI = async (question: string) => {

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. Give clear and detailed answers."
      },
      {
        role: "user",
        content: question
      }
    ],
    max_tokens: 500
  });

  return {
    answer: response.choices[0].message.content?.trim(),
    model: response.model
  };
};