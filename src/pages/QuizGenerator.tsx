import React, { useState } from "react";
import {
  HelpCircle,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { generateQuiz } from "../api/ai/gemini";

interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const QuizGenerator: React.FC = () => {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"input" | "quiz" | "result">(
    "input",
  );

  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await generateQuiz(input);
      setQuestions(result);
      setUserAnswers(new Array(result.length).fill(""));
      setCurrentStep("quiz");
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = option;
    setUserAnswers(newAnswers);
  };

  const score = questions.reduce(
    (acc, q, idx) => acc + (userAnswers[idx] === q.answer ? 1 : 0),
    0,
  );

  if (currentStep === "input") {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Dynamic Quiz Generator
          </h2>
          <p className="text-muted-slate">
            Turn any topic into a quick knowledge check.
          </p>
        </div>

        <div className="glass-card p-8 space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              Study Content
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste the material you want to be quizzed on..."
              className="w-full h-48 p-4 bg-surface-50 rounded-premium border-none focus:ring-2 focus:ring-brand-primary/20 resize-none transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="w-full bg-brand-primary text-white py-4 rounded-premium font-bold shadow-float hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
            {loading ? "Analyzing Content..." : "Generate 5 MCQs"}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === "quiz") {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-white p-4 rounded-premium sticky top-4 z-10 border border-surface-100 shadow-sm">
          <span className="font-bold text-brand-primary">AI Study Quiz</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full ${userAnswers[i] ? "bg-brand-primary" : "bg-brand-light"}`}
              />
            ))}
          </div>
        </div>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-bold">
              {qIdx + 1}. {q.question}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelectAnswer(qIdx, option)}
                  className={`p-4 rounded-premium text-left transition-all border-2 ${
                    userAnswers[qIdx] === option
                      ? "border-brand-primary bg-brand-light font-bold text-brand-primary"
                      : "border-transparent bg-surface-50 hover:bg-white hover:border-brand-primary/30"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => setCurrentStep("result")}
          disabled={userAnswers.some((a) => !a)}
          className="w-full bg-brand-primary text-white py-5 rounded-premium font-bold shadow-float hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          Finish Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in duration-500">
      <div className="glass-card p-12 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-light mb-4">
          <Sparkles className="w-10 h-10 text-brand-primary" />
        </div>
        <h2 className="text-4xl font-bold">Results</h2>
        <p className="text-6xl font-black text-brand-primary">
          {score} / {questions.length}
        </p>
        <p className="text-muted-slate italic">
          {score === questions.length
            ? "Perfect score! You've mastered this."
            : "Keep studying, you're getting there!"}
        </p>

        <div className="space-y-4 text-left mt-8">
          <h4 className="font-bold text-lg mb-4">Review Answers</h4>
          {questions.map((q, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-surface-50 border border-surface-100"
            >
              <div className="flex items-start gap-3">
                {userAnswers[i] === q.answer ? (
                  <CheckCircle2 className="w-5 h-5 text-sage-green mt-1 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                )}
                <div className="space-y-2">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm">
                    <span className="text-muted-slate">Correct:</span>{" "}
                    <span className="text-sage-green font-bold">
                      {q.answer}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      setShowExplanation(showExplanation === i ? null : i)
                    }
                    className="text-xs text-brand-primary font-bold hover:underline"
                  >
                    {showExplanation === i ? "Hide Explanation" : "Explain Why"}
                  </button>
                  {showExplanation === i && (
                    <p className="text-xs text-muted-slate mt-2 italic bg-white p-3 rounded border border-brand-light">
                      {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setCurrentStep("input");
            setInput("");
            setQuestions([]);
          }}
          className="w-full flex items-center justify-center gap-2 text-brand-primary font-bold py-4 hover:bg-brand-light rounded-premium transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Start New Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizGenerator;
