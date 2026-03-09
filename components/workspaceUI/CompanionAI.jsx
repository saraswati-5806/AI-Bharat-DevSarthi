"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User, ChevronRight, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown"; 

export default function CompanionAI({ isCompact = false, context = "" }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I am your **Sathi**. I've indexed your syllabus. Start coding, and I'll help you stay on track!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage], context }),
      });
      const data = await response.json();
      if (data.text) setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (error) { console.error("Chat Error:", error); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] relative">
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/50 backdrop-blur-md">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> SATHI INTELLIGENCE
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              msg.role === 'assistant' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-700/50 border-white/10 text-slate-300'
            }`}>
              {msg.role === 'assistant' ? <Sparkles size={14} /> : <User size={14} />}
            </div>
            
            <div className={`max-w-[88%] p-4 rounded-2xl text-[13px] leading-relaxed relative ${
              msg.role === 'assistant' ? 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5' : 'bg-indigo-600 text-white rounded-tr-none'
            }`}>
              <ReactMarkdown 
                components={{
                  p: ({children}) => <div className="mb-2 last:mb-0">{children}</div>,
                  code({ children }) {
                    const codeVal = String(children).replace(/\n$/, '');
                    return (
                      <div className="relative group my-3">
                        <code className="bg-[#020617] text-emerald-400 px-4 py-3 rounded-xl font-mono text-[12px] border border-white/10 block whitespace-pre-wrap overflow-x-auto pr-20">
                          {children}
                        </code>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            // 🏆 NUCLEAR OPTION: Global variable transfer
                            window.__SATHI_INSERT_CODE__ = codeVal;
                            window.dispatchEvent(new CustomEvent("insert-code-trigger"));
                          }}
                          className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-auto shadow-2xl"
                        >
                          INSERT <ChevronRight size={12} />
                        </button>
                      </div>
                    );
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#0f172a]/80 backdrop-blur-md border-t border-white/5">
        <form onSubmit={sendMessage} className="relative flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sathi anything..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[13px] text-slate-200 focus:outline-none focus:border-indigo-500/50"
          />
          <button type="submit" className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}