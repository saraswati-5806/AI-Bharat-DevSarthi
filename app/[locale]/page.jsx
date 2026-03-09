"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Code2, Globe, ChevronRight, ArrowRight, Sparkles, Zap, 
  ShieldCheck, Cpu, Cloud, Database, Layers, Languages, 
  BookOpen, WifiOff, Terminal, FileSearch, Github, Youtube, 
  Activity, Target, Rocket
} from "lucide-react";

// 1. BRANDING & COLORS
const C = {
  bg0: "#020617", 
  bg1: "#0f172a",
  blue: "#6366f1", 
  purple: "#a855f7",
  grad: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "rgba(255,255,255,0.08)",
};

// 2. FULL TRANSLATION DICTIONARY (LOCKED & SYNCED)
const translations = {
  en: {
    nav: ["AWS Journey", "Architecture", "Impact"],
    tagline: "BHARAT'S VERNACULAR AI MISSION",
    heroH1: "Master Your Curriculum,",
    heroH1Grad: "in Your Mother Tongue.",
    heroSub: "The unified adaptive workspace combining the Textbook, Teacher, and Lab. Powered by Amazon Bedrock for Mumbai University excellence.",
    cta: "Launch Your Workspace",
    panel1: "CONTEXT (S3)",
    panel2: "REASONING (BEDROCK)",
    panel3: "EXECUTION (WASM)",
    journeyH2: "The AWS Infrastructure Journey",
    journeySub: "Designed for Bharat-scale with Serverless Efficiency.",
    proofH2: "Hallucination-Free by Design",
    proofSub: "Grounded in your syllabus using Amazon OpenSearch Serverless.",
    logicH2: "Concept Code-Switching",
    logicSub: "Bridging the gap between English syntax and Native logic.",
    archH2: "Transparent AI Reasoning",
    archSub: "Tracing your query through the AWS flow.",
    archStep1: "Student PDF",
    archStep2: "Vector DB",
    archStep3: "Nova Lite 2",
    impactTag: "ALIGNED WITH NEP 2020",
    impactH2: "Democratizing Tech Education",
    impactSub: "By removing the 'Language Tax,' DevSathi allows students to focus on logic first. Leveraging AWS Serverless to keep costs at an absolute minimum.",
    costVal: "₹8.00",
    costLabel: "Per Student / Month",
    costDesc: "Infrastructure pilot cost using AWS Lambda & Bedrock.",
    effVal: "40%",
    effLabel: "Mastery Speedup",
    effDesc: "Reduction in conceptual-to-code turnaround time.",
    roadmapH4: "Phase 1: Multimodal Vision",
    roadmapSub: "Capture paper sketches and watch Sathi generate logic instantly.",
    footerText: "Handcrafted for Bharat’s Digital Future ✦ 2026. Powered by AWS GenAI.",
    signupBtn: "Sign up"
  },
  hi: {
    nav: ["AWS यात्रा", "आर्किटेक्चर", "प्रभाव"],
    tagline: "भारत का वर्नाकुलर AI मिशन",
    heroH1: "अपने पाठ्यक्रम में महारत हासिल करें,",
    heroH1Grad: "अपनी मातृभाषा में।",
    heroSub: "पाठ्यपुस्तक, शिक्षक और लैब को जोड़ने वाला एकीकृत वर्कस्पेस। मुंबई विश्वविद्यालय के लिए Amazon Bedrock द्वारा संचालित।",
    cta: "वर्कस्पेस शुरू करें",
    panel1: "संदर्भ (S3)",
    panel2: "तर्क (BEDROCK)",
    panel3: "निष्पादन (WASM)",
    journeyH2: "AWS इन्फ्रास्ट्रक्चर यात्रा",
    journeySub: "सर्वरलेस दक्षता के साथ भारत-स्तर के लिए डिज़ाइन किया गया।",
    proofH2: "डिजाइन द्वारा मतिभ्रम-मुक्त",
    proofSub: "Amazon OpenSearch Serverless का उपयोग करके आपके सिलेबस पर आधारित।",
    logicH2: "कॉन्सेप्ट कोड-स्विचिंग",
    logicSub: "अंग्रेजी सिंटैक्स और देशी लॉजिक के बीच की दूरी को कम करना।",
    archH2: "पारदर्शी AI तर्क",
    archSub: "AWS प्रवाह के माध्यम से आपकी क्वेरी को ट्रैक करना।",
    archStep1: "छात्र PDF",
    archStep2: "वेक्टर DB",
    archStep3: "नोवा लाइट 2",
    impactTag: "NEP 2020 के साथ संरेखित",
    impactH2: "तकनीकी शिक्षा का लोकतंत्रीकरण",
    impactSub: "'भाषा कर' को हटाकर, DevSathi छात्रों को पहले लॉजिक पर ध्यान केंद्रित करने देता है। लागत को न्यूनतम रखने के लिए AWS सर्वरलेस का उपयोग।",
    costVal: "₹8.00",
    costLabel: "प्रति छात्र / माह",
    costDesc: "AWS लैम्ब्डा और बेडरॉक का उपयोग करके बुनियादी ढांचा लागत।",
    effVal: "40%",
    effLabel: "तेज महारत",
    effDesc: "कॉन्सेप्ट से कोड तक पहुंचने के समय में कमी।",
    roadmapH4: "चरण 1: मल्टीमॉडल विजन",
    roadmapSub: "कागज के स्केच कैप्चर करें और साथी को तुरंत लॉजिक बनाते हुए देखें।",
    footerText: "भारत के डिजिटल भविष्य के लिए निर्मित ✦ 2026. AWS GenAI द्वारा संचालित।",
    signupBtn: "साइन अप करें"
  },
  mr: {
    nav: ["AWS प्रवास", "आर्किटेक्चर", "प्रभाव"],
    tagline: "भारताचे वर्नाक्युलर AI मिशन",
    heroH1: "तुमचा अभ्यासक्रम आत्मसात करा,",
    heroH1Grad: "तुमच्या मातृभाषेत.",
    heroSub: "पाठ्यपुस्तक, शिक्षक आणि लॅब एकत्र आणणारे एकात्मिक वर्कस्पेस. मुंबई विद्यापीठासाठी Amazon Bedrock द्वारे समर्थित.",
    cta: "वर्कस्पेस सुरू करा",
    panel1: "संदर्भ (S3)",
    panel2: "तर्क (BEDROCK)",
    panel3: "अमलबजावणी (WASM)",
    journeyH2: "AWS इन्फ्रास्ट्रक्चर प्रवास",
    journeySub: "सर्व्हरलेस कार्यक्षमतेसह भारत-स्तरासाठी डिझाइन केलेले.",
    proofH2: "भ्रमाचा धोका नसलेले डिझाइन",
    proofSub: "Amazon OpenSearch Serverless वापरून तुमच्या अभ्यासक्रमावर आधारित.",
    logicH2: "संकल्पना कोड-स्विचिंग",
    logicSub: "इंग्रजी सिंटैक्स आणि स्थानिक लॉजिकमधील अंतर कमी करणे.",
    archH2: "पारदर्शक AI तर्क (Reasoning)",
    archSub: "AWS फ्लोद्वारे तुमच्या प्रश्नाचा मागोवा घेणे.",
    archStep1: "विद्यार्थी PDF",
    archStep2: "वेक्टर DB",
    archStep3: "नोव्हा लाइट २",
    impactTag: "NEP 2020 नुसार",
    impactH2: "तांत्रिक शिक्षणाचे लोकशाहीकरण",
    impactSub: "'भाषा कर' काढून टाकून, DevSathi विद्यार्थ्यांना लॉजिकवर लक्ष केंद्रित करण्यास मदत करते. अत्यल्प खर्चासाठी AWS सर्वरलेसचा वापर.",
    costVal: "₹8.00",
    costLabel: "प्रति विद्यार्थी / महिना",
    costDesc: "AWS लॅम्बडा आणि बेडरॉक वापरून इन्फ्रास्ट्रक्चर खर्च.",
    effVal: "40%",
    effLabel: "वेगवान प्रगती",
    effDesc: "संकल्पना समजून घेण्यापासून कोड करण्यापर्यंतच्या वेळेत घट.",
    roadmapH4: "टप्पा 1: मल्टीमॉडल व्हिजन",
    roadmapSub: "कागदावरील स्केचेस कॅप्चर करा आणि साथीला त्वरित लॉजिक तयार करताना पहा।",
    footerText: "भारताच्या डिजिटल भविष्यासाठी तयार केले ✦ 2026. AWS GenAI द्वारे समर्थित.",
    signupBtn: "साइन अप करा"
  }
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${C.bg0}; color: white; margin:0; }
  .ds-btn {
    background: ${C.grad}; color: white; font-weight: 700; padding: 14px 32px; border-radius: 12px; 
    display: inline-flex; align-items: center; gap: 10px; transition: 0.3s; cursor: pointer; border:none;
  }
  .ds-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(99,102,241,0.4); }
  .nav-link { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 600; transition: 0.2s; }
  .nav-link:hover { color: white; }
  .glass-card { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid ${C.border}; border-radius: 24px; padding: 32px; transition: 0.3s; }
  .step-number { width: 36px; height: 36px; border-radius: 50%; background: ${C.grad}; display: flex; align-items: center; justify-content: center; font-weight: 900; margin-bottom: 16px; font-size: 13px; }
  @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
`;

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const locale = params?.locale ?? "en";
  const t = translations[locale] || translations.en;

  if (!mounted) return <div style={{ background: C.bg0, minHeight: "100vh" }} />;

  return (
    <div className="notranslate" translate="no" suppressHydrationWarning> 
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
      {/* 1. GLOBAL HEADER */}
      <header style={{ position: "fixed", top: 0, width: "100%", height: 80, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", zIndex: 100, background: "rgba(2,6,23,0.8)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.grad, padding: 8, borderRadius: 10 }}><Code2 size={22} color="white"/></div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px" }}>DevSathi</span>
        </div>
        <nav style={{ display: "flex", gap: 32 }}>
          <a href="#journey" className="nav-link">{t.nav[0]}</a>
          <a href="#architecture" className="nav-link">{t.nav[1]}</a>
          <a href="#impact" className="nav-link">{t.nav[2]}</a>
          <a href="https://github.com/Pa-go/AI_Bharat_DevSarthi.git" target="_blank" className="nav-link">GitHub</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "100px", border: `1px solid ${C.border}` }}>
            <Globe size={16} color={C.blue} />
            <select value={locale} onChange={(e) => router.push(`/${e.target.value}`)} style={{ background: "none", color: "white", border: "none", fontSize: 13, fontWeight: 700, outline: "none", cursor: "pointer" }}>
              <option value="en" style={{color:"black"}}>English</option>
              <option value="hi" style={{color:"black"}}>हिन्दी</option>
              <option value="mr" style={{color:"black"}}>मराठी</option>
            </select>
          </div>
          <button onClick={() => router.push(`/${locale}/signup`)} className="ds-btn" style={{ padding: "10px 24px", fontSize: 14 }}>{t.signupBtn}</button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section style={{ padding: "160px 24px 80px", textAlign: "center" }}>
        {/* Vernacular Tagline */}
        <div style={{ display: "inline-flex", gap: 8, padding: "8px 16px", background: "rgba(99,102,241,0.1)", borderRadius: 100, color: "#6366f1", fontSize: 12, fontWeight: 800, marginBottom: 24, border: "1px solid rgba(99,102,241,0.2)" }}>
          <Sparkles size={14} /> {t.tagline}
        </div>
        
        {/* Main H1 */}
        <h1 style={{ fontSize: "clamp(48px, 7vw, 84px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", marginBottom: 24 }}>
          {t.heroH1} <br />
          <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroH1Grad}</span>
        </h1>
        
        {/* Sub-text */}
        <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 750, margin: "0 auto 48px", lineHeight: 1.6 }}>{t.heroSub}</p>
        
        {/* 🎯 THE SINGLE INSTANT DEMO CTA */}
        <button 
          onClick={() => {
            const demoUser = {
              name: "Priya (Demo)",
              email: "demo@devsathi.ai",
              university: "Mumbai University",
              course: "Computer Engineering",
              isDemo: true 
            };
            localStorage.setItem("devSathiUser", JSON.stringify(demoUser));
            localStorage.setItem("user_authenticated", "true");
            
            console.log(`🚀 Launching Demo Mode: Language set to ${locale.toUpperCase()}`);
            router.push(`/${locale}/dashboard`);
          }} 
          className="ds-btn" 
          style={{ fontSize: 18, padding: "20px 48px" }}
        >
          <Sparkles size={22} /> {locale === 'en' ? "Try Instant Demo" : (locale === 'hi' ? "डेमो देखें" : "डेमो पहा")}
        </button>
      </section>

      {/* 3. HERO VISUAL */}
      <section style={{ padding: "0 60px 100px", display: "flex", justifyContent: "center" }}>
        <div className="glass-card" style={{ width: "100%", maxWidth: "1200px", padding: "12px" }}>
          <div style={{ background: "#020617", borderRadius: "24px", overflow: "hidden", border: `1px solid ${C.border}` }}>
            <div style={{ height: "40px", background: "#1e293b", display: "flex", alignItems: "center", padding: "0 16px", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px" }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}></div><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }}></div><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }}></div></div>
              <div style={{ marginLeft: "20px", fontSize: "10px", color: "#64748b", fontWeight: 700 }}>DEV-SATHI // MU_WORKSPACE_V1 // PYTHON_LAB</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", height: "500px", background: C.border, gap: "1px" }}>
              <div style={{ background: "#020617", padding: "20px" }}><div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6366f1", marginBottom: 16 }}><FileSearch size={16}/> <span style={{ fontSize: 10, fontWeight: 800 }}>{t.panel1}</span></div><div style={{ height: "80%", border: "1px dashed #1e293b", borderRadius: 8 }}></div></div>
              <div style={{ background: "#0f172a", padding: "20px" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a855f7" }}><Cpu size={16}/> <span style={{ fontSize: 10, fontWeight: 800 }}>{t.panel2}</span></div><div style={{ color: "#22c55e", fontSize: 10, fontWeight: 800 }}>98.4% ✓</div></div><div style={{ height: "100px", background: "#1e293b", borderRadius: 12, marginBottom: 12 }}></div><div style={{ height: "150px", background: "rgba(168, 85, 247, 0.05)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: 12 }}></div></div>
              <div style={{ background: "#020617", padding: "20px" }}><div style={{ display: "flex", alignItems: "center", gap: 8, color: "#22c55e", marginBottom: 16 }}><Terminal size={16}/> <span style={{ fontSize: 10, fontWeight: 800 }}>{t.panel3}</span></div><div style={{ fontFamily: "monospace", fontSize: 11, color: "#4ade80", background: "#000", padding: 12, borderRadius: 8, height: "70%" }}>{`> python main.py\n> Understanding Logic...\n> Native Output Ready ✓`}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE AWS JOURNEY */}
      <section id="journey" style={{ padding: "120px 60px", background: "#000" }}>
        <h2 style={{ textAlign: "center", fontSize: 40, fontWeight: 900, marginBottom: 16 }}>{t.journeyH2}</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 80 }}>{t.journeySub}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
          {[
            { n: 1, svc: "AWS AMPLIFY", t: locale === 'en' ? "Identity" : (locale === 'hi' ? "पहचान" : "ओळख"), d: "Secure student vault." },
            { n: 2, svc: "AMAZON BEDROCK", t: "Nova Lite", d: "Vernacular brain." },
            { n: 3, svc: "AMAZON S3", t: locale === 'en' ? "Syllabus Vault" : (locale === 'hi' ? "तिजोरी" : "तिजोरी"), d: "Cloud storage." },
            { n: 4, svc: "OPENSEARCH", t: locale === 'en' ? "RAG Search" : (locale === 'hi' ? "सर्च" : "शोध"), d: "Anti-hallucination." },
            { n: 5, svc: "DYNAMODB", t: locale === 'en' ? "Memory" : (locale === 'hi' ? "याददाश्त" : "स्मृती"), d: "Persistence." }
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: "24px" }}>
              <div className="step-number">{s.n}</div>
              <div style={{ color: "#6366f1", fontSize: 10, fontWeight: 800 }}>{s.svc}</div>
              <h4 style={{ fontWeight: 800, fontSize: 16, margin: "10px 0" }}>{s.t}</h4>
              <p style={{ fontSize: 12, opacity: 0.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RAG PROOF */}
      <section id="proof" style={{ padding: "100px 60px", background: C.bg1 }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900 }}>{t.proofH2}</h2>
          <p style={{ color: "#64748b" }}>{t.proofSub}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 1100, margin: "0 auto" }}>
          <div className="glass-card" style={{ border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <Activity size={18} color="#ef4444" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 14, opacity: 0.6 }}>"I think the loop should work..."</p>
            <div style={{ marginTop: 20, color: "#ef4444", fontSize: 10, fontWeight: 800 }}>⚠️ HALLUCINATION RISK</div>
          </div>
          <div className="glass-card" style={{ border: `1px solid ${C.blue}` }}>
            <ShieldCheck size={18} color={C.blue} style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 14 }}>"Verified from Mumbai University Syllabus..."</p>
            <div style={{ marginTop: 20, color: "#22c55e", fontSize: 11, fontWeight: 800 }}>SOURCE: MU_Syllabus.pdf</div>
          </div>
        </div>
      </section>

      {/* 6. LOGIC SWITCHER */}
      <section style={{ padding: "100px 60px", background: "#000" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900 }}>{t.logicH2}</h2>
          <p style={{ color: "#64748b" }}>{t.logicSub}</p>
        </div>
        <div className="glass-card" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div><div style={{ fontSize: 10, fontWeight: 900, color: "#94a3b8", marginBottom: 8 }}>STANDARD ENGLISH</div><p style={{ fontSize: 14 }}>"Recursion is a function calling itself."</p></div>
            <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 40 }}><div style={{ fontSize: 10, fontWeight: 900, color: C.blue, marginBottom: 8 }}>NATIVE LOGIC</div><p style={{ fontSize: 14 }}>"जसं तुम्ही आरशासमोर उभं राहिल्यावर..."</p></div>
          </div>
        </div>
      </section>

      {/* 7. ARCHITECTURE TRACE */}
      <section id="architecture" style={{ padding: "120px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900 }}>{t.archH2}</h2>
          <p style={{ color: "#64748b" }}>{t.archSub}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 30, alignItems: "center" }}>
          <div style={{ textAlign: "center", width: 140 }}><div style={{ width: 60, height: 60, borderRadius: 16, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><BookOpen color={C.blue} /></div><span style={{ fontSize: 12, fontWeight: 800 }}>{t.archStep1}</span></div>
          <ChevronRight size={24} color="#1e293b" />
          <div style={{ textAlign: "center", width: 140 }}><div style={{ width: 60, height: 60, borderRadius: 16, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Database color={C.purple} /></div><span style={{ fontSize: 12, fontWeight: 800 }}>{t.archStep2}</span></div>
          <ChevronRight size={24} color="#1e293b" />
          <div style={{ textAlign: "center", width: 140 }}><div style={{ width: 60, height: 60, borderRadius: 16, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Cpu color="#22c55e" /></div><span style={{ fontSize: 12, fontWeight: 800 }}>{t.archStep3}</span></div>
        </div>
      </section>

      {/* 8. SOCIAL IMPACT & PRECISE CALCULATIONS */}
      <section id="impact" style={{ padding: "120px 60px", background: C.bg1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
          <div>
            <div style={{ display: "inline-flex", gap: 8, padding: "6px 12px", background: "rgba(34, 197, 94, 0.1)", borderRadius: 8, color: "#22c55e", fontSize: 10, fontWeight: 800, marginBottom: 16 }}><Target size={14} /> {t.impactTag}</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 24 }}>{t.impactH2}</h2>
            <p style={{ color: "#64748b", fontSize: 17, marginBottom: 40, lineHeight: 1.6 }}>{t.impactSub}</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Precise Price Card */}
              <div className="glass-card" style={{ padding: "24px", border: `1px solid ${C.blue}44` }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: C.blue }}>{t.costVal}</div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, marginBottom: 8 }}>{t.costLabel}</div>
                <p style={{ fontSize: 10, opacity: 0.5, lineHeight: 1.4 }}>{t.costDesc}</p>
              </div>
              {/* Mastery Metric Card */}
              <div className="glass-card" style={{ padding: "24px", border: `1px solid ${C.purple}44` }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: C.purple }}>{t.effVal}</div>
                <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, marginBottom: 8 }}>{t.effLabel}</div>
                <p style={{ fontSize: 10, opacity: 0.5, lineHeight: 1.4 }}>{t.effDesc}</p>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h4 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}><Rocket size={24} color={C.blue} /> {t.roadmapH4}</h4>
            <div style={{ height: 200, background: "#020617", borderRadius: 20, border: `1px solid ${C.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}><Activity size={40} color="#1e293b" /><p style={{ fontSize: 10, color: "#475569", marginTop: 8 }}>VISION ENGINE LOADING...</p></div>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "2px", background: C.blue, animation: "scan 3s infinite" }}></div>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", marginTop: 20 }}>{t.roadmapSub}</p>
          </div>
        </div>
      </section>
      
      {/* 9. FOOTER */}
      <footer style={{ padding: "100px 60px 40px", borderTop: `1px solid ${C.border}`, background: "#000" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: C.grad, padding: 6, borderRadius: 8 }}><Code2 size={18} color="white"/></div>
            <span style={{ fontSize: 18, fontWeight: 900 }}>DevSathi</span>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <a href="https://github.com/Pa-go/AI_Bharat_DevSarthi.git" target="_blank" className="nav-link">GitHub</a>
            <a href="#" className="nav-link">Submission Video</a>
            <a href="#architecture" className="nav-link">Architecture</a>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: C.blue, fontWeight: 800 }}>
              <WifiOff size={14} /> LOW-BANDWIDTH OPTIMIZED
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", borderTop: `1px solid ${C.border}`, paddingTop: 40 }}>
          <p style={{ fontSize: 12, color: "#475569", fontWeight: 700 }}>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
}