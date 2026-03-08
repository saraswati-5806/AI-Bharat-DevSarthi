"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileText, Upload, CheckCircle2, Loader2, FileUp, X, 
  Sparkles, BrainCircuit, PlayCircle, Network, Youtube, 
  ArrowRight, Mic2, Download, Video
} from "lucide-react";

export default function ResourceViewer({ onTextExtract, onAlchemyResponse, externalUrl, externalName }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [viewUrl, setViewUrl] = useState("");
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const [processingId, setProcessingId] = useState(null); 
  const [ytUrl, setYtUrl] = useState("");
  const [sourceType, setSourceType] = useState("none");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleInitialLoad = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get('fileUrl');
      const nameParam = searchParams.get('name');

      const targetUrl = urlParam || externalUrl;
      const targetName = nameParam || externalName;

      if (targetUrl) {
        const url = decodeURIComponent(targetUrl);
        loadResource(url, targetName || "S3 Resource");
      } else {
        const saved = localStorage.getItem("sathi_active_resource");
        if (saved) {
          const data = JSON.parse(saved);
          loadResource(data.url, data.name, true);
        }
      }
    };

    handleInitialLoad();
  }, [externalUrl, externalName]);

  const loadResource = (url, name, isRestored = false) => {
    setFileName(name);
    
    // 🎯 FIX: Protocol Scheme Handler (s3:// to https://)
    let finalUrl = url;
    if (url.startsWith('s3://')) {
      const pathPart = url.replace('s3://', '');
      const parts = pathPart.split('/');
      const bucket = parts[0];
      const key = parts.slice(1).join('/');
      finalUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
    }

    let type = "document";
    if (finalUrl.includes("youtube.com") || finalUrl.includes("youtu.be")) type = "youtube";
    else if (finalUrl.toLowerCase().endsWith(".pdf") || finalUrl.includes("pdf")) type = "pdf";
    
    setSourceType(type);
    setViewUrl(finalUrl); 
    setIsLoaded(true);
    setExtractedKeywords(isRestored ? ["#RESTORED SESSION", "#INDEXED"] : ["#S3 SYNC ACTIVE", "#CONTEXT INDEXED"]);
    localStorage.setItem("sathi_active_resource", JSON.stringify({ url, name, type }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        loadResource(data.viewUrl, file.name);
        if (onTextExtract) onTextExtract(data.extractedText);
      }
    } catch (error) { console.error(error); } finally { setIsUploading(false); }
  };

  const processYoutube = () => {
    if (!ytUrl.includes("youtube.com") && !ytUrl.includes("youtu.be")) return alert("Invalid URL");
    setIsUploading(true);
    const videoId = ytUrl.split('v=')[1] || ytUrl.split('/').pop();
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    setTimeout(() => {
        loadResource(embedUrl, "Video Lecture");
        setIsUploading(false);
    }, 1500);
  };

  const runAlchemy = async (type) => {
    setProcessingId(type);
    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [{ role: "user", content: `Perform ${type} alchemy on this source.` }],
                mode: "alchemy",
                context: { alchemyType: type, source: fileName, sourceUrl: viewUrl }
            })
        });
        const data = await response.json();
        if (data.text && onAlchemyResponse) onAlchemyResponse(data.text);
        setExtractedKeywords([`${type.toUpperCase()} SYNCED`, "READY"]);
    } catch (err) { console.error(err); } finally { setProcessingId(null); }
  };

  const resetViewer = () => {
    localStorage.removeItem("sathi_active_resource");
    setIsLoaded(false);
    setSourceType("none");
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] rounded-t-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/80 backdrop-blur-md">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <BrainCircuit className="w-3 h-3" /> {sourceType === 'youtube' ? 'VIDEO LAB' : 'RESOURCE LAB'}
        </h3>
        {isLoaded && <button onClick={resetViewer} className="text-[9px] font-black text-slate-500 hover:text-red-400 uppercase transition-colors"><X size={12} /></button>}
      </div>

      <div className="flex-1 overflow-hidden relative">
        {!isLoaded ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.txt,.docx" className="hidden" />
            <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-dashed border-white/10 hover:border-indigo-500/50 cursor-pointer transition-all">
              {isUploading ? <Loader2 className="text-indigo-500 animate-spin" size={40} /> : <Upload className="text-slate-500" size={32} />}
            </div>
            <h4 className="text-md font-black text-white uppercase tracking-tight">Drop Sathi Resource</h4>
            <div className="mt-6 w-full max-w-[280px] relative group">
                <input type="text" placeholder="Paste YouTube Link..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 pl-10 text-[10px] text-slate-300 focus:outline-none focus:border-indigo-500/50" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} />
                <Youtube size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                {ytUrl && <button onClick={processYoutube} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 rounded-md"><ArrowRight size={10} className="text-white" /></button>}
            </div>
            <button onClick={() => fileInputRef.current.click()} className="mt-8 px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-indigo-600/20">Upload Document</button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col relative group">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
                {[
                    { id: 'summary', icon: <PlayCircle size={18} />, color: 'text-emerald-400', label: 'Summary' },
                    { id: 'mindmap', icon: <Network size={18} />, color: 'text-amber-400', label: 'Mindmap' },
                    { id: 'audio', icon: <Mic2 size={18} />, color: 'text-indigo-400', label: 'AI Voice' }
                ].map((action) => (
                    <button key={action.id} onClick={() => runAlchemy(action.id)} className="group relative p-3 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-indigo-600 hover:scale-110 shadow-2xl transition-all">
                        <span className={`${action.color} group-hover:text-white block`}>
                          {processingId === action.id ? <Loader2 size={18} className="animate-spin text-white" /> : action.icon}
                        </span>
                        <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-[8px] font-black text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity uppercase whitespace-nowrap pointer-events-none">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 w-full bg-[#1e1e1e] relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/50 animate-scan-line pointer-events-none z-20" />
              
              {sourceType === 'pdf' ? (
                <div className="w-full h-full bg-white relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
                    <Loader2 className="text-indigo-500 animate-spin" size={32} />
                  </div>
                  <iframe 
                    key={viewUrl}
                    src={`${viewUrl}#toolbar=0&navpanes=0`} 
                    className="w-full h-full border-none relative z-10" 
                    allowFullScreen 
                  />
                </div>
              ) : sourceType === 'youtube' ? (
                <iframe key={viewUrl} src={viewUrl} className="w-full h-full border-none" allowFullScreen />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#020617] animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                    <FileText size={32} className="text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{fileName}</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-2 max-w-[220px] leading-relaxed">
                    Resource Indexed. Preview is restricted for this format, but Sathi AI has full context.
                  </p>
                  <button onClick={() => window.open(viewUrl, '_blank')} className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-white transition-all">
                    <Download size={12} /> Download Original
                  </button>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-4 right-4 space-y-3 pointer-events-none">
                <div className="flex flex-wrap gap-2 pointer-events-auto">
                    {extractedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-indigo-300 rounded-lg uppercase transition-all">#{kw}</span>
                    ))}
                </div>
                <div className="p-4 bg-indigo-600/95 backdrop-blur-xl rounded-[1.5rem] border border-white/20 flex items-center gap-4 shadow-2xl pointer-events-auto">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      {sourceType === 'youtube' ? <Video size={20} className="text-white" /> : <Sparkles size={20} className="text-white" />}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-white uppercase truncate">{fileName}</p>
                      <p className="text-[8px] text-indigo-100 font-bold uppercase opacity-80">{processingId ? `Processing...` : "System Sync: Active"}</p>
                   </div>
                </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{` @keyframes scan-line { 0% { top: 0% } 100% { top: 100% } } .animate-scan-line { animation: scan-line 4s linear infinite; opacity: 0.3; } `}</style>
    </div>
  );
}