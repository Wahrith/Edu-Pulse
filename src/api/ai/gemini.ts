import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const summarizeText = async (text: string) => {
  const prompt = `
    You are an expert academic tutor. Please summarize the following study material into a clean, markdown-formatted study guide.
    Include:
    1. A high-level overview.
    2. Key concepts and definitions.
    3. Bulleted summary of important points.
    4. A 'Quick Recap' section at the end.
    
    Material:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    throw new Error("Failed to generate summary. Please check your API key.");
  }
};

export const generateQuiz = async (text: string) => {
  const prompt = `
    You are an expert examiner. Based on the following study material, generate 5 challenging Multiple Choice Questions (MCQs).
    Return the response ONLY as a JSON array of objects with this structure:
    [
      {
        "question": "string",
        "options": ["string", "string", "string", "string"],
        "answer": "string (the exact correct option text)",
        "explanation": "string"
      }
    ]
    
    Material:
    ${text}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz. Ensure the content is descriptive enough.");
  }
};

export const generateRoadmap = async (examName: string, subject: string, daysUntilExam: number) => {
  const numDays = Math.min(Math.max(daysUntilExam, 3), 30);
  const prompt = `
    You are an expert academic planner. Create a study roadmap for a student preparing for "${examName}" in the subject "${subject}".
    They have ${numDays} days until the exam.
    
    Return the response ONLY as a JSON array of objects with this structure:
    [
      {
        "day": 1,
        "topic": "string (the topic to study)",
        "focus": "string (specific activities or areas to concentrate on)",
        "completed": false
      }
    ]
    
    Create exactly ${Math.min(numDays, 15)} milestones that cover the most important topics.
    Make the plan progressive — start with foundations and build to advanced topics and revision.
    The last milestone should always be "Final Review & Mock Exam".
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanedText = response.text().replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Roadmap Generation Error:", error);
    throw new Error("Failed to generate study roadmap. Please try again.");
  }
};

export const chatWithTutor = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Tutor is currently offline. Please try again later.");
  }
};
