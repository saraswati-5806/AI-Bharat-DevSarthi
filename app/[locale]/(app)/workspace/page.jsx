"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Zap, BookOpen, Layout, Code as CodeIcon, Sparkles, 
  Settings, User, Globe 
} from "lucide-react";

import CompanionAI from "@/components/workspaceUI/CompanionAI";
import CodeLab from "@/components/workspaceUI/CodeLab";
import ResourceViewer from "@/components/workspaceUI/ResourceViewer";

export default function WorkspacePage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState("dual"); 
  // 🏆 NEW: State to hold text extracted from the PDF
  const [pdfContext, setPdfContext] = useState("");

  return (
    <div className="h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans antialiased">
      
      {/* 🟢 GLOBAL NAVIGATION (Top Bar) */}
      <header className="h-14 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.back()}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xs tracking-[0.2em] uppercase leading-none text-white/90">DevSathi</span>
              <span className="text-[7px] font-bold text-indigo-400 tracking-[0.3em] uppercase mt-1">Syllabus-Bound AI</span>
            </div>
          </div>

          <nav className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10 shadow-inner">
            {[
              { id: 'read', label: 'THEORY', icon: <BookOpen size={12}/> },
              { id: 'dual', label: 'HYBRID', icon: <Layout size={12}/> },
              { id: 'code', label: 'BUILD', icon: <CodeIcon size={12}/> }
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`px-6 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 tracking-tight ${
                  activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-500 uppercase">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             Nova Lite Core
           </div>
           <button className="p-2 text-slate-500 hover:text-white transition-colors"><Settings size={18}/></button>
           <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px]">A</div>
        </div>
      </header>

      {/* 🟢 THE ADAPTIVE WORKSPACE STAGE */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3 bg-black">
        
        {/* PILLAR 1: SOURCE READER */}
        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl ${
          activeMode === "read" ? "flex-[1.5]" : activeMode === "dual" ? "w-[35%]" : "w-0 opacity-0 pointer-events-none -ml-3"
        }`}>
          <div className="flex-1 overflow-hidden">
            {/* 🏆 Capture text from the PDF via onTextExtract prop */}
            <ResourceViewer onTextExtract={(text) => setPdfContext(text)} />
          </div>
        </div>

        {/* PILLAR 2: PRACTICE LAB */}
        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0b] shadow-2xl ${
          activeMode === "read" ? "w-0 opacity-0 pointer-events-none -ml-3" : activeMode === "code" ? "flex-[2]" : "flex-1"
        }`}>
          <div className="flex-1 overflow-hidden">
            <CodeLab activeFileName="main.py" />
          </div>
        </div>

        {/* PILLAR 3: SATHI INTELLIGENCE */}
        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-[#0f172a] shadow-[0_0_40px_rgba(79,70,229,0.1)] ${
          activeMode === "read" ? "flex-1" : activeMode === "dual" ? "w-[400px]" : "flex-1" 
        }`}>
           <div className="w-full h-full bg-gradient-to-b from-indigo-500/[0.02] to-transparent">
              {/* 🏆 Pass the captured pdfContext to the AI */}
              <CompanionAI 
                isCompact={activeMode === 'dual'} 
                context={pdfContext} 
              />
           </div>
        </div>

      </main>

      {/* 🧭 FOOTER */}
      <footer className="h-8 flex items-center px-10 justify-between text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] bg-[#020617] border-t border-white/5 shrink-0">
        <div className="flex gap-6 items-center">
           <span className="flex items-center gap-2 text-indigo-400">
             <Globe className="w-3 h-3" /> VERNACULAR ENGINE ACTIVE
           </span>
           <span className="text-white/10">|</span>
           <span>AWS BEDROCK: AP-SOUTH-1</span>
        </div>
      </footer>
    </div>
  );
}