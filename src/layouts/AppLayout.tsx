import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Sparkles,
  HelpCircle,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebase/config";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveTutor from "../components/dashboard/InteractiveTutor";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Summarizer", path: "/notes" },
  { icon: HelpCircle, label: "Practice Quiz", path: "/quiz" },
  { icon: GraduationCap, label: "Exam Roadmap", path: "/roadmap" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  currentPath: string;
  initials: string;
  displayName: string;
  email: string;
  onNav: () => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  initials,
  displayName,
  email,
  onNav,
  onSignOut,
}) => (
  <div className="flex flex-col h-full">
    {/* Logo */}
    <div className="flex items-center gap-2.5 px-2 mb-10">
      <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center shadow-md">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-display font-bold text-surface-900 dark:text-white">
        EduPulse
      </span>
    </div>

    {/* Nav items */}
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNav}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-brand-primary text-white shadow-md"
                : "text-muted-slate hover:bg-brand-light hover:text-brand-primary dark:hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        );
      })}
    </nav>

    {/* User info + Sign out */}
    <div className="mt-auto pt-4 border-t border-surface-100 dark:border-white/10 space-y-3">
      <div className="flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-brand-light border-2 border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
            {displayName}
          </p>
          <p className="text-xs text-muted-slate truncate">{email}</p>
        </div>
      </div>
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-slate hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  </div>
);

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("edupulse-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("edupulse-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "S");

  const displayName = user?.displayName ?? "Student";
  const email = user?.email ?? "";

  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-deep-space font-body transition-colors duration-300">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-white/10 p-6 z-20">
        <Sidebar
          currentPath={location.pathname}
          initials={initials}
          displayName={displayName}
          email={email}
          onNav={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* ── Mobile Overlay Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-surface-900 p-6 shadow-2xl"
            >
              <Sidebar
                currentPath={location.pathname}
                initials={initials}
                displayName={displayName}
                email={email}
                onNav={() => setMobileOpen(false)}
                onSignOut={handleSignOut}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-100 dark:border-white/10 px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            className="md:hidden text-muted-slate hover:text-brand-primary"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-surface-900 dark:text-white">
              EduPulse
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-white/5 text-muted-slate hover:text-brand-primary transition-colors"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {displayName}
              </p>
              <p className="text-xs text-muted-slate">Free Plan</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-light border-2 border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Page outlet with transitions */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Global AI Tutor Floating Chat */}
      <InteractiveTutor />
    </div>
  );
};

export default AppLayout;
