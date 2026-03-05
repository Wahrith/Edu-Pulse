import React, { useState } from "react";
import { Sparkles, FileText, Loader2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { summarizeText } from "../api/ai/groq";
import { useAuth } from "../hooks/useAuth";
import { recordActivity } from "../api/firebase/userStats";

const Summarizer: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await summarizeText(input);
      setSummary(result);
      if (user) recordActivity(user.uid).catch(() => {});
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          AI Smart Summarizer
        </h2>
        <p className="text-muted-slate">
          Transform long notes into concise, actionable study guides.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold">
              <FileText className="w-5 h-5" />
              <span>Input Material</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your study notes, textbook excerpts, or article content here..."
              className="input-field h-[400px] resize-none text-sm"
            />
            <button
              onClick={handleSummarize}
              disabled={loading || !input.trim()}
              className="w-full bg-brand-primary text-white py-4 rounded-premium font-bold shadow-float hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? "Summarizing..." : "Generate AI Summary"}
            </button>
          </div>
        </div>

        {/* Output area */}
        <div className="space-y-4">
          <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sage-green font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>AI Generated Guide</span>
              </div>
              {summary && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-surface-50 rounded-lg transition-colors text-muted-slate"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-sage-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto prose prose-sm max-w-none">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-surface-100 rounded w-3/4"></div>
                  <div className="h-4 bg-surface-100 rounded w-full"></div>
                  <div className="h-4 bg-surface-100 rounded w-5/6"></div>
                  <div className="h-32 bg-surface-100 rounded w-full"></div>
                </div>
              ) : summary ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary}
                </ReactMarkdown>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-slate space-y-2 opacity-50">
                  <FileText className="w-12 h-12 mb-2" />
                  <p>Your summary will appear here.</p>
                  <p className="text-xs">
                    Paste some text on the left to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
