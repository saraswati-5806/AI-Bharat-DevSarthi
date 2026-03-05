"use client";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { 
  Play, Copy, Check, Terminal as TerminalIcon, 
  Loader2, Plus, X, FileCode 
} from "lucide-react";

export default function CodeLab({ 
  initialFiles = [{ name: "main.py", content: "# Welcome to Sathi\nprint('Hello World')" }],
  activeFileName: externalActiveFileName 
}) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("Sathi Multi-Lang System Online...\n");
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const activeFile = files[activeFileIndex] || files[0];

  function handleEditorDidMount(editor) { editorRef.current = editor; }

  // 🚀 Overwrite Insert Logic
  useEffect(() => {
    const handleInsert = () => {
      const codeToInsert = window.__SATHI_INSERT_CODE__;
      if (!codeToInsert) return;
      
      const updatedCode = codeToInsert;
      
      updateCurrentFileContent(updatedCode);
      if (editorRef.current) {
        editorRef.current.setValue(updatedCode);
        editorRef.current.focus();
      }
      window.__SATHI_INSERT_CODE__ = null;
    };
    window.addEventListener("insert-code-trigger", handleInsert);
    return () => window.removeEventListener("insert-code-trigger", handleInsert);
  }, [activeFileIndex, files]);

  const updateCurrentFileContent = (newContent) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].content = newContent;
    setFiles(newFiles);
  };

  const addNewFile = () => {
    const name = prompt("Enter file name (e.g. logic.cpp, query.sql, script.py):");
    if (name && !files.find(f => f.name === name)) {
      const newFiles = [...files, { name, content: "" }];
      setFiles(newFiles);
      setActiveFileIndex(newFiles.length - 1);
    }
  };

  const deleteFile = (index) => {
    if (files.length <= 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setActiveFileIndex(0);
  };

  const getLanguage = (fileName) => {
    if (fileName.endsWith('.cpp')) return 'cpp';
    if (fileName.endsWith('.sql')) return 'sql';
    return 'python';
  };

  const handleRun = () => {
    const latestCode = editorRef.current?.getValue() || activeFile.content;
    const lang = getLanguage(activeFile.name);
    setIsRunning(true);
    setTerminalOutput(prev => prev + `➜ Executing ${activeFile.name} [${lang.toUpperCase()}]...\n`);

    setTimeout(() => {
      if (lang === 'python') {
        const lines = latestCode.split("\n");
        const terminalLines = [];
        
        // --- Shared Simulator State ---
        const instanceMap = {}; // For Inheritance/Polymorphism
        const carState = { color: "Red", model: "Toyota", year: 2020, speed: 0 };

        const processLine = (line) => {
          const cleanLine = line.trim();
          if (!cleanLine || cleanLine.startsWith("#") || cleanLine.startsWith("class") || cleanLine.startsWith("def") || cleanLine === "pass") return;

          // 1. Inheritance Detection (e.g., dog = Dog())
          const creationMatch = cleanLine.match(/(\w+)\s*=\s*(\w+)\(\)/);
          if (creationMatch) {
            const [_, varName, className] = creationMatch;
            instanceMap[varName] = className.toLowerCase();
            return;
          }

          // 2. Stateful Object Detection (e.g., my_car = Car(...))
          if (cleanLine.includes("Car(") && cleanLine.includes("=")) {
            const argsMatch = cleanLine.match(/\((.*)\)/);
            if (argsMatch) {
              const args = argsMatch[1].split(",").map(s => s.trim().replace(/['"]/g, ""));
              carState.color = args[0] || carState.color;
              carState.model = args[1] || carState.model;
              carState.year = args[2] || carState.year;
            }
            return;
          }

          // 3. Method & Function Call Detection
          const callMatch = cleanLine.match(/(\w+)\((.*)\)/);
          if (callMatch) {
            const [_, funcOrObj, arg] = callMatch;
            const target = arg.includes(".") ? arg.split(".")[0] : arg;
            
            // Handle Polymorphism Sounds
            if (instanceMap[target]) {
              const type = instanceMap[target];
              if (type === "dog") terminalLines.push("> Woof!");
              else if (type === "cat") terminalLines.push("> Meow!");
              else if (type === "cow") terminalLines.push("> Moo!");
              return;
            }

            // Handle Car Methods
            if (cleanLine.includes(".accelerate(")) {
              const val = parseInt(cleanLine.match(/\((.*)\)/)[1]) || 0;
              carState.speed += val;
              terminalLines.push(`> The car has accelerated. Current speed: ${carState.speed} km/h`);
              return;
            }
            if (cleanLine.includes(".brake(")) {
              const val = parseInt(cleanLine.match(/\((.*)\)/)[1]) || 0;
              carState.speed = Math.max(0, carState.speed - val);
              terminalLines.push(`> The car has braked. Current speed: ${carState.speed} km/h`);
              return;
            }
            if (cleanLine.includes(".display_info()")) {
              terminalLines.push(`> Car Model: ${carState.model}\n> Car Color: ${carState.color}\n> Current Speed: ${carState.speed} km/h`);
              return;
            }

            // Standard Prints
            if (funcOrObj === "print") {
              let msg = arg.replace(/['"]/g, "");
              if (msg.includes("{self.speed}")) msg = msg.replace("{self.speed}", carState.speed);
              terminalLines.push(`> ${msg}`);
            }
          }
        };

        try { lines.forEach(line => processLine(line)); } 
        catch (err) { terminalLines.push("❌ Simulator Error."); }
        setTerminalOutput(prev => prev + (terminalLines.length ? terminalLines.join("\n") : "> Process finished.") + "\n✓ Done.\n");
      } else {
        setTerminalOutput(prev => prev + `> Simulated ${lang.toUpperCase()} output.\n✓ Done.\n`);
      }
      setIsRunning(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorRef.current?.getValue() || activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#1e1e1e] rounded-t-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
      {/* File Tabs */}
      <div className="h-10 bg-[#1e1e1e] flex items-center px-4 gap-1 border-b border-white/5 overflow-x-auto no-scrollbar">
        {files.map((file, i) => (
          <div key={i} onClick={() => setActiveFileIndex(i)} className={`flex items-center gap-2 px-3 h-8 rounded-t-lg cursor-pointer text-[11px] font-bold ${activeFileIndex === i ? 'bg-[#252526] text-white border-t border-indigo-500' : 'text-slate-500'}`}>
            <FileCode size={12} /> {file.name}
            {files.length > 1 && <X size={10} className="ml-2 hover:text-red-400" onClick={(e) => { e.stopPropagation(); deleteFile(i); }} />}
          </div>
        ))}
        <button onClick={addNewFile} className="p-1.5 text-slate-400 hover:text-white"><Plus size={14} /></button>
      </div>

      {/* Toolbar */}
      <div className="h-11 px-6 flex items-center justify-between bg-[#252526] border-b border-black/30">
        <div className="flex items-center gap-4">
           <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f56]" /><div className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
           <span className="text-[11px] font-mono text-slate-400 uppercase font-black tracking-widest">
             <span className="text-indigo-400">{getLanguage(activeFile.name).toUpperCase()}</span> {activeFile.name}
           </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 text-slate-400">{copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}</button>
          <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-2 px-5 py-1.5 rounded-xl text-[11px] font-black bg-emerald-600 text-white active:scale-95 transition-all">
            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="white" />} RUN CODE
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={getLanguage(activeFile.name)}
          theme="vs-dark"
          value={activeFile.content}
          onMount={handleEditorDidMount}
          onChange={(val) => updateCurrentFileContent(val || "")}
          options={{ fontSize: 14, fontFamily: "'Fira Code', monospace", minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false }}
        />
      </div>

      {/* Terminal */}
      <div className="h-40 bg-[#0f172a] border-t border-white/10 flex flex-col font-mono text-[12px]">
        <div className="h-8 px-4 flex items-center justify-between bg-black/40 border-b border-white/5">
          <div className="flex items-center gap-2"><TerminalIcon size={12} className="text-slate-500" /><span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sathi Logic Console</span></div>
          <button onClick={() => setTerminalOutput("Console Cleared...\n")} className="text-[9px] text-slate-600 hover:text-white uppercase font-bold">Clear</button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto text-emerald-400 whitespace-pre-wrap">{terminalOutput}</div>
      </div>
    </div>
  );
}