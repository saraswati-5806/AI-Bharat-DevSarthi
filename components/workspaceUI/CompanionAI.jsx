"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Sparkles, Send, User, ChevronRight, Loader2, Trash2, 
  PlayCircle, Mic2, Network, ExternalLink,
  PauseCircle, StopCircle 
} from "lucide-react";
import ReactMarkdown from "react-markdown"; 
import RenderMermaid from "react-x-mermaid"; 

export default function CompanionAI({ mode = "dual", context = "", lang = "en", alchemyResult = null }) {
  const params = useParams();
  const notebookId = params?.id || "default_session";
  const [input, setInput] = useState("");
  const [chatType, setChatType] = useState("resource"); 
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false); 
  const scrollRef = useRef(null);

  const initialMessage = { 
    role: "assistant", 
    content: "Hello! I'm Sathi. I'm ready to help you with your syllabus in any language. How can I assist?" 
  };

  const [messages, setMessages] = useState([]);

  // 🎯 TTS Logic (Improved for Hindi/English mix)
  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, "").replace(/```[\s\S]*?```/g, "").replace(/[*#\-_"']/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto-detect script for Indian languages
    if (/[\u0900-\u097F]/.test(cleanText)) utterance.lang = 'hi-IN';
    else if (/[\u0A80-\u0AFF]/.test(cleanText)) utterance.lang = 'gu-IN';
    else utterance.lang = 'en-IN';
    
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const clearChat = () => {
    if(window.confirm("Clear conversation?")) {
      const resetMessages = [initialMessage];
      setMessages(resetMessages);
      localStorage.setItem(`chat_${notebookId}`, JSON.stringify(resetMessages));
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`chat_${notebookId}`);
    setMessages(saved ? JSON.parse(saved) : [initialMessage]);
    setHasHydrated(true);
  }, [notebookId]);

  useEffect(() => {
    if (hasHydrated && messages.length > 0) {
      localStorage.setItem(`chat_${notebookId}`, JSON.stringify(messages));
    }
  }, [messages, notebookId, hasHydrated]);

  // 🎯 AUTO-SCROLL LOGIC (Optimized)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (alchemyResult && hasHydrated) {
      setMessages((prev) => [...prev, { role: "assistant", content: alchemyResult }]);
      if (alchemyResult.toLowerCase().includes("[audio]") || alchemyResult.toLowerCase().includes("lecture")) {
        speakResponse(alchemyResult);
      }
    }
  }, [alchemyResult, hasHydrated]);

  const sendMessage = async (e, customInput) => {
    e?.preventDefault();
    const finalInput = customInput || input;
    if (!finalInput.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: finalInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          context: context, // Sending full context object
          mode: mode, 
          lang: lang 
        }),
      });
      const data = await response.json();
      if (data.text) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
          if (finalInput.toLowerCase().match(/(audio|speak|sunao|bol|batao)/)) {
            speakResponse(data.text);
          }
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  if (!hasHydrated) return <div className="h-full bg-[#0f172a] animate-pulse" />;

  return (
    <div className="h-full flex flex-col bg-[#0f172a] relative">
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/50 backdrop-blur-md z-10">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> SATHI AI
        </h3>
        <div className="flex items-center gap-3">
            <button onClick={clearChat} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
            </button>
            <div className={`w-1.5 h-1.5 rounded-full ${context ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'assistant' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-700/50 border-white/10 text-slate-300'}`}>
                {msg.role === 'assistant' ? <Sparkles size={14} /> : <User size={14} />}
             </div>
             <div className={`group relative max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'assistant' ? 'bg-white/5 text-slate-200 border border-white/5 shadow-sm' : 'bg-indigo-600 text-white shadow-md'}`}>
                
                <ReactMarkdown components={{
                    // 🎯 HYDRATION FIX: Mapping p to div
                    p: ({ children }) => <div className="mb-4">{children}</div>,
                    code({ inline, className, children }) {
                        const codeVal = String(children).replace(/\n$/, '');
                        
                        // Mermaid Diagram Support
                        if (!inline && (className?.includes('language-mermaid') || codeVal.startsWith('graph'))) {
                            return <div className="my-4 bg-white rounded-xl p-4 overflow-x-auto border border-white/10 shadow-2xl"><RenderMermaid mermaidCode={codeVal} /></div>;
                        }
                        
                        // 🎯 CODE INSERTION LOGIC (Hydration Safe Section)
                        if (!inline) {
                          return (
                            <div className="relative group/code my-6 block">
                              <div className="absolute -top-3 left-3 px-2 py-0.5 bg-[#1e1e1e] border border-white/10 rounded text-[8px] font-black text-slate-500 uppercase z-10">Code Lab Module</div>
                              <code className="block bg-black/40 p-4 pt-6 rounded-xl text-emerald-400 font-mono text-[11px] border border-white/5 overflow-x-auto">{children}</code>
                              <button 
                                type="button"
                                onClick={() => { 
                                  window.__SATHI_INSERT_CODE__ = codeVal; 
                                  window.dispatchEvent(new CustomEvent("insert-code-trigger")); 
                                }} 
                                className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black opacity-0 group-hover/code:opacity-100 transition-all shadow-xl flex items-center gap-1 active:scale-95"
                              >
                                INSERT <ChevronRight size={12} />
                              </button>
                            </div>
                          );
                        }
                        return <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]">{children}</code>;
                    }
                }}>{msg.content}</ReactMarkdown>
                
                {/* Audio Controls */}
                {msg.role === 'assistant' && (msg.content.includes("[audio]") || msg.content.toLowerCase().includes("lecture")) && (
                  <div className="mt-4 flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/10 shadow-inner">
                    <button onClick={() => speakResponse(msg.content)} className="text-emerald-400 hover:scale-110 transition-transform"><PlayCircle size={20}/></button>
                    <button onClick={() => window.speechSynthesis.pause()} className="text-amber-400 hover:scale-110 transition-transform"><PauseCircle size={20}/></button>
                    <button onClick={() => window.speechSynthesis.cancel()} className="text-red-400 hover:scale-110 transition-transform"><StopCircle size={20}/></button>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full relative overflow-hidden">
                        <div className="h-full w-2/3 bg-indigo-500/50 animate-pulse" />
                    </div>
                  </div>
                )}
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3 p-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Sathi Senior Thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0f172a] border-t border-white/5 shrink-0 z-10">
        <form onSubmit={sendMessage} className="flex gap-2 relative">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask Sathi anything..." 
            className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-3.5 px-5 text-[13px] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 shadow-inner" 
          />
          <button type="submit" disabled={isLoading} className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}