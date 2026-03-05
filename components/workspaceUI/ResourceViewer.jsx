"use client";

import { useState } from "react";
import { FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResourceViewer({ onTextExtract }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 🏆 This mock data simulates the "Syllabus" content
  const mockSyllabusText = `
    CHAPTER 1: PYTHON BASICS
    A Variable is a container (dabba) for storing data values. 
    In Python, variables are created the moment you first assign a value to it.
    Example: x = 5, y = "Sathi"
    
    Loops in Python:
    A 'for' loop is used for iterating over a sequence.
    A 'while' loop executes a set of statements as long as a condition is true.
  `;

  const handleMockUpload = () => {
    setIsLoaded(true);
    // 🚀 Send the text up to the page.jsx -> CompanionAI
    if (onTextExtract) {
      onTextExtract(mockSyllabusText);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      {/* INTERNAL HEADER (Matches Sathi style) */}
      <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0f172a]/50 backdrop-blur-md">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-3 h-3 text-indigo-400" /> SOURCE READER
        </h3>
        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
           <div className={`h-1.5 w-1.5 rounded-full ${isLoaded ? 'bg-emerald-500' : 'bg-slate-600'}`} />
           {isLoaded ? "SYLLABUS LOADED" : "NO SOURCE"}
        </div>
      </div>

      {/* VIEWPORT */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        {!isLoaded ? (
          <div className="max-w-xs space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-xl">
              <Upload className="text-slate-500" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">No Syllabus Detected</h4>
              <p className="text-[11px] text-slate-500 mt-1">Upload a PDF or use the demo syllabus to start the context-aware lab.</p>
            </div>
            <button 
              onClick={handleMockUpload}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black shadow-lg transition-all active:scale-95"
            >
              LOAD DEMO SYLLABUS
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-[#020617] rounded-2xl border border-white/5 p-8 text-left overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-6 text-emerald-500">
               <CheckCircle2 size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Syllabus: Python_Basics.pdf</span>
            </div>
            
            <pre className="text-[12px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
              {mockSyllabusText}
            </pre>
            
            <div className="mt-8 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex gap-3">
               <AlertCircle size={18} className="text-indigo-400 shrink-0" />
               <p className="text-[10px] text-indigo-300 italic leading-relaxed">
                 Sathi is now watching this content. You can ask questions about variables or loops in the AI Companion.
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}