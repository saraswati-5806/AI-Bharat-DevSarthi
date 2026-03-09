"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { 
  Zap, BookOpen, Layout, Code as CodeIcon, 
  Settings, Check, X, Loader2, Database, Sparkles
} from "lucide-react";

// ✅ 1. DYNAMIC IMPORT: Locked and cleaned
const SathiCodeLab = dynamic(() => import("@/components/workspaceUI/CodeLab"), { 
  ssr: false,
  loading: () => (
    <div className="h-full bg-[#0a0a0b] rounded-[2.5rem] flex flex-col items-center justify-center border border-white/5">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Initializing Sathi-WASM...</span>
    </div>
  )
});

// Load other components dynamically to save memory
const CompanionAI = dynamic(() => import("@/components/workspaceUI/CompanionAI"), { ssr: false });
const ResourceViewer = dynamic(() => import("@/components/workspaceUI/ResourceViewer"), { ssr: false });
import ProfileModal from "../profile/ProfileModal";

const AWS_LAMBDA_URL = "https://6ngxltk6lgc3flyu3lyx4wdd7i0kiokm.lambda-url.us-east-1.on.aws/";

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale || "en"; 

  const [mounted, setMounted] = useState(false);
  const [activeMode, setActiveMode] = useState("dual"); 
  const [pdfContext, setPdfContext] = useState("");
  const [alchemyUpdate, setAlchemyUpdate] = useState(null);
  const [showAccount, setShowAccount] = useState(false);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // 🎯 AUTH & MOUNT PROTECTION
  useEffect(() => {
    setMounted(true);
    const savedUserRaw = localStorage.getItem("devSathiUser");
    if (!savedUserRaw) {
      router.push(`/${locale}/signup`);
      return;
    }
    setUser(JSON.parse(savedUserRaw));
  }, [locale, router]);

  if (!mounted) return (
    <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <h2 className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Initializing Sathi Engine...
      </h2>
    </div>
  );

  // 🎯 CLOUD SYNC: Saves the current learning session to Dashboard
  const handleManualSave = async () => {
    if (!user?.email) return;
    setSaving(true);
    
    const fileUrl = searchParams.get("fileUrl") || "internal://default";
    const fileName = searchParams.get("name") || "Untitled Study Session";

    const sessionData = {
      dataType: "workspace",
      email: user.email,
      workspaceId: `ws_${Date.now()}`,
      name: fileName,
      url: fileUrl,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      itemCategory: "workspace"
    };

    try {
      const res = await fetch(AWS_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData)
      });
      
      if (res.ok) {
        // Trigger local save events for Editor/Chat history
        window.dispatchEvent(new CustomEvent("manual-save-trigger"));
        alert("✨ DevSathi: Progress Synced to Command Center!");
      }
    } catch (err) {
      console.error("Cloud Save Failed:", err);
    }
    setSaving(false);
  };

  if (!mounted) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="text-indigo-500 animate-spin" size={32} />
    </div>
  );

  return (
    <div className="h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 🛠️ WORKSPACE HEADER */}
      <header className="h-14 flex items-center justify-between px-6 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-[60] shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push(`/${locale}/dashboard`)}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:-translate-x-1">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[10px] tracking-[0.2em] uppercase text-white/90 leading-none">DevSathi</span>
              <span className="text-[7px] font-bold text-indigo-400 tracking-[0.3em] uppercase mt-1">Smart Workspace</span>
            </div>
          </div>
          
          <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
            {[ 
              { id: 'read', label: 'THEORY', icon: <BookOpen size={12}/> }, 
              { id: 'dual', label: 'HYBRID', icon: <Layout size={12}/> }, 
              { id: 'code', label: 'BUILD', icon: <CodeIcon size={12}/> } 
            ].map((m) => (
              <button 
                key={m.id} 
                onClick={() => setActiveMode(m.id)} 
                className={`px-5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${activeMode === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleManualSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-[9px] font-black transition-all shadow-lg active:scale-95"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} 
            {saving ? "SAVING..." : "SYNC PROGRESS"}
          </button>
          
          <div className="w-[1px] h-6 bg-white/10" />
          
          <div 
            onClick={() => setShowAccount(true)}
            className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/20 flex items-center justify-center font-black text-white text-[10px] cursor-pointer hover:scale-105 transition-all shadow-xl uppercase"
          >
            {user?.name?.substring(0,2) || "S"}
          </div>
        </div>
      </header>

      {/* 🚀 WORKSPACE ENGINE GRID */}
      <main className="flex-1 flex overflow-hidden p-2 gap-2 bg-black">
        {/* Pane 1: ResourceViewer (PDF Interaction) */}
        <div className={`h-full flex flex-col transition-all duration-500 ease-in-out overflow-hidden rounded-[2rem] border border-white/5 bg-[#0f172a] ${activeMode === "read" ? "flex-[1.5]" : activeMode === "dual" ? "w-[38%]" : "w-0 opacity-0 pointer-events-none -ml-2"}`}>
            <ResourceViewer 
              fileUrl={searchParams.get("fileUrl")} 
              onTextExtract={(text) => setPdfContext(text)} 
              onAlchemyResponse={(text) => setAlchemyUpdate(text)} 
            />
        </div>

        {/* Pane 2: CodeLab (IDE & Terminal) */}
        <div className={`h-full flex flex-col transition-all duration-500 ease-in-out overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0b] ${activeMode === "read" ? "w-0 opacity-0 pointer-events-none -ml-2" : activeMode === "code" ? "flex-[2]" : "flex-1"}`}>
            <SathiCodeLab mode={activeMode} />
        </div>

        {/* Pane 3: CompanionAI (Vernacular Chat) */}
        <div className={`h-full flex flex-col transition-all duration-500 ease-in-out overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-[#0f172a] shadow-[0_0_40px_rgba(79,70,229,0.05)] ${activeMode === "read" ? "flex-1" : activeMode === "dual" ? "w-[400px]" : "flex-1" }`}>
            <CompanionAI mode={activeMode} lang={locale} context={pdfContext} alchemyResult={alchemyUpdate} />
        </div>
      </main>

      {/* Profile Modal Integration */}
      <ProfileModal 
        isOpen={showAccount} 
        onClose={() => setShowAccount(false)} 
        user={user} 
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}