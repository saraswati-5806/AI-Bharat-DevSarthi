"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Loader2, BrainCircuit, Sparkles } from "lucide-react";

export default function ResourceViewer({ externalUrl }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewUrl, setViewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get('fileUrl');
    const nameParam = searchParams.get('name') || "Resource";
    const targetUrl = urlParam || externalUrl;

    if (targetUrl) {
      const decodedUrl = decodeURIComponent(targetUrl);
      let finalUrl = decodedUrl;
      if (decodedUrl.startsWith('s3://')) {
        const path = decodedUrl.replace('s3://', '').split('/');
        finalUrl = `https://${path[0]}.s3.amazonaws.com/${path.slice(1).join('/')}`;
      }
      setFileName(nameParam);
      setViewUrl(finalUrl);
      setIsLoaded(true);
    }
  }, [externalUrl]);

  return (
    <div className="h-full flex flex-col bg-[#0f172a] rounded-t-[2rem] overflow-hidden border border-white/5 relative">
      <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-[#0f172a]/95 z-20">
        <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <BrainCircuit size={12} /> RESOURCE CONTEXT
        </h3>
        {isLoaded && <span className="text-[8px] font-bold text-slate-500 uppercase truncate max-w-[100px]">{fileName}</span>}
      </div>

      <div className="flex-1 relative bg-[#020617]">
        {!isLoaded ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
              <FileText size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-white text-sm font-bold mb-2">Workspace Empty</h3>
            <p className="text-[11px] text-slate-500 max-w-[200px] mb-6">Select a file or add a local context file for Sathi AI.</p>
            
            <label className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
              <Upload size={14} /> Add Context File
              <input type="file" className="hidden" accept=".pdf" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFileName(file.name);
                    setViewUrl(URL.createObjectURL(file));
                    setIsLoaded(true);
                    setIsIframeLoading(false);
                  }
                }} 
              />
            </label>
          </div>
        ) : (
          <div className="h-full w-full relative bg-white">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] z-10">
                <Loader2 className="text-indigo-500 animate-spin mb-3" size={24} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Syncing Cloud Resource...</span>
              </div>
            )}
            <iframe 
              src={`${viewUrl}#toolbar=0&navpanes=0`} 
              className="w-full h-full border-none"
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>
        )}
      </div>

      {isLoaded && !isIframeLoading && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-indigo-600/90 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl z-30 animate-in slide-in-from-bottom-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><Sparkles size={16} className="text-white" /></div>
            <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-black text-white uppercase truncate">{fileName}</p>
                <p className="text-[7px] text-indigo-200 font-bold uppercase tracking-widest">Sathi Context Sync Active</p>
            </div>
        </div>
      )}
    </div>
  );
}