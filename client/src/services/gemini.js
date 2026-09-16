import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);
console.log(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

export async function analyzeAnswer(question, answer) {
  const prompt = `
You are a professional interview evaluator.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer and return ONLY valid JSON.

{
  "score": 0,
  "grammar": 0,
  "communication": 0,
  "confidence": 0,
  "feedback": "",
  "suggestion": ""
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return JSON.parse(
    text.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
  );
}