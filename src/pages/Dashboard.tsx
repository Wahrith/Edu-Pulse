import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  HelpCircle,
  GraduationCap,
  MessageCircle,
  ArrowRight,
  Flame,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: BookOpen,
    label: "AI Summarizer",
    desc: "Paste any notes and get a clean, structured study guide in seconds.",
    path: "/notes",
    color: "bg-blue-50 text-blue-600",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    icon: HelpCircle,
    label: "Practice Quiz",
    desc: "Auto-generate MCQ quizzes from your material and test your knowledge.",
    path: "/quiz",
    color: "bg-violet-50 text-violet-600",
    btnColor: "bg-violet-600 hover:bg-violet-700",
  },
  {
    icon: GraduationCap,
    label: "Exam Roadmap",
    desc: "Get a personalized daily study plan tailored to your exam date.",
    path: "/roadmap",
    color: "bg-amber-50 text-amber-600",
    btnColor: "bg-amber-500 hover:bg-amber-600",
  },
  {
    icon: MessageCircle,
    label: "AI Tutor",
    desc: "Click the chat button at the bottom-right to ask your AI tutor anything.",
    path: "/",
    color: "bg-emerald-50 text-emerald-600",
    btnColor: "bg-emerald-500 hover:bg-emerald-600",
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Student";

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold text-surface-900 dark:text-white">
            Hey, {firstName}! 👋
          </h2>
          <p className="text-muted-slate mt-1">
            Ready to level up your studies today?
          </p>
        </div>
        <Link
          to="/notes"
          className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
        >
          <Zap className="w-4 h-4" /> Start Studying
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">Daily Tokens</p>
            <Zap className="w-4 h-4 text-brand-primary" />
          </div>
          <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
            45{" "}
            <span className="text-lg text-muted-slate font-normal">/ 50</span>
          </p>
          <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full"
              style={{ width: "90%" }}
            />
          </div>
          <p className="text-xs text-muted-slate">5 tokens remaining today</p>
        </div>
        <div className="glass-card p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">Study Streak</p>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
            12{" "}
            <span className="text-lg text-muted-slate font-normal">days</span>
          </p>
          <p className="text-xs font-medium text-sage-green">
            🏆 Top 5% of students this month!
          </p>
        </div>
        <div className="glass-card p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">
              Topics Mastered
            </p>
            <Trophy className="w-4 h-4 text-sage-green" />
          </div>
          <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
            128
          </p>
          <p className="text-xs font-medium text-brand-primary">
            +12 new this week
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="text-xl font-display font-bold mb-5">Study Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.label}
              className="glass-card p-6 flex flex-col gap-4 hover:shadow-float transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg">{f.label}</h4>
                <p className="text-muted-slate text-sm mt-1">{f.desc}</p>
              </div>
              <Link
                to={f.path}
                className={`text-white text-sm font-bold px-4 py-2.5 rounded-premium flex items-center gap-2 w-fit transition-colors ${f.btnColor}`}
              >
                Open Tool <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
