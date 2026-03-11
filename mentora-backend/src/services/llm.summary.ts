import Groq from "groq-sdk";

// used Groq + Llama model 
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const summarizeText = async (text: string) => {

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Summarize the following text into 3-6 SHORT bullet points and should not repeat the original sentences."
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  return {
    summary: response.choices[0].message.content?.trim(),
    model: response.model
  };
};


// no credit available to use openai api
// import OpenAI from "openai";

// const apiKey = process.env.OPENAI_API_KEY;

// if (!apiKey) {
//   throw new Error("OPENAI_API_KEY is missing in environment variables");
// }

// const client = new OpenAI({
//   apiKey
// });

// export const summarizeText = async (text: string) => {

//   const response = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: "Summarize the following text into 3-6 bullet points."
//       },
//       {
//         role: "user",
//         content: text
//       }
//     ],
//     max_tokens: 150
//   });

//   return {
//     summary: response.choices[0].message.content,
//     model: response.model
//   };
// };