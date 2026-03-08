"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileModal from "@/app/[locale]/(app)/profile/profileModal"; 
import { LayoutDashboard, FolderGit2, LogOut, Zap, Menu, Loader2, Plus, Lock, Sparkles, BrainCircuit, Target, FileText, Code2, Clock, Moon, Sun, Globe, Award, MessageSquare, CheckCircle2, Mic, Eye } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { locale: urlLocale } = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sessions, setSessions] = useState([]);

  const DEADLINES = useMemo(() => [
    { title: "DBMS Internal Assessment", date: "Mar 15", type: "Exam" },
    { title: "Python Lab Journal Sub", date: "Mar 18", type: "Submission" },
    { title: "MU Semester Finals", date: "Apr 10", type: "Finals" }
  ], []);

  const ROADMAP = useMemo(() => [
    { title: "Phase 1: Multimodal", desc: "Vision-to-Code handwritten diagram recognition.", icon: <Eye size={16}/> },
    { title: "Phase 2: Accessibility", desc: "Voice-enabled coding for hands-free learning.", icon: <Mic size={16}/> },
    { title: "Phase 3: Connectivity", desc: "Offline-first PWA for rural Bharat connectivity.", icon: <Globe size={16}/> }
  ], []);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = () => {
      if (typeof window === 'undefined') return;
      
      const savedTheme = localStorage.getItem("devSathiTheme") || "dark";
      setIsDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") document.documentElement.classList.add('dark');

      const savedUser = JSON.parse(localStorage.getItem("devSathiUser") || '{"name":"MU Student"}');
      setUser({ 
        ...savedUser, 
        initials: savedUser.name?.[0] || "M", 
        university: "Mumbai University", 
        course: "B.E. Computer Engineering", 
        tier: "Sathi Pro Member", 
        s3Used: 1.24, 
        tokensUsed: 16 
      });

      const savedSessions = localStorage.getItem("sathi_workspaces");
      setSessions(savedSessions ? JSON.parse(savedSessions) : [
        { id: "v1", name: "DBMS_Unit_Complete_Notes.pdf", date: "Mar 08", type: "PDF", url: "s3://devsathi-student-notes-2026/1772967797606-DBMS.pdf" },
        { id: "v2", name: "Amplifiers_Handwritten_Notes.pdf", date: "Mar 08", type: "PDF", url: "s3://devsathi-student-notes-2026/1772967243912-Amplifiers.pptx.pdf" }
      ]);
      setLoading(false);
    };
    fetchData();
  }, [urlLocale]);

  if (!isMounted || loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Sathi Engine...</p>
    </div>
  );

  return (
    <div translate="no" className={`min-h-screen flex ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} transition-all duration-300 font-sans`}>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
      
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r ${isDarkMode ? 'border-slate-800 bg-[#0f172a]' : 'border-slate-200 bg-white'} flex flex-col justify-between transition-all duration-300 shrink-0 z-50`}>
        <div>
          <div className="h-16 flex items-center px-6 justify-between border-b border-slate-800/50">
             {isSidebarOpen && <span className="font-black text-[10px] tracking-[0.2em] text-indigo-500 uppercase">Sathi Hub</span>}
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-indigo-500/10 rounded-lg text-slate-400 transition-colors"><Menu size={18} /></button>
          </div>
          <nav className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/10"><LayoutDashboard size={18} /> {isSidebarOpen && "Command Center"}</button>
            <button onClick={() => router.push(`/${urlLocale}/vault`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 transition-all relative">
              <FolderGit2 size={18} /> {isSidebarOpen && "The Vault"}
              <span className="absolute right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/50">
          <button onClick={() => { localStorage.removeItem("devSathiUser"); router.push(`/${urlLocale}`); }} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 transition-all rounded-xl hover:bg-red-500/5 transition-all"><LogOut size={18} /> {isSidebarOpen && "Sign Out"}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <header className={`h-16 px-8 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-800 bg-[#0f172a]/50' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40`}>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/${urlLocale}/dashboard`)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg"><Zap size={18} fill="white" className="text-white" /></div>
              <span className="text-xl font-black tracking-tighter hidden md:block uppercase">DevSathi</span>
            </div>
            <div onClick={() => setIsProfileOpen(true)} className="hidden lg:flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded-full border border-white/5 cursor-pointer hover:bg-black/30 transition-all">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Credits</div>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[84%]" /></div>
              <div className="text-[9px] font-black text-indigo-400 tracking-widest">840/1000</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => {setIsDarkMode(!isDarkMode); document.documentElement.classList.toggle('dark');}} className="p-2 text-slate-400 hover:text-yellow-400 transition-all">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <div onClick={() => setIsProfileOpen(true)} className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-lg uppercase cursor-pointer hover:scale-105 transition-all">{user.initials}</div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="flex items-end justify-between">
              <div><h1 className="text-4xl font-black tracking-tight leading-tight uppercase italic">Namaste, {user.name} 👋</h1><p className="mt-2 font-medium text-slate-400">Your localized learning logic is synchronized.</p></div>
              <button onClick={() => router.push(`/${urlLocale}/workspace`)} className="px-6 py-3.5 bg-indigo-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all"><Plus size={18} strokeWidth={3}/> New Workspace</button>
            </div>
            
            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center"><Target size={20}/></div>
                    <h3 className="text-xs font-black uppercase tracking-widest">MU Semester Progress</h3>
                  </div>
                  <span className="text-xl font-black text-indigo-500">62%</span>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 w-[62%]" /></div>
                <div className="grid grid-cols-3 gap-4">
                  {['DBMS', 'Applied Maths', 'Operating Systems'].map((sub, i) => (
                    <div key={i} className="flex items-center gap-2 opacity-60"><CheckCircle2 size={12} className="text-indigo-500" /><span className="text-[9px] font-bold uppercase tracking-widest">{sub}</span></div>
                  ))}
                </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> Recent Sessions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((s) => (
                  <div 
                    key={s.id} 
                    /* 🎯 UPDATED ROUTE WITH URL PARAMS */
                    onClick={() => router.push(`/${urlLocale}/workspace?fileUrl=${encodeURIComponent(s.url || '')}&name=${encodeURIComponent(s.name || '')}`)} 
                    className="group p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500"><FileText size={16}/></div>
                      <span className="text-[8px] font-black text-slate-500 uppercase">{s.date}</span>
                    </div>
                    <h4 className="text-md font-black group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s.name}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={14} className="text-indigo-500" /> Future Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ROADMAP.map((item, i) => (
                  <div key={i} className="p-5 rounded-[2rem] border bg-[#0f172a] border-slate-800 relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-slate-700 group-hover:text-indigo-500 transition-colors"><Lock size={12}/></div>
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center mb-3">{item.icon}</div>
                    <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-[9px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => router.push(`/${urlLocale}/workspace?action=quiz`)} className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-between group transition-all text-white shadow-lg shadow-indigo-600/10"><span className="text-[10px] font-black uppercase tracking-widest">Generate Quiz</span><BrainCircuit size={16} className="opacity-50 group-hover:opacity-100" /></button>
                <button onClick={() => router.push(`/${urlLocale}/workspace?lang=hi`)} className="w-full p-4 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all hover:bg-white/5"><span className="text-[10px] font-black uppercase tracking-tighter">Ask in Hindi</span><MessageSquare size={16} className="text-indigo-500" /></button>
              </div>
            </div>

            <div className="p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">MU Deadlines</h3>
              <div className="space-y-6">
                {DEADLINES.map((d, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 bg-black/40">
                      <span className="text-[8px] font-black text-indigo-500 uppercase">{d.date.split(' ')[0]}</span>
                      <span className="text-sm font-black">{d.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1 border-b border-slate-800/50 pb-4 group-last:border-0">
                      <p className="text-[10px] font-black uppercase tracking-tight mb-1">{d.title}</p>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">{d.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}