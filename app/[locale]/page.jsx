"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  Code2, Globe, ChevronRight, ArrowRight,
  Sparkles, Zap, Github, Youtube,
  FileSearch, Cpu, Columns3, LayoutDashboard,
  ShieldCheck, Database, Cloud, HardDrive, 
  WifiOff, BookText, Video, Map, Languages,
  Target, Rocket, Layers, Check, FileText, 
  Terminal, BookOpen, ExternalLink, Activity
} from "lucide-react";

const translations = {
  en: {
    navHome: "Home", navFeatures: "Features", navVault: "The Vault", navAbout: "About",
    heroTag: "POWERED BY AMAZON BEDROCK",
    heroTitle: "Your AI Coding Companion,",
    heroTitleGrad: "in Your Language.",
    heroSub: "Experience the all-in-one workspace for Bharat. Optimized for Mumbai University & regional excellence.",
    getStarted: "Get Started for Free", signIn: "Sign In",
    journeyTitle: "The AWS Journey",
    journeySub: "How we power your learning from 1 to 5.",
    featureTitle: "Bharat-First Engineering",
    featureSub: "Tailored for the unique needs of Indian students.",
    footerTag: "Empowering the next generation of IT professionals in Bharat.",
    handcrafted: "Handcrafted with ❤️ for Bharat’s Digital Future ✦ 2026. Powered by AWS GenAI."
  },
  mr: {
    navHome: "होम", navFeatures: "वैशिष्ट्ये", navVault: "व्हॉल्ट", navAbout: "बद्दल",
    heroTag: "AMAZON BEDROCK द्वारे समर्थित",
    heroTitle: "तुमचा AI कोडिंग सोबती,",
    heroTitleGrad: "तुमच्या भाषेत.",
    heroSub: "भारतासाठी सर्वसमावेशक वर्कस्पेस. मुंबई विद्यापीठ आणि प्रादेशिक उत्कृष्टतेसाठी अनुकूल.",
    getStarted: "विनामूल्य सुरुवात करा", signIn: "प्रवेश करा",
    journeyTitle: "AWS प्रवास",
    journeySub: "आम्ही तुमचे शिक्षण १ ते ५ मध्ये कसे सक्षम करतो.",
    featureTitle: "भारत-प्रथम अभियांत्रिकी",
    featureSub: "भारतीय विद्यार्थ्यांच्या गरजांनुसार तयार केलेले.",
    footerTag: "भारतातील आयटी व्यावसायिकांच्या पुढच्या पिढीला सक्षम करणे.",
    handcrafted: "भारताच्या डिजिटल भविष्यासाठी प्रेमाने तयार केलेले ✦ २०२६. AWS GenAI द्वारे समर्थित."
  }
};

const C = {
  bg0: "#020617", bg1: "#0f172a", 
  blue: "#6366f1", purple: "#a855f7",
  grad: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "rgba(255,255,255,0.08)",
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
  .glass-card:hover { border-color: ${C.blue}; transform: translateY(-5px); }
  .step-number { width: 40px; height: 40px; border-radius: 50%; background: ${C.grad}; display: flex; align-items: center; justify-content: center; font-weight: 900; margin-bottom: 16px; font-size: 14px; }
`;

export default function HomePage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params?.locale ?? "en";
  const t = translations[locale] || translations.en;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLangChange = (e) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      
      {/* 1. THE GLOBAL HEADER */}
      <header style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 80, 
        background: scrolled ? "rgba(2, 6, 23, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", transition: "0.3s"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}><Code2 size={24} color="white" /></div>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>DevSathi</span>
        </div>

        <nav style={{ display: "flex", gap: 40 }}>
          <a href="#home" className="nav-link">{t.navHome}</a>
          <a href="#journey" className="nav-link">Features</a>
          <a href="#features" className="nav-link">{t.navVault}</a>
          <a href="#footer" className="nav-link">{t.navAbout}</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Zap size={20} color="#fbbf24" style={{ cursor: "pointer" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e293b", padding: "6px 12px", borderRadius: 10 }}>
            <Globe size={16} color={C.blue} />
            <select onChange={handleLangChange} value={locale} style={{ background: "none", color: "white", border: "none", fontSize: 13, fontWeight: 600, outline: "none", cursor: "pointer" }}>
              <option value="en">English</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          <button onClick={() => router.push(`/${locale}/dashboard`)} className="ds-btn" style={{ padding: "10px 24px", fontSize: 14 }}>{t.signIn}</button>
        </div>
      </header>

      {/* 2. THE HERO SECTION */}
      <section id="home" style={{ minHeight: "100vh", padding: "160px 60px 100px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", background: "rgba(99,102,241,0.1)", borderRadius: 100, color: C.blue, fontSize: 12, fontWeight: 800, marginBottom: 32, border: "1px solid rgba(99,102,241,0.2)" }}>
          <Sparkles size={14} /> {t.heroTag}
        </div>
        <h1 style={{ fontSize: "clamp(48px, 7vw, 84px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", marginBottom: 24 }}>
          {t.heroTitle} <br />
          <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroTitleGrad}</span>
        </h1>
        <p style={{ fontSize: 20, color: "#94a3b8", maxWidth: 700, marginBottom: 48, lineHeight: 1.6 }}>{t.heroSub}</p>
        
        <button onClick={() => router.push(`/${locale}/dashboard`)} className="ds-btn" style={{ fontSize: 18, padding: "20px 48px" }}>
          {t.getStarted} <ArrowRight size={22} />
        </button>

        <div style={{ marginTop: 80, width: "100%", maxWidth: 1100, borderRadius: 32, border: `1px solid ${C.border}`, background: "#0f172a", padding: 12, boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
          <div style={{ background: C.bg0, borderRadius: 24, height: 500, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
             <img src="/api/placeholder/1100/500" alt="Workspace Preview" style={{ opacity: 0.5 }} />
             <div style={{ position: "absolute", textAlign: "center" }}>
               <LayoutDashboard size={64} color={C.blue} style={{ marginBottom: 16 }} />
               <p style={{ fontWeight: 800, color: "#475569" }}>WORKSPACE PREVIEW ACTIVE</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. THE AWS JOURNEY (HORIZONTAL 1-5) */}
      <section id="journey" style={{ padding: "120px 60px", background: "#000" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>{t.journeyTitle}</h2>
          <p style={{ color: "#64748b" }}>{t.journeySub}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
          {[
            { title: "Secure Identity", provider: "AWS Amplify", icon: <ShieldCheck />, desc: "One-tap secure login to your personalized workspace." },
            { title: "The Brain", provider: "Amazon Bedrock", icon: <Cpu />, desc: "Sub-second AI tutoring in Hindi & Marathi via Nova Lite." },
            { title: "The Vault", provider: "Amazon S3", icon: <Cloud />, desc: "A durable cloud library for all your college notes and PDFs." },
            { title: "Persistent Memory", provider: "Amazon DynamoDB", icon: <Database />, desc: "Sathi remembers your progress across all devices." },
            { title: "The Mastery", provider: "Multi-Panel UI", icon: <Layers />, desc: "5 engines integrated into one seamless adaptive screen." }
          ].map((step, i) => (
            <div key={i} className="glass-card">
              <div className="step-number">{i + 1}</div>
              <div style={{ color: C.blue, fontSize: 11, fontWeight: 800, marginBottom: 8, textTransform: "uppercase" }}>{step.provider}</div>
              <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>{step.title}</h4>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE BHARAT-FIRST FEATURE GRID */}
      <section id="features" style={{ padding: "120px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24 }}>{t.featureTitle}</h2>
            <p style={{ fontSize: 18, color: "#64748b", marginBottom: 40 }}>{t.featureSub}</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { icon: <Languages />, title: "Vernacular Logic", desc: "Explains 'Recursion' using analogies like 'Chai Recipe' or 'Mumbai Local' in regional languages." },
                { icon: <BookOpen />, title: "Syllabus Sync", desc: "Specifically tailored for Mumbai University & BSc IT curriculum patterns." },
                { icon: <WifiOff />, title: "Low-Bandwidth Optimization", desc: "Engineered for Bharat's mobile data users with minimal asset loading." }
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 20 }}>
                  <div style={{ color: C.blue }}>{f.icon}</div>
                  <div>
                    <h5 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{f.title}</h5>
                    <p style={{ fontSize: 14, color: "#64748b" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.gradSoft, borderRadius: 40, height: 500, border: `1px solid ${C.blue}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Terminal size={120} color={C.blue} opacity={0.2} />
          </div>
        </div>
      </section>

      {/* 5. THE PROFESSIONAL FOOTER */}
      <footer id="footer" style={{ background: "#000", padding: "100px 60px 40px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 80 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
               <div style={{ width: 32, height: 32, borderRadius: 8, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}><Code2 size={18} color="white" /></div>
               <span style={{ fontSize: 20, fontWeight: 900 }}>DevSathi</span>
            </div>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{t.footerTag}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "#1e293b", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
               <Cloud size={14} color={C.blue} /> Built on AWS
            </div>
          </div>

          <div>
            <h6 style={{ fontWeight: 800, marginBottom: 20, fontSize: 14 }}>Project Assets</h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" className="https://github.com/Pa-go/AI_Bharat_DevSarthi.git" style={{ display: "flex", alignItems: "center", gap: 8 }}><Github size={14}/> GitHub Repo</a>
              <a href="#" className="nav-link" style={{ display: "flex", alignItems: "center", gap: 8 }}><Youtube size={14}/> Submission Video</a>
            </div>
          </div>

          <div>
            <h6 style={{ fontWeight: 800, marginBottom: 20, fontSize: 14 }}>Documentation</h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" className="nav-link">How Sathi Works</a>
              <a href="#" className="nav-link">AWS Architecture</a>
            </div>
          </div>

          <div>
            <h6 style={{ fontWeight: 800, marginBottom: 20, fontSize: 14 }}>Support</h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" className="nav-link">MU Community</a>
              <a href="#" className="nav-link">Open Source</a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 40, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>{t.handcrafted}</p>
        </div>
      </footer>
    </>
  );
}