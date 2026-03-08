"use client";

import { X, ShieldCheck, GraduationCap, Cloud, Database, Sparkles, Zap } from "lucide-react";

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // 🎯 HARDCODED DATA FOR PRIYA (MATCHES SCREENSHOT LOGIC)
  const profileData = {
    name: "Priya",
    email: "priya@mu.ac.in",
    university: "Mumbai University",
    course: "B.E. Computer Engineering",
    tier: "Sathi Pro Member",
    s3Used: 1.24, // 1.24 GB
    creditsLeft: 84 // 84 Credits left
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Logic for Progress Bars
  const totalS3 = 5;
  const totalCredits = 100;
  const s3Percent = (profileData.s3Used / totalS3) * 100;
  const creditPercent = (profileData.creditsLeft / totalCredits) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-slate-800 overflow-hidden text-slate-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Top Header Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="px-8 pb-10">
          {/* Header Info Block */}
          <div className="flex justify-between items-end -mt-12 mb-8">
            <div className="flex items-end gap-5">
              {/* Profile Initial Box */}
              <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-4xl border-8 border-[#0f172a] shadow-2xl">
                {getInitials(profileData.name)}
              </div>
              <div className="pb-2">
                <h2 className="text-3xl font-black text-white flex items-center gap-2 tracking-tight">
                  {profileData.name} <ShieldCheck size={22} className="text-emerald-500" />
                </h2>
                <p className="text-sm font-bold text-slate-500">{profileData.email}</p>
              </div>
            </div>
            {/* Status Badge */}
            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-xl border border-indigo-500/20 mb-2 uppercase tracking-[0.2em]">
              {profileData.tier}
            </span>
          </div>

          <div className="space-y-8">
            {/* 🎓 ACADEMIC INFO PANEL */}
            <div className="bg-[#020617] p-6 rounded-[2rem] border border-slate-800 grid grid-cols-2 gap-8">
              <div className="space-y-1">
                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                   <GraduationCap size={12} /> Institution
                 </div>
                 <div className="text-md font-bold text-white">{profileData.university}</div>
              </div>
              <div className="space-y-1">
                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Course</div>
                 <div className="text-md font-bold text-white">{profileData.course}</div>
              </div>
            </div>

            {/* ☁️ CLOUD STORAGE & AI QUOTA */}
            <div className="space-y-6 px-2">
              
              {/* S3 Storage Logic */}
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2 text-blue-400">
                    <Database size={14} /> S3 Storage
                  </span>
                  <span className="text-slate-500">{profileData.s3Used} GB / {totalS3} GB</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${s3Percent}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Credits Logic */}
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2 text-purple-400">
                    <Sparkles size={14} /> AI Spark Credits
                  </span>
                  <span className="text-slate-500">{profileData.creditsLeft} Left</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-purple-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${creditPercent}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* 🚀 ACTIVE SYNC BADGE */}
            <div className="flex items-center justify-between p-5 rounded-[1.5rem] border border-indigo-500/20 bg-indigo-500/5 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-500/20 bg-[#020617]">
                  <Zap size={20} className="text-indigo-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-tighter">Active Sync</div>
                  <div className="text-[11px] text-slate-500 font-medium tracking-tight">Vernacular Engine is live via AWS Bedrock</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}