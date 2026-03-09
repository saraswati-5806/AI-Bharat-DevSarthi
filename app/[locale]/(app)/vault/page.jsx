"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { FileText, ExternalLink, Search, Clock, Database, ArrowLeft, Loader2, HardDrive, Filter, Plus, TrendingUp, Ghost, UploadCloud } from "lucide-react";

const vaultT = {
  en: { back: "Back to Hub", title: "The Vault", subtitle: "AWS S3 Knowledge Base", searchPh: "Search S3 resources...", usage: "S3 Usage", total: "Total Resources", upload: "Upload S3", inventory: "Resource Inventory", open: "Open in Lab", docs: "Docs", empty: "Your Vault is empty", emptyDesc: "Start by uploading a resource." },
  hi: { back: "हब पर वापस जाएं", title: "द वॉल्ट", subtitle: "AWS S3 नॉलेज बेस", searchPh: "S3 संसाधनों को खोजें...", usage: "S3 उपयोग", total: "कुल संसाधन", upload: "S3 अपलोड", inventory: "संसाधन सूची", open: "लैब में खोलें", docs: "दस्तावेज़", empty: "आपका वॉल्ट खाली है", emptyDesc: "संसाधन अपलोड करके शुरुआत करें।" },
  mr: { back: "हबवर परत जा", title: "द वॉल्ट", subtitle: "AWS S3 नॉलेज बेस", searchPh: "S3 संसाधने शोधा...", usage: "S3 वापर", total: "एकूण संसाधने", upload: "S3 अपलोड", inventory: "संसाधन यादी", open: "लॅबमध्ये उघडा", docs: "दस्तावेझ", empty: "तुमचा वॉल्ट रिकामा आहे", emptyDesc: "संसाधन अपलोड करून सुरुवात करा।" }
};

const AWS_LAMBDA_URL = "https://6ngxltk6lgc3flyu3lyx4wdd7i0kiokm.lambda-url.us-east-1.on.aws/";

export default function VaultPage() {
  const router = useRouter();
  const { locale } = useParams();
  const fileInputRef = useRef(null);
  const t = vaultT[locale] || vaultT.en;
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchVaultData = async (userEmail, isDemo) => {
    try {
      const res = await fetch(`${AWS_LAMBDA_URL}?email=${encodeURIComponent(userEmail)}&type=workspaces`);
      const cloudData = res.ok ? await res.json() : [];
      const userFiles = cloudData.filter(item => item.itemCategory !== "deadline").map(s => ({
        id: s.workspaceId, name: s.name, size: s.size || "S3 Managed", date: s.date || "Today", type: "PDF", category: "Cloud Resource", url: s.url
      }));

      const demoFiles = isDemo ? [
        { id: "v1", name: "DBMS_Notes_Full.pdf", size: "3.2 MB", date: "Mar 08", type: "PDF", category: "MU Syllabus", url: "#" },
        { id: "v2", name: "Amplifiers_Unit_3.pdf", size: "1.8 MB", date: "Mar 08", type: "PDF", category: "Electronics", url: "#" }
      ] : [];

      setFiles([...userFiles, ...demoFiles]);
    } catch (err) { console.error("Vault Sync Error:", err); }
    setLoading(false);
  };

  useEffect(() => {
    setIsMounted(true);
    if (!locale) return;
    
    // ✅ Properly define savedUserRaw to fix the ReferenceError
    const savedUserRaw = localStorage.getItem("devSathiUser");
    
    if (!savedUserRaw) {
      router.push(`/${locale}/signup`);
      return;
    }
    
    const savedUser = JSON.parse(savedUserRaw);
    setUser(savedUser);

    if (savedUser.email) {
      fetchVaultData(savedUser.email, savedUser.isDemo);
    }
  }, [locale, router]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);

    try {
      const res = await fetch(`${AWS_LAMBDA_URL}?email=${user.email}&action=getUploadUrl&file=${encodeURIComponent(file.name)}`);
      const { uploadUrl, fileKey } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

      const metadata = {
        dataType: "workspace",
        email: user.email,
        workspaceId: `file_${Date.now()}`,
        name: file.name,
        url: `https://devsathi-vault-uploads.s3.amazonaws.com/${fileKey}`,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        itemCategory: "workspace"
      };

      await fetch(AWS_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata)
      });

      fetchVaultData(user.email, user.isDemo);
    } catch (err) { alert("Upload failed"); }
    setUploading(false);
  };

  const totalSize = files.reduce((acc, f) => acc + (parseFloat(f.size) || 0), 0).toFixed(2);
  const usagePercent = Math.min((totalSize / 5000) * 100, 100);

  if (!isMounted || loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button onClick={() => router.push(`/${locale}/dashboard`)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 mb-4 text-[10px] font-black uppercase tracking-widest transition-all">
              <ArrowLeft size={14} /> {t.back}
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20"><Database className="text-indigo-500" size={28} /></div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t.title}</h1>
            </div>
          </div>
          <div className="relative group max-w-md w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder={t.searchPh} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-[2rem] space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.usage}</p>
            <div className="flex items-end gap-2 text-white">
              <span className="text-2xl font-black italic">{totalSize} MB</span>
              <span className="text-[10px] text-slate-600 mb-1">/ 5 GB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
          <div className="p-6 bg-[#0f172a] border border-slate-800 rounded-[2rem] space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.total}</p>
            <div className="text-2xl font-black italic text-white">{files.length} {t.docs}</div>
          </div>
          <div onClick={() => fileInputRef.current.click()} className="p-6 bg-indigo-600 rounded-[2rem] flex flex-col justify-center items-center group cursor-pointer hover:bg-indigo-500 transition-all text-white shadow-xl shadow-indigo-600/20 active:scale-95">
            {uploading ? <Loader2 className="animate-spin mb-1" /> : <UploadCloud className="mb-1" strokeWidth={3} />}
            <p className="text-[10px] font-black uppercase tracking-widest">{t.upload}</p>
          </div>
        </div>

        <div className="space-y-4 pb-20">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-4"><Filter size={12} className="text-indigo-500" /> {t.inventory}</h3>
          <div className="grid grid-cols-1 gap-3">
            {files.length > 0 ? (
              files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((file) => (
                <div key={file.id} className="group p-5 bg-[#0f172a] border border-slate-800 rounded-[2rem] flex items-center justify-between hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-indigo-400"><FileText size={20} /></div>
                    <div className="space-y-1">
                      <h4 className="font-black text-xs uppercase text-slate-300">{file.name}</h4>
                      <div className="flex gap-4 text-[9px] font-bold text-slate-600 uppercase">
                        <span><Clock size={10} className="inline mr-1"/> {file.date}</span>
                        <span><Database size={10} className="inline mr-1"/> {file.size}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => window.open(file.url, '_blank')} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest">
                    {t.open} <ExternalLink size={12} className="inline ml-1"/>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-20 border-2 border-dashed border-slate-800 rounded-[3rem] text-center space-y-4">
                <Ghost size={40} className="mx-auto text-slate-700" />
                <h3 className="text-xl font-black uppercase italic text-slate-400">{t.empty}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}