import React, { useState, useEffect } from "react";
import {
  Calendar,
  Loader2,
  Target,
  Trophy,
  ChevronRight,
  CheckCircle2,
  Search,
  ChevronDown,
} from "lucide-react";
import { generateRoadmap } from "../api/ai/groq";
import { useAuth } from "../hooks/useAuth";
import { recordActivity } from "../api/firebase/userStats";

interface Milestone {
  day: number;
  topic: string;
  focus: string;
  completed: boolean;
}

const ExamRoadmap: React.FC = () => {
  const { user } = useAuth();
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Milestone[] | null>(null);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Language",
    "Literature",
    "Government",
    "Economics",
    "Computer Science",
    "Accounting",
    "Geography",
    "History",
    "Further Mathematics",
  ];

  const filteredSubjects = subjects.filter((s) =>
    s.toLowerCase().includes(subject.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!examName || !examDate || !subject) return;
    setLoading(true);
    setError("");

    try {
      const today = new Date();
      const exam = new Date(examDate);
      const diffTime = exam.getTime() - today.getTime();
      const daysUntilExam = Math.max(
        Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
        1,
      );

      const result = await generateRoadmap(examName, subject, daysUntilExam);
      setRoadmap(result);
      if (user) recordActivity(user.uid).catch(() => {});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate roadmap",
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (index: number) => {
    if (!roadmap) return;
    const updated = [...roadmap];
    updated[index] = {
      ...updated[index],
      completed: !updated[index].completed,
    };
    setRoadmap(updated);
  };

  const completedCount = roadmap?.filter((m) => m.completed).length ?? 0;
  const totalCount = roadmap?.length ?? 0;
  const completionPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">
          Exam Roadmap
        </h2>
        <p className="text-muted-slate mt-1">
          A personalized AI-generated daily guide to crush your upcoming exams.
        </p>
      </div>

      {!roadmap ? (
        <div className="max-w-xl mx-auto glass-card p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-2">
                Exam Name
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g., JAMB, WAEC, SAT Biology"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="relative" ref={dropdownRef}>
                <label className="text-sm font-semibold block mb-2">
                  Focus Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search or enter subject"
                    className="input-field pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-slate pointer-events-none">
                    {subject ? (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-surface-900 border border-surface-100 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setSubject(s);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                              subject === s
                                ? "bg-brand-primary text-white"
                                : "text-surface-900 dark:text-white hover:bg-brand-light dark:hover:bg-white/5"
                            }`}
                          >
                            {s}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-center text-muted-slate italic">
                          "{subject}" not in list. Type to add custom.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-premium p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !examName || !examDate || !subject}
            className="btn-primary w-full py-4 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Target className="w-5 h-5" />
            )}
            {loading ? "AI is Building Your Roadmap..." : "Generate Study Plan"}
          </button>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 skeleton-shimmer rounded-premium"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 bg-brand-primary text-white">
              <h3 className="text-xl font-display font-bold mb-4">
                {examName}
              </h3>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-4 h-4 opacity-70" />
                <span className="text-sm">
                  {new Date(examDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 opacity-70" />
                <span className="text-sm">Goal: Master {subject}</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-display font-bold mb-4">
                Overall Completion
              </h4>
              <div className="relative pt-1">
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-brand-light">
                  <div
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-primary transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-slate mt-2">
                  {completedCount} of {totalCount} milestones completed (
                  {completionPercent}%)
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {roadmap.map((m, i) => (
              <div
                key={i}
                className={`flex gap-4 p-6 rounded-premium border transition-all duration-200 ${
                  m.completed
                    ? "bg-sage-green/10 border-sage-green/30"
                    : "bg-white dark:bg-white/5 border-surface-100 dark:border-white/10 hover:border-brand-primary/30 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => toggleMilestone(i)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                      m.completed
                        ? "bg-sage-green text-white"
                        : "bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white"
                    }`}
                    title={
                      m.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {m.completed ? <CheckCircle2 className="w-5 h-5" /> : m.day}
                  </button>
                  {i < roadmap.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[20px] rounded-full transition-colors ${m.completed ? "bg-sage-green/40" : "bg-surface-100"}`}
                    />
                  )}
                </div>
                <div className="flex-1 py-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-display font-bold text-lg ${m.completed ? "line-through opacity-70" : ""}`}
                    >
                      {m.topic}
                    </h4>
                    {m.completed && (
                      <span className="text-xs bg-sage-green text-white px-2 py-1 rounded-full font-medium">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <p className="text-muted-slate text-sm mt-1">{m.focus}</p>

                  {!m.completed && (
                    <button className="mt-4 flex items-center gap-2 text-brand-primary font-bold text-sm hover:underline">
                      Start Studying <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setRoadmap(null);
                setExamName("");
                setExamDate("");
                setSubject("");
              }}
              className="w-full py-4 text-muted-slate hover:text-brand-primary transition-colors font-medium text-sm"
            >
              Reset and Create New Roadmap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRoadmap;
