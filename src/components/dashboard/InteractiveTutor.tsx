import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  MessageCircle,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithTutor } from "../../api/ai/groq";

interface Message {
  role: "user" | "model";
  content: string;
}

const InteractiveTutor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I'm your AI Study Tutor. Ask me anything about your subjects, and I'll help you understand it deeply. What are we studying today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const response = await chatWithTutor(history, userMessage);
      setMessages((prev) => [...prev, { role: "model", content: response }]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-brand-primary text-white rounded-full shadow-float flex items-center justify-center hover:scale-110 transition-transform z-50 animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-sage-green rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white dark:bg-surface-900 rounded-premium shadow-2xl flex flex-col border border-surface-100 dark:border-white/10 z-50 animate-in slide-in-from-bottom-8 overflow-hidden">
      {/* Header */}
      <div className="bg-brand-primary p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-sm">EduPulse AI Tutor</h3>
            <p className="text-[10px] opacity-80 flex items-center gap-1">
              <Sparkles className="w-2 h-2" /> Powered by Groq
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/10 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-surface-50/50 dark:bg-white/5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-premium text-sm ${
                m.role === "user"
                  ? "bg-brand-primary text-white rounded-br-none"
                  : "bg-white dark:bg-white/10 border border-surface-100 dark:border-white/10 text-surface-900 dark:text-white rounded-bl-none shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px]">
                {m.role === "user" ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
                <span>{m.role === "user" ? "You" : "AI Tutor"}</span>
              </div>
              <div className="prose prose-sm prose-p:my-1 prose-headings:text-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white dark:bg-surface-800 border border-surface-100 dark:border-white/10 p-3 rounded-premium rounded-bl-none shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to explain a concept..."
            className="flex-1 bg-surface-50 dark:bg-white/5 text-surface-900 dark:text-white placeholder-muted-slate border-none rounded-premium px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-brand-primary text-white p-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InteractiveTutor;
