"use client";
import { useState, useEffect } from "react";
import { X, ShieldCheck, GraduationCap, Database, Sparkles, Zap, Loader2 } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  // 🎯 THREE-TIER DATA LOGIC
  // Fallback to demo if user prop is missing, otherwise use real cloud user
  const profileData = {
    name: user?.name || "Student",
    email: user?.email || "syncing@devsathi.ai",
    university: user?.university || "DevSathi Academy",
    course: user?.course || "Vernacular Learning Path",
    tier: user?.isDemo ? "Sathi Pro Member" : "Sathi Explorer",
    s3Used: user?.isDemo ? 1.24 : (user?.vaultSize || 0.05), // Real size or tiny placeholder
    creditsLeft: user?.aiCredits || 100
  };

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  // Logic for Progress Bars (5GB S3 Cap / 1000 Credit Cap)
  const totalS3 = 5;
  const totalCredits = 1000;
  const s3Percent = Math.min((profileData.s3Used / totalS3) * 100, 100);
  const creditPercent = Math.min((profileData.creditsLeft / totalCredits) * 100, 100);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden text-slate-200 animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 z-50 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Top Header Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>
        </div>

        <div className="px-8 pb-10">
          {/* Header Info Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 mb-8 gap-4">
            <div className="flex items-end gap-5">
              {/* Profile Initial Box */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-4xl border-8 border-[#0f172a] shadow-2xl uppercase">
                {getInitials(profileData.name)}
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                  {profileData.name} <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                </h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">{profileData.email}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-xl border border-indigo-500/20 uppercase tracking-[0.2em] shadow-sm">
              {profileData.tier}
            </span>
          </div>

          <div className="space-y-6">
            {/* 🎓 ACADEMIC INFO PANEL */}
            <div className="bg-[#020617]/50 p-6 rounded-[2rem] border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                 <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                   <GraduationCap size={12} className="text-indigo-500" /> Institution
                 </div>
                 <div className="text-sm font-bold text-white tracking-tight">{profileData.university}</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Course</div>
                 <div className="text-sm font-bold text-white tracking-tight">{profileData.course}</div>
              </div>
            </div>

            {/* ☁️ CLOUD STORAGE & AI QUOTA */}
            <div className="space-y-6 px-1">
              
              {/* S3 Storage Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-2 text-indigo-400">
                    <Database size={13} /> S3 Storage (Cloud)
                  </span>
                  <span className="text-slate-500">{profileData.s3Used} GB / {totalS3} GB</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden p-[2px] border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.4)]" 
                    style={{ width: `${s3Percent}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Credits Progress */}
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-2 text-purple-400">
                    <Sparkles size={13} /> Bedrock AI Tokens
                  </span>
                  <span className="text-slate-500">{profileData.creditsLeft} / {totalCredits}</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden p-[2px] border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                    style={{ width: `${creditPercent}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* 🚀 ACTIVE SYNC BADGE */}
            <div className="flex items-center justify-between p-5 rounded-[2rem] border border-white/5 bg-white/[0.02] mt-2 group hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-500/20 bg-[#020617] group-hover:scale-110 transition-transform">
                  <Zap size={20} className="text-indigo-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-tighter">AWS Bedrock Node</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Vernacular Engine: Online</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Syncing
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}