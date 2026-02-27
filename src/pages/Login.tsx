import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  LogIn,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../api/firebase/config";

const provider = new GoogleAuthProvider();

const Login: React.FC = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const navigate = useNavigate();

  const getFriendlyError = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
      case "auth/EMAIL_EXISTS":
        return "This email is already registered. Try signing in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return "No account found with this email. Check your details or create an account.";
      case "auth/wrong-password":
        return "Incorrect password. Try again or reset your password.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  // On mount: check if we just returned from a Google redirect
  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        // result is non-null only when returning from a redirect
        if (result) {
          navigate("/");
        }
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Google sign-in failed");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      // Redirect in the same tab — avoids COOP popup-blocked errors
      await signInWithRedirect(auth, provider);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to sign in with Google",
      );
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAuthSuccess(false);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        setAuthSuccess(true);
        setTimeout(() => navigate("/"), 1500);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setAuthSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? "";
      setError(getFriendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(
        "Enter your email address above first, then click 'Forgot password'.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code ?? "";
      setError(getFriendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-deep-space">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary relative overflow-hidden flex-col items-center justify-center p-16 text-white">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 rounded-full border border-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-sm">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold leading-tight">
            Your AI-Powered
            <br />
            Study Partner
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Summarize notes, generate quizzes, build exam roadmaps, and get
            instant AI explanations — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: "Students", value: "10K+" },
              { label: "Notes Summarized", value: "50K+" },
              { label: "Quizzes Generated", value: "200K+" },
              { label: "Exams Aced", value: "8K+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display">EduPulse</span>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-white">
              {mode === "signin" ? "Welcome back!" : "Create your account"}
            </h2>
            <p className="text-muted-slate mt-2">
              {mode === "signin"
                ? "Sign in to continue your study journey."
                : "Join thousands of students using EduPulse."}
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 px-4 border-2 border-surface-200 dark:border-white/10 rounded-premium font-semibold text-surface-900 dark:text-white hover:bg-surface-50 dark:hover:bg-white/5 hover:border-brand-primary/40 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface-50 dark:bg-deep-space text-muted-slate">
                or continue with email
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-premium p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {authSuccess && (
            <div className="flex items-start gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-premium p-3 text-sm">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                {mode === "signin"
                  ? "Signed in successfully! Redirecting..."
                  : "Account created successfully! Redirecting..."}
              </p>
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-brand-primary transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-brand-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {resetSent && (
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-premium p-3">
                ✅ Password reset email sent! Check your inbox.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-slate">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setAuthSuccess(false);
              }}
              className="text-brand-primary font-semibold hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
