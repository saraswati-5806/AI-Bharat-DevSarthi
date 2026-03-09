"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Sparkles, Send, User, ChevronRight, Loader2, Trash2, PlayCircle, StopCircle } from "lucide-react";
import ReactMarkdown from "react-markdown"; 

export default function CompanionAI({ mode = "dual", context = "", lang = "en" }) {
  const params = useParams();
  const notebookId = params?.id || "default_session";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false); 
  const scrollRef = useRef(null);

  // 🎯 VERNACULAR VOICE ENGINE (Fixed for Gujarati/Hindi/English)
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Clean text: remove code blocks entirely from speech to avoid reading syntax
    const speechText = text.replace(/```[\s\S]*?```/g, " [Code Block] ").replace(/[*#\-_"']/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // 🌍 SCRIPT DETECTION
    if (/[\u0A80-\u0AFF]/.test(speechText)) utterance.lang = 'gu-IN'; // Gujarati
    else if (/[\u0900-\u097F]/.test(speechText)) utterance.lang = 'hi-IN'; // Hindi
    else utterance.lang = 'en-IN'; // Indian English
    
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const saved = localStorage.getItem(`chat_${notebookId}`);
    setMessages(saved ? JSON.parse(saved) : [{ role: "assistant", content: "Kem Cho! I'm Sathi. How can I help?" }]);
    setHasHydrated(true);
  }, [notebookId]);

  useEffect(() => {
    if (hasHydrated && messages.length > 0) localStorage.setItem(`chat_${notebookId}`, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, hasHydrated]);

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
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          context: context,
          lang: lang,
          // 🛡️ THE MASTER INSTRUCTION
          instructions: "Rule: Explain everything in the requested language (e.g. Gujarati), but ALWAYS keep all code snippets, variable names, and technical syntax in standard English. Never translate code logic."
        }),
      });
      const data = await response.json();
      if (data.text) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
          // Auto-speak if the user asks for it or uses Gujarati
          if (input.toLowerCase().match(/(speak|bol|sunao|batao|kaho)/) || /[\u0A80-\u0AFF]/.test(input)) {
            speakResponse(data.text);
          }
      }
    } catch (error) { 
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection Error. Logic intact." }]);
    } finally { setIsLoading(false); }
  };

  if (!hasHydrated) return <div className="h-full bg-[#0f172a] animate-pulse" />;

  return (
    <div className="h-full flex flex-col bg-[#0f172a] relative border-l border-white/5">
      <div className="h-10 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/95 backdrop-blur-md z-10">
        <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={12} /> SATHI VERNACULAR AI
        </h3>
        <button onClick={() => { setMessages([]); localStorage.removeItem(`chat_${notebookId}`); }} className="p-1 hover:text-red-400 text-slate-600 transition-colors"><Trash2 size={12} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in`}>
             <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'assistant' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-700/50 border-white/10 text-slate-300'}`}>
                {msg.role === 'assistant' ? <Sparkles size={12} /> : <User size={12} />}
             </div>
             <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed ${msg.role === 'assistant' ? 'bg-white/5 text-slate-200 border border-white/5' : 'bg-indigo-600 text-white shadow-lg'}`}>
                <ReactMarkdown components={{
                    code({ inline, children }) {
                      const codeVal = String(children).replace(/\n$/, '');
                      if (!inline) {
                        return (
                          <div className="relative my-3 group">
                            <code className="block bg-black/40 p-3 rounded-xl text-emerald-400 font-mono text-[10px] border border-white/5 overflow-x-auto">{children}</code>
                            <button 
                              onClick={() => { window.__SATHI_INSERT_CODE__ = codeVal; window.dispatchEvent(new CustomEvent("insert-code-trigger")); }} 
                              className="absolute right-2 top-2 bg-indigo-600 text-white px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all uppercase"
                            >
                              Insert Code
                            </button>
                          </div>
                        );
                      }
                      return <code className="bg-black/30 px-1 rounded text-indigo-300">{children}</code>;
                    }
                }}>{msg.content}</ReactMarkdown>
                
                {msg.role === 'assistant' && (
                  <div className="mt-3 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                    <button onClick={() => speakResponse(msg.content)} className="p-1 text-emerald-400 hover:scale-110 transition-transform"><PlayCircle size={16}/></button>
                    <button onClick={() => window.speechSynthesis.cancel()} className="p-1 text-red-400 hover:scale-110 transition-transform"><StopCircle size={16}/></button>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#0f172a] border-t border-white/5">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask in Gujarati (e.g. Code samjhavo...)" 
            className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-[12px] text-white focus:outline-none focus:border-indigo-500/50" 
          />
          <button type="submit" disabled={isLoading} className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all shadow-lg">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}