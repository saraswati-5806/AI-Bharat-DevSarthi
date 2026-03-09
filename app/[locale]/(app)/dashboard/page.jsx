"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileModal from "../profile/ProfileModal"; 
import { 
  LayoutDashboard, FolderGit2, LogOut, Zap, Menu, Loader2, Plus, 
  Lock, Sparkles, Target, FileText, Clock, Globe, MessageSquare, Mic, Eye, Trash2 
} from "lucide-react";

const dashboardT = {
  en: { namaste: "Namaste", cmdCenter: "Command Center", vault: "The Vault", signOut: "Sign Out", newWorkspace: "New Workspace", progressTitle: "Semester Progress", recent: "Recent Sessions", roadmap: "Future Roadmap", quickActions: "Quick Actions", genQuiz: "Generate Quiz", askHindi: "Ask in Hindi", resume: "Your localized learning logic is synchronized.", fresh: "Start by uploading your syllabus to the vault.", deadlines: "Academic Deadlines", phase1: "Phase 1: Multimodal", p1Desc: "Vision-to-Code handwritten diagram recognition.", phase2: "Phase 2: Accessibility", p2Desc: "Voice-enabled coding for hands-free learning.", phase3: "Phase 3: Connectivity", p3Desc: "Offline-first PWA for rural Bharat connectivity.", d1: "DBMS Internal Assessment", d2: "Python Lab Journal Sub", d3: "MU Semester Finals" },
  hi: { namaste: "नमस्ते", cmdCenter: "कमांड सेंटर", vault: "द वॉल्ट", signOut: "साइन आउट", newWorkspace: "नया वर्कस्पेस", progressTitle: "सेमेस्टर प्रगति", recent: "हाल के सत्र", roadmap: "भविष्य का रोडमैप", quickActions: "त्वरित कार्रवाई", genQuiz: "क्विज़ बनाएं", askHindi: "हिंदी में पूछें", resume: "आपका स्थानीय शिक्षण तर्क सिंक हो गया है।", fresh: "वॉल्ट में अपना सिलेबस अपलोड करके शुरू करें।", deadlines: "समय सीमा", phase1: "चरण 1: मल्टीमॉडल", p1Desc: "हस्तलिखित आरेख पहचान से कोड बनाना।", phase2: "चरण 2: एक्सेसिबिलिटी", p2Desc: "आवाज-सक्षम कोडिंग।", phase3: "चरण 3: कनेक्टिविटी", p2Desc: "ग्रामीण भारत के लिए PWA।", d1: "DBMS आंतरिक मूल्यांकन", d2: "पायथन लैब जर्नल सबमिशन", d3: "MU सेमेस्टर फाइनल" },
  mr: { namaste: "नमस्कार", cmdCenter: "कमांड सेंटर", vault: "द वॉल्ट", signOut: "साइन आउट", newWorkspace: "नवीन वर्कस्पेस", progressTitle: "सेमिस्टर प्रगती", recent: "अलीकडील सत्र", roadmap: "भविष्यचा रोडमॅप", quickActions: "त्वरित कृती", genQuiz: "क्विझ तयार करा", askHindi: "मराठीत विचारा", resume: "तुमचे स्थानिक शिक्षण लॉजिक सिंक झाले आहे.", fresh: "वॉल्टमध्ये तुमचा अभ्यासक्रम अपलोड करून सुरुवात करा।", deadlines: "डेडलाईन्स", phase1: "टप्पा 1: मल्टीमॉडल", p1Desc: "डायग्राम ओळखून कोड तयार करणे.", phase2: "टप्पा 2: ॲक्सेसिबिलिटी", p2Desc: "व्हॉइस कोडिंग.", phase3: "टप्पा 3: कनेक्टिव्हिटी", p3Desc: "ग्रामीण भारतासाठी PWA.", d1: "DBMS अंतर्गत मूल्यांकन", d2: "पायथन लॅब जर्नल सबमिशन", d3: "MU सेमिस्टर फायनल" }
};

const AWS_LAMBDA_URL = "https://6ngxltk6lgc3flyu3lyx4wdd7i0kiokm.lambda-url.us-east-1.on.aws/"; 

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const urlLocale = params?.locale ?? "en";
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [manualDeadlines, setManualDeadlines] = useState([]);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ title: "", date: "" });

  const t = dashboardT[urlLocale] || dashboardT.en;

  // Background Cloud Sync
  const saveToCloud = async (itemData) => {
    if (!user?.email) return;
    try {
      fetch(AWS_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType: "workspace", email: user.email, workspaceId: itemData.id, ...itemData })
      });
    } catch (err) { console.error("Sync Error:", err); }
  };

  const handleDeleteDeadline = (id) => {
    setManualDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const DEADLINES = useMemo(() => {
    let base = user?.isDemo ? [
      { id: "demo-d1", title: t.d1, date: "Mar 15", type: "Exam" },
      { id: "demo-d2", title: t.d2, date: "Mar 18", type: "Submission" },
      { id: "demo-d3", title: t.d3, date: "Apr 10", type: "Finals" }
    ] : [];
    return [...manualDeadlines, ...base];
  }, [t, user, manualDeadlines]);

  const ROADMAP = useMemo(() => [
    { id: "roadmap-p1", title: t.phase1, desc: t.p1Desc, icon: <Eye size={16}/> },
    { id: "roadmap-p2", title: t.phase2, desc: t.p2Desc, icon: <Mic size={16}/> },
    { id: "roadmap-p3", title: t.phase3, desc: t.p3Desc, icon: <Globe size={16}/> }
  ], [t]);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      if (typeof window === 'undefined') return;
      
      const isAuth = localStorage.getItem("user_authenticated");
      const savedUserRaw = localStorage.getItem("devSathiUser");
      
      if (!isAuth || !savedUserRaw) {
        router.replace(`/${urlLocale}/signup`);
        return;
      }

      const savedUser = JSON.parse(savedUserRaw);
      setUser({ 
        ...savedUser, 
        displayName: (savedUser.name || "Student").split(" ")[0],
        initials: (savedUser.name || "S").split(" ").map(n => n[0]).join("").toUpperCase(),
        aiCredits: savedUser.isDemo ? 840 : 100,
        creditPercent: savedUser.isDemo ? "84%" : "10%",
        progress: savedUser.isDemo ? 62 : 0 
      });

      try {
        const res = await fetch(`${AWS_LAMBDA_URL}?email=${encodeURIComponent(savedUser.email)}&type=workspaces`);
        if (res.ok) {
          const cloudData = await res.json();
          setSessions(cloudData.filter(item => item.itemCategory !== "deadline"));
          setManualDeadlines(cloudData.filter(item => item.itemCategory === "deadline"));
        }
      } catch (err) { console.error("Cloud Error:", err); }
      setLoading(false);
    };
    fetchData();
  }, [urlLocale, router]);

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!newDeadline.title || !newDeadline.date) return;
    const deadlineData = { 
      id: `dl_${Date.now()}`,
      title: newDeadline.title, 
      date: new Date(newDeadline.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      type: "College",
      itemCategory: "deadline" 
    };
    setManualDeadlines(prev => [deadlineData, ...prev]);
    setIsAddingDeadline(false);
    setNewDeadline({ title: "", date: "" });
    saveToCloud(deadlineData);
  };

  if (!isMounted || loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>;

  return (
    <div className="min-h-screen flex bg-[#020617] text-white font-sans">
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
      
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} border-r border-slate-800 bg-[#0f172a] flex flex-col justify-between transition-all duration-300 z-50`}>
        <div>
          <div className="h-16 flex items-center px-6 justify-between border-b border-slate-800/50">
             {isSidebarOpen && <span className="font-black text-[10px] tracking-[0.2em] text-indigo-500 uppercase">Sathi Hub</span>}
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-indigo-500/10 rounded-lg text-slate-400 transition-colors"><Menu size={18} /></button>
          </div>
          <nav className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold border border-indigo-500/10"><LayoutDashboard size={18} /> {isSidebarOpen && t.cmdCenter}</button>
            <button onClick={() => router.push(`/${urlLocale}/vault`)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/5 text-slate-500 transition-all"><FolderGit2 size={18} /> {isSidebarOpen && t.vault}</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/50">
          <button onClick={() => { localStorage.removeItem("user_authenticated"); router.push(`/${urlLocale}`); }} className="w-full flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 rounded-xl hover:bg-red-500/5 transition-all"><LogOut size={18} /> {isSidebarOpen && t.signOut}</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push(`/${urlLocale}/dashboard`)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Zap size={18} fill="white" className="text-white" /></div>
              <span className="text-xl font-black tracking-tighter hidden md:block uppercase">DevSathi</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded-full border border-white/5">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AI Credits</div>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: user?.creditPercent || '0%' }} />
              </div>
              <div className="text-[9px] font-black text-indigo-400 tracking-widest">{user?.aiCredits}/1000</div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-xs shadow-lg uppercase cursor-pointer hover:scale-110 transition-all border-2 border-[#020617]" onClick={() => setIsProfileOpen(true)}>{user?.initials}</div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-4xl font-black tracking-tight leading-tight uppercase italic">{t.namaste}, {user?.displayName} 👋</h1>
              <p className="mt-2 font-medium text-slate-400">{user?.isDemo ? t.resume : t.fresh}</p>
            </div>
            
            <div className="p-8 rounded-[2.5rem] border bg-[#0f172a] border-slate-800 shadow-2xl shadow-indigo-500/5">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center"><Target size={20}/></div>
                    <h3 className="text-xs font-black uppercase tracking-widest">{t.progressTitle}</h3>
                  </div>
                  <span className="text-xl font-black text-indigo-500">{user?.progress || 0}%</span>
                </div>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-1000" style={{ width: `${user?.progress || 0}%` }} />
                </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> {t.recent}</h3>
              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions.map((s) => (
                    <div key={s.id || `session-${s.name}-${Math.random()}`} onClick={() => router.push(`/${urlLocale}/workspace?fileUrl=${encodeURIComponent(s.url || '')}&name=${encodeURIComponent(s.name || '')}`)} className="group p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4 relative">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500"><FileText size={16}/></div>
                        <span className="text-[8px] font-black text-slate-500 uppercase">{s.date}</span>
                      </div>
                      <h4 className="text-md font-black group-hover:text-indigo-400 transition-colors uppercase tracking-tight relative">{s.name}</h4>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-center">
                   <p className="text-slate-500 text-sm font-bold">No sessions synced to cloud yet.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={14} className="text-indigo-500" /> {t.roadmap}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ROADMAP.map((item) => (
                  <div key={item.id} className="p-5 rounded-[2rem] border bg-[#0f172a] border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                    <div className="absolute top-4 right-4 text-slate-700 group-hover:text-indigo-500 transition-colors"><Lock size={12}/></div>
                    <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="text-[10px] font-black uppercase tracking-tight mb-1">{item.title}</h4>
                    <p className="text-[9px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{t.quickActions}</h3>
              <div className="space-y-3">
                <button onClick={() => router.push(`/${urlLocale}/workspace`)} className="w-full p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-between group transition-all text-white active:scale-95"><span className="text-[10px] font-black uppercase tracking-widest">{t.newWorkspace}</span><Plus size={16} /></button>
                <button className="w-full p-4 border border-slate-800 rounded-2xl flex items-center justify-between group transition-all hover:bg-white/5 active:scale-95"><span className="text-[10px] font-black uppercase tracking-tighter">{t.askHindi}</span><MessageSquare size={16} className="text-indigo-500" /></button>
              </div>
            </div>

            <div className="p-6 rounded-[2.5rem] border bg-[#0f172a] border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.deadlines}</h3>
                <button onClick={() => setIsAddingDeadline(!isAddingDeadline)} className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition-all"><Plus size={14} /></button>
              </div>
              {isAddingDeadline && (
                <form onSubmit={handleManualAdd} className="mb-6 p-4 bg-black/20 rounded-2xl border border-indigo-500/20 animate-in slide-in-from-top-2">
                  <input type="text" placeholder="Title..." className="w-full bg-transparent border-b border-slate-700 p-2 text-xs outline-none mb-2 text-white" value={newDeadline.title} onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})} />
                  <div className="flex gap-2">
                    <input type="date" className="flex-1 bg-transparent border-b border-slate-700 p-2 text-[10px] outline-none text-slate-400" onChange={(e) => setNewDeadline({...newDeadline, date: e.target.value})} />
                    <button type="submit" className="px-3 py-1 bg-indigo-600 rounded-lg text-[10px] font-bold">Add</button>
                  </div>
                </form>
              )}
              <div className="space-y-6">
                {DEADLINES.map((d) => (
                  <div key={d.id || `deadline-${d.title}-${d.date}`} className="flex gap-4 group items-center">
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 bg-black/40 border border-white/5">
                      <span className="text-[8px] font-black text-indigo-500 uppercase">{d.date.split(' ')[0]}</span>
                      <span className="text-sm font-black">{d.date.split(' ')[1]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-tight">{d.title}</p>
                      <span className="text-[8px] font-bold text-slate-500 uppercase">{d.type}</span>
                    </div>
                    <button onClick={() => handleDeleteDeadline(d.id)} className="p-2 text-slate-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}