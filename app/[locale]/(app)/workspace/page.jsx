"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useRouter, useParams } from "next/navigation";
import { 
  Zap, BookOpen, Layout, Code as CodeIcon, 
  Settings, Globe, Check, Trash2 
} from "lucide-react";

// ✅ 1. DYNAMIC IMPORT: SSR disabled to fix hydration and loading conflicts
const SathiCodeLab = dynamic(() => import("@/components/workspaceUI/CodeLab"), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-[#0a0a0b] animate-pulse rounded-[2.5rem] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">WASM Engine Initializing...</span>
    </div>
  )
});

import CompanionAI from "@/components/workspaceUI/CompanionAI";
import ResourceViewer from "@/components/workspaceUI/ResourceViewer";
import ProfileModal from "@/app/[locale]/(app)/profile/profileModal"; 

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "en"; 

  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState("dual"); 
  const [pdfContext, setPdfContext] = useState("");
  const [alchemyUpdate, setAlchemyUpdate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // 🎯 TRIGGER MOUNT: Fix for [object Event] and Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-Sync Context for Session Resilience
  useEffect(() => {
    if (mounted && pdfContext) {
      localStorage.setItem(`last_context_${params.id}`, pdfContext);
    }
  }, [pdfContext, params.id, mounted]);

  // 🎯 REAL SAVE & DASHBOARD SYNC LOGIC
  const handleManualSave = () => {
    const currentResource = JSON.parse(localStorage.getItem("sathi_active_resource") || "{}");
    
    const newSession = {
      id: params.id || Date.now().toString(),
      name: currentResource.name || "Sets_Operations_AppliedMaths.pdf",
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      type: currentResource.type || "PDF",
      url: currentResource.url || ""
    };

    // Update global dashboard sessions list
    const existingSessions = JSON.parse(localStorage.getItem("sathi_workspaces") || "[]");
    const filteredSessions = existingSessions.filter(s => s.id !== newSession.id);
    const updatedSessions = [newSession, ...filteredSessions].slice(0, 10);
    
    localStorage.setItem("sathi_workspaces", JSON.stringify(updatedSessions));
    
    // Notify child components to save their specific state
    window.dispatchEvent(new CustomEvent("manual-save-trigger"));
    
    alert("✅ DevSathi: Workspace Synced to Dashboard!");
  };

  // 🎯 THE SHIELD: Don't render until client is ready
  if (!mounted) {
    return <div className="h-screen bg-[#020617] flex items-center justify-center text-indigo-500 font-black tracking-widest animate-pulse uppercase text-xs">Syncing Sathi Engine...</div>;
  }

  return (
    <div className="h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans antialiased">
      {/* 🛠️ HEADER SECTION */}
      <header className="h-14 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50 shrink-0">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.back()}>
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
              <Zap size={18} fill="white" className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xs tracking-[0.2em] uppercase leading-none text-white/90">DevSathi</span>
              <span className="text-[7px] font-bold text-indigo-400 tracking-[0.3em] uppercase mt-1">AI Syllabus Engine</span>
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
                className={`px-6 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 tracking-tight ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleManualSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black transition-all shadow-lg"
          >
            <Check size={14} /> SAVE SESSION
          </button>
          
          <div className="w-[1px] h-6 bg-white/10" />

          <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer"><Settings size={18}/></button>
          
          <div 
            onClick={() => setShowAccount(true)}
            className="w-8 h-8 rounded-full bg-indigo-600 border border-white/20 flex items-center justify-center font-black text-white text-[10px] cursor-pointer hover:scale-105 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]"
          >
            MU
          </div>
        </div>
      </header>

      {/* 🚀 MAIN WORKSPACE GRID */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3 bg-black">
        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0f172a] shadow-2xl ${activeMode === "read" ? "flex-[1.5]" : activeMode === "dual" ? "w-[38%]" : "w-0 opacity-0 pointer-events-none -ml-3"}`}>
            <ResourceViewer onTextExtract={(text) => setPdfContext(text)} onAlchemyResponse={(text) => setAlchemyUpdate(text)} />
        </div>

        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0b] shadow-2xl ${activeMode === "read" ? "w-0 opacity-0 pointer-events-none -ml-3" : activeMode === "code" ? "flex-[2]" : "flex-1"}`}>
            <SathiCodeLab activeFileName="main.py" mode={activeMode} />
        </div>

        <div className={`h-full flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-[#0f172a] shadow-[0_0_40px_rgba(79,70,229,0.1)] ${activeMode === "read" ? "flex-1" : activeMode === "dual" ? "w-[420px]" : "flex-1" }`}>
              <CompanionAI mode={activeMode} lang={locale} context={pdfContext} alchemyResult={alchemyUpdate} />
        </div>
      </main>

      {/* 👤 PROFILE DRAWER */}
      {showAccount && <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={() => setShowAccount(false)} />}
      <div className={`fixed inset-y-0 right-0 z-[100] w-full max-w-xl bg-[#020617] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-white/5 transition-transform duration-500 ease-in-out transform ${showAccount ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-14 flex items-center justify-between px-8 border-b border-white/5 bg-[#0f172a]/50">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-left">Student Profile</span>
          <button onClick={() => setShowAccount(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><Trash2 size={20} /></button>
        </div>
        <div className="h-full overflow-y-auto custom-scrollbar pb-20">
          <ProfileModal /> 
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}