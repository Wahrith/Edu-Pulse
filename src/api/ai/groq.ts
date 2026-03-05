import Groq from "groq-sdk";

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// llama-3.3-70b-versatile: 14,400 req/day on the free tier
const MODEL = "llama-3.3-70b-versatile";

async function complete(prompt: string): Promise<string> {
  const result = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });
  return result.choices[0].message.content ?? "";
}

/**
 * Robustly extracts a JSON array from raw LLM output that may contain
 * surrounding prose or markdown code fences.
 */
function extractJsonArray(raw: string): string {
  // Strip markdown code fences
  let text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  // Find the outermost [ ... ] array boundaries
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}

export const summarizeText = async (text: string): Promise<string> => {
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
    return await complete(prompt);
  } catch (error) {
    console.error("Summarization Error:", error);
    throw new Error("Failed to generate summary. Please check your API key.");
  }
};

export const generateQuiz = async (
  text: string,
  count: number = 5,
): Promise<
  { question: string; options: string[]; answer: string; explanation: string }[]
> => {
  const prompt = `
    You are an expert examiner. Based on the following study material, generate exactly ${count} challenging Multiple Choice Questions.
    Return ONLY a valid JSON array with no extra text before or after it. Each element must use this exact structure:
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
    const raw = await complete(prompt);
    return JSON.parse(extractJsonArray(raw));
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw new Error(
      "Failed to generate quiz. Ensure the content is descriptive enough.",
    );
  }
};

export const generateRoadmap = async (
  examName: string,
  subject: string,
  daysUntilExam: number,
): Promise<
  { day: number; topic: string; focus: string; completed: boolean }[]
> => {
  const numDays = Math.min(Math.max(daysUntilExam, 3), 30);
  const milestones = Math.min(numDays, 15);
  const prompt = `
    You are an expert academic planner. Create a study roadmap for a student preparing for "${examName}" in the subject "${subject}".
    They have ${numDays} days until the exam.

    Return ONLY a valid JSON array with no extra text before or after it. Create exactly ${milestones} elements using this exact structure:
    [
      {
        "day": 1,
        "topic": "string",
        "focus": "string",
        "completed": false
      }
    ]

    Make the plan progressive — start with foundations, build to advanced topics, and end the final milestone with topic "Final Review & Mock Exam".
  `;
  try {
    const raw = await complete(prompt);
    const parsed = JSON.parse(extractJsonArray(raw));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid roadmap data returned.");
    }
    return parsed;
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    throw new Error("Failed to generate study roadmap. Please try again.");
  }
};

export const chatWithTutor = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
): Promise<string> => {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are an expert AI Study Tutor. Help students understand academic concepts clearly and thoroughly. Use markdown formatting in your responses.",
    },
    ...history.map((m) => ({
      role: (m.role === "model" ? "assistant" : "user") as
        | "user"
        | "assistant",
      content: m.parts[0].text,
    })),
    { role: "user" as const, content: message },
  ];
  try {
    const result = await client.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 1000,
    });
    return result.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Tutor is currently offline. Please try again later.");
  }
};
