"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FolderGit2, FileText, ExternalLink, Search, Clock, Database, ArrowLeft, Loader2, HardDrive, Filter, Plus, TrendingUp } from "lucide-react";

export default function VaultPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [files, setFiles] = useState([
    { id: "v1", name: "DBMS_Notes_Full.pdf", size: "3.2 MB", date: "Mar 08", type: "PDF", category: "MU Syllabus", url: "s3://devsathi-student-notes-2026/1772967797606-DBMS.pdf" },
    { id: "v2", name: "Amplifiers_Unit_3.pdf", size: "1.8 MB", date: "Mar 08", type: "PDF", category: "Electronics", url: "s3://devsathi-student-notes-2026/1772967243912-Amplifiers.pptx.pdf" },
    { id: "v3", name: "Sets_Operations_AppliedMaths.pdf", size: "141 KB", date: "Mar 07", type: "PDF", category: "Maths", url: "s3://devsathi-student-notes-2026/1772968413257-Sets-Relation.docx.pdf" },
    { id: "v4", name: "UNIT_4_Cyber_IPR.pdf", size: "2.1 MB", date: "Mar 06", type: "PDF", category: "IPR Law", url: "s3://devsathi-student-notes-2026/1772967607349-UNIT_4_(1).pdf" }
  ]);

  useEffect(() => {
    setIsMounted(true);
    const saved = JSON.parse(localStorage.getItem("sathi_workspaces") || "[]");
    const userFiles = saved.filter(s => s.type === "PDF" && !s.id.startsWith('v')).map(s => ({
      id: s.id, name: s.name, size: "Uploaded", date: s.date, type: "PDF", category: "User Upload", url: s.url
    }));
    setFiles(prev => [...userFiles, ...prev]);
  }, []);

  const filtered = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isMounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  return (
    <div translate="no" className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button onClick={() => router.push(`/${locale}/dashboard`)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 mb-4 text-[10px] font-black uppercase tracking-widest transition-all hover:-translate-x-1"><ArrowLeft size={14} /> Back to Hub</button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-[1.5rem] flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5"><Database className="text-indigo-500" size={28} /></div>
              <div><h1 className="text-4xl font-black tracking-tighter uppercase italic">The Vault</h1><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2"><HardDrive size={10}/> AWS S3 Knowledge Base</p></div>
            </div>
          </div>
          <div className="relative group max-w-md w-full"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Search S3 resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs outline-none focus:border-indigo-500/50 transition-all" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-[2rem] space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">S3 Usage</p><div className="flex items-end gap-2 text-white"><span className="text-2xl font-black italic">1.24 GB</span><span className="text-[10px] text-slate-600 mb-1">/ 5 GB</span></div><div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[24%]" /></div></div>
          <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-[2rem] space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Resources</p><div className="text-2xl font-black italic text-white">{files.length} Docs</div><p className="text-[9px] text-emerald-500 uppercase flex items-center gap-1"><TrendingUp size={10} /> Syncing Live</p></div>
          <div onClick={() => router.push(`/${locale}/workspace`)} className="p-6 bg-indigo-600 rounded-[2rem] flex flex-col justify-center items-center group cursor-pointer hover:bg-indigo-500 transition-all text-white shadow-xl shadow-indigo-600/20"><Plus className="mb-1 group-hover:scale-110 transition-transform" strokeWidth={3} /><p className="text-[10px] font-black uppercase tracking-widest">Upload S3</p></div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-4"><Filter size={12} className="text-indigo-500" /> Resource Inventory</h3>
          <div className="grid grid-cols-1 gap-3">
            {filtered.map((file, idx) => (
              <div key={idx} className="group p-5 bg-[#0f172a] border border-slate-800/50 rounded-[2rem] flex items-center justify-between hover:border-indigo-500/40 transition-all hover:bg-indigo-500/[0.02]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-xs uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors">{file.name}</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded-md uppercase tracking-widest">{file.category}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-1"><Clock size={10}/> {file.date}</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter flex items-center gap-1"><Database size={10}/> {file.size}</span>
                    </div>
                  </div>
                </div>
                {/* 🎯 UPDATED ROUTE WITH URL PARAMS FOR REFRESH PROTECTION */}
                <button 
                  onClick={() => router.push(`/${locale}/workspace?fileUrl=${encodeURIComponent(file.url)}&name=${encodeURIComponent(file.name)}`)} 
                  className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                  Open in Lab <ExternalLink size={12} className="inline ml-1"/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}