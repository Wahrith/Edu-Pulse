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
  Sparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUserStats } from "../hooks/useUserStats";

const DAILY_LIMIT = 20;

const features = [
  {
    icon: BookOpen,
    label: "AI Summarizer",
    desc: "Paste any notes and get a clean, structured study guide in seconds.",
    path: "/notes",
    gradient: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
    badge: "Most Used",
  },
  {
    icon: HelpCircle,
    label: "Practice Quiz",
    desc: "Auto-generate MCQ quizzes from your material and test your knowledge.",
    path: "/quiz",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400",
    badge: "Interactive",
  },
  {
    icon: GraduationCap,
    label: "Exam Roadmap",
    desc: "Get a personalized daily study plan tailored to your exam date.",
    path: "/roadmap",
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    badge: "AI Powered",
  },
  {
    icon: MessageCircle,
    label: "AI Tutor",
    desc: "Click the chat bubble at the bottom-right to ask your AI tutor anything.",
    path: "/",
    gradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    badge: "Always On",
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useUserStats();

  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Student";

  const dailyUsed = stats?.dailyRequests ?? 0;
  const dailyPct = Math.min((dailyUsed / DAILY_LIMIT) * 100, 100);
  const streak = stats?.studyStreak ?? 0;
  const topics = stats?.topicsMastered ?? 0;

  return (
    <div className="space-y-8">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-premium bg-gradient-to-br from-brand-primary via-indigo-500 to-brand-dark p-8 text-white shadow-float">
        {/* Decorative blobs */}
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute right-16 bottom-0 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Welcome back</span>
            </div>
            <h2 className="text-4xl font-display font-bold leading-tight">
              Hey, {firstName}! 👋
            </h2>
            <p className="text-white/70 mt-2 text-sm">
              Ready to level up your studies today?
            </p>
          </div>
          <Link
            to="/notes"
            className="flex items-center gap-2 bg-white text-brand-primary font-bold px-6 py-3 rounded-premium hover:scale-105 hover:shadow-lg active:scale-95 transition-all text-sm whitespace-nowrap w-fit"
          >
            <Zap className="w-4 h-4" /> Start Studying
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Daily Requests */}
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-primary to-indigo-400 rounded-t-premium" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">Daily AI Uses</p>
            <div className="w-9 h-9 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          <div>
            {loading ? (
              <div className="h-10 w-24 bg-surface-100 dark:bg-white/10 rounded-lg animate-pulse" />
            ) : (
              <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
                {dailyUsed}
                <span className="text-lg text-muted-slate font-normal"> / {DAILY_LIMIT}</span>
              </p>
            )}
          </div>
          <div className="h-1.5 bg-surface-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-indigo-400 rounded-full transition-all duration-700"
              style={{ width: `${dailyPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-slate -mt-1">
            {Math.max(DAILY_LIMIT - dailyUsed, 0)} uses remaining today
          </p>
        </div>

        {/* Study Streak */}
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-premium" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">Study Streak</p>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          {loading ? (
            <div className="h-10 w-24 bg-surface-100 dark:bg-white/10 rounded-lg animate-pulse" />
          ) : (
            <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
              {streak}
              <span className="text-lg text-muted-slate font-normal"> days</span>
            </p>
          )}
          <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {streak >= 7
              ? "🔥 On fire! Keep it up!"
              : streak >= 3
              ? "⚡ Great streak going!"
              : streak === 1
              ? "🌱 Day 1 — let's build momentum!"
              : "Start your streak — study today!"}
          </p>
        </div>

        {/* Topics Mastered */}
        <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sage-green to-emerald-400 rounded-t-premium" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-slate">Topics Mastered</p>
            <div className="w-9 h-9 rounded-xl bg-sage-green/10 dark:bg-sage-green/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-sage-green" />
            </div>
          </div>
          {loading ? (
            <div className="h-10 w-24 bg-surface-100 dark:bg-white/10 rounded-lg animate-pulse" />
          ) : (
            <p className="text-4xl font-display font-bold text-surface-900 dark:text-white">
              {topics}
            </p>
          )}
          <p className="text-xs font-medium text-sage-green">
            {topics > 0
              ? `${topics} correct quiz answer${topics !== 1 ? "s" : ""} total`
              : "Complete quizzes to track progress"}
          </p>
        </div>
      </div>

      {/* ── Feature Cards ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl font-display font-bold">Study Tools</h3>
          <div className="flex-1 h-px bg-surface-100 dark:bg-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.label}
              className="glass-card overflow-hidden flex flex-col hover:shadow-float hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Gradient top strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${f.gradient}`} />

              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.iconBg}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-slate border border-surface-200 dark:border-white/10 px-2 py-0.5 rounded-full">
                    {f.badge}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="font-display font-bold text-lg text-surface-900 dark:text-white">
                    {f.label}
                  </h4>
                  <p className="text-muted-slate text-sm mt-1 leading-relaxed">{f.desc}</p>
                </div>

                <Link
                  to={f.path}
                  className={`bg-gradient-to-r ${f.gradient} text-white text-sm font-bold px-4 py-2.5 rounded-premium flex items-center gap-2 w-fit hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-200`}
                >
                  Open Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
