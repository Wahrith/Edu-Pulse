import Groq from "groq-sdk";

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

// llama-3.3-70b-versatile: 14,400 req/day, 6,000 tokens/min on the free tier
const MODEL = "llama-3.3-70b-versatile";

async function complete(prompt: string): Promise<string> {
  const result = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });
  return result.choices[0].message.content ?? "";
}

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
    return await complete(prompt);
  } catch (error) {
    console.error("Summarization Error:", error);
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
    const raw = await complete(prompt);
    const cleanedText = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
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
    const raw = await complete(prompt);
    const cleanedText = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    throw new Error("Failed to generate study roadmap. Please try again.");
  }
};

export const chatWithTutor = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
) => {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You are an expert AI Study Tutor. Help students understand academic concepts clearly and thoroughly. Use markdown formatting in your responses.",
    },
    ...history.map((m) => ({
      role: (m.role === "model" ? "assistant" : "user") as "user" | "assistant",
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
