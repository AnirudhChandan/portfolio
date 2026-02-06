"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles } from "lucide-react";

// 1. Define the Interface
interface KnowledgeEntry {
  keywords: string[];
  text: string;
}

// 2. Type the Data
const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: [
      "skills",
      "stack",
      "tech",
      "technologies",
      "languages",
      "coding",
    ],
    text: "I am proficient in **Node.js, Python, and React**. On the backend, I specialize in **Express, Sequelize, MongoDB, and PostgreSQL**. I also have deep experience with system design tools like **Docker, Kafka, Redis, and AWS**.",
  },
  {
    keywords: ["experience", "work", "history", "job", "career", "companies"],
    text: "I have worked at **Docplix** as a Software Engineer (Lead Backend) and at **Genpact** where I built serverless data pipelines. My focus has always been on scalable architecture.",
  },
  {
    keywords: ["docplix", "inventory", "migration", "api", "consistency"],
    text: "At **Docplix**, I returned to lead the backend architecture for a V2.0 migration. I architected **30+ RESTful endpoints** and ensured **99.9% data consistency** during a critical inventory system migration using a custom sync service.",
  },
  {
    keywords: ["genpact", "python", "serverless", "pipeline", "optimization"],
    text: "At **Genpact**, I designed serverless data pipelines using **Python and GCP**, which boosted efficiency by **35%**. I also reduced API response times by **40%** using Kafka and Redis caching.",
  },
  {
    keywords: ["projects", "built", "app", "chat", "movie", "recommendation"],
    text: "I've built some cool systems! Notable ones include a **Real-Time Chat App** (Node.js/Socket.io) handling high concurrency, and a **Movie Recommendation API** that uses Machine Learning (Cosine Similarity) to personalize content.",
  },
  {
    keywords: ["contact", "email", "hire", "reach", "touch"],
    text: "You can reach me directly at **anichandan124@gmail.com**. I am currently open to new opportunities as a Backend or Full Stack Engineer!",
  },
  {
    keywords: ["hello", "hi", "hey", "greeting", "who"],
    text: "Hello! I am **AniBot**, Anirudh's virtual assistant. I can answer questions about his **skills**, **experience at Docplix/Genpact**, or his **backend projects**. Ask me anything!",
  },
];

// --- LOGIC ---
const findBestMatch = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  let bestMatch: KnowledgeEntry | null = null;
  let maxScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    entry.keywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword)) score++;
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }

  if (maxScore > 0 && bestMatch) {
    return bestMatch.text;
  }

  return "I'm not sure about that specific detail, but I can tell you about Anirudh's **skills**, **work experience**, or **projects**. Try asking 'What are his skills?'";
};

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Hi! I'm AniBot. Ask me anything about Anirudh's work!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Small delay to allow animation to finish before focusing
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = findBestMatch(userMessage.text);
      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: answer,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* FLOATING TOGGLE BUTTON - Increased Z-Index */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[9999] p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen
            ? "scale-0 opacity-0"
            : "bg-teal-500 hover:bg-teal-400 text-slate-900"
        }`}
      >
        <Sparkles size={28} fill="currentColor" />
      </motion.button>

      {/* CHAT WINDOW - Increased Z-Index */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-4 md:right-8 z-[9999] w-[90vw] md:w-[400px] h-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-lg">
                  <Bot size={20} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">
                    AniBot AI
                  </h3>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-slate-700 text-slate-300"
                        : "bg-teal-500/20 text-teal-400"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} />
                    ) : (
                      <Bot size={16} />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-slate-700 text-slate-200 rounded-tr-none"
                        : "bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none"
                    }`}
                  >
                    {msg.text.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-teal-400 font-normal">
                          {part}
                        </strong>
                      ) : (
                        part
                      ),
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-teal-500/20 text-teal-400">
                    <Bot size={16} />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about skills..."
                  // Added pointer-events-auto to ensure it catches clicks
                  className="w-full bg-slate-950 border border-slate-700 rounded-full py-3 px-5 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-600 pointer-events-auto"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-500 text-slate-950 rounded-full hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
