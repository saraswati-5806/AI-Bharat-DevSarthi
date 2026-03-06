"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  Code2, Globe, ChevronRight, ArrowRight,
  Sparkles, Zap, Github, Youtube,
  FileSearch, Cpu, Columns3, LayoutDashboard,
  ShieldCheck, Database, Cloud, HardDrive, 
  WifiOff, BookText, Video, Map, Languages,
  Target, Rocket, Layers, Check, CreditCard,
  FileText, Share2, Terminal, BookOpen
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSLATIONS DICTIONARY (Updated with 22+ Languages & 3-Panel Story)
   ═══════════════════════════════════════════════════════════════════════════ */
const translations = {
  en: {
    navHome: "Home", navFeatures: "Tech Stack", navVault: "The Vault", navPricing: "Cost Strategy", navAbout: "About",
    heroTitle: "Empowering Bharat's Students,",
    heroTitleGrad: "in 22+ Languages.",
    heroSub: "The all-in-one vernacular workspace powered by Amazon Bedrock. Optimized for Mumbai University students.",
    getStarted: "Get Started (Demo Access)", signIn: "Sign In", 
    journeyTitle: "The AWS Journey",
    journeySub: "Built for Bharat-scale with Serverless Efficiency.",
    adaptiveTitle: "Adaptive 3-Panel Mastery",
    adaptiveDesc: "Stop switching tabs. Our fluid 3-panel environment—Context, Reasoning, and Vault—breaks the language barrier. Analyze MU PDFs or debug code with AI tutoring in Marathi, Hindi, and 22+ official Indian languages.",
    vaultTitle: "The Vault: Academic RAG",
    vaultDesc: "Powered by Amazon S3 and Bedrock, the Vault turns static syllabus PDFs into interactive personal tutors. Real-time tutoring that understands your mother tongue.",
    aboutTitle: "Our Mission for Bharat",
    aboutDesc: "Democratizing technical education by combining AWS Generative AI with regional language logic for every student in India.",
    pricingTitle: "Zero-Entry Strategy",
    pricingSub: "AWS-First Implementation for Maximum Cost Efficiency.",
    footerTag: "Empowering the next generation of IT professionals in Bharat.",
    resources: "Resources", demoVideo: "Demo Video", architecture: "AWS Architecture", techDocs: "Technical Docs"
  },
  mr: {
    navHome: "मुख्यपृष्ठ", navFeatures: "टेक स्टॅक", navVault: "व्हॉल्ट", navPricing: "किंमत धोरण", navAbout: "बद्दल",
    heroTitle: "भारतातील विद्यार्थ्यांना सक्षम करणे,",
    heroTitleGrad: "२२+ भाषांमध्ये.",
    heroSub: "Amazon Bedrock द्वारे समर्थित पहिले प्रादेशिक वर्कस्पेस. मुंबई विद्यापीठाच्या विद्यार्थ्यांसाठी विशेषतः डिझाइन केलेले.",
    getStarted: "सुरुवात करा (डेमो)", signIn: "प्रवेश करा", 
    adaptiveTitle: "अडॅप्टिव्ह ३-पॅनेल मास्टरी",
    adaptiveDesc: "टॅब बदलणे थांबवा. आमचे ३-पॅनेल वातावरण—Context, Reasoning, आणि Vault—भाषेचा अडथळा दूर करते. मराठी, हिंदी आणि २२+ भारतीय भाषांमध्ये मार्गदर्शन मिळवा.",
    vaultTitle: "व्हॉल्ट: शैक्षणिक RAG",
    vaultDesc: "S3 आणि Bedrock द्वारे समर्थित, हा व्हॉल्ट तुमच्या सिलॅबसला एका वैयक्तिक ट्यूटरमध्ये रूपांतरित करतो जो तुमच्या भाषेत बोलतो.",
    aboutTitle: "भारतासाठी आमचे ध्येय",
    aboutDesc: "प्रादेशिक भाषा समर्थनासह AWS GenAI ला जोडून, आम्ही भारतातील प्रत्येक विद्यार्थ्यासाठी तांत्रिक शिक्षण सुलभ करत आहोत.",
    pricingTitle: "झिरो-एंट्री स्ट्रॅटेजी",
    pricingSub: "जास्तीत जास्त खर्च कार्यक्षमतेसाठी AWS-First अंमलबजावणी.",
    footerTag: "भारतातील आयटी व्यावसायिकांच्या पुढच्या पिढीला सक्षम करणे.",
    resources: "संसाधने", demoVideo: "डेमो व्हिडिओ", architecture: "AWS आर्किटेक्चर", techDocs: "तांत्रिक दस्तऐवज"
  },
  hi: {
    navHome: "होम", navFeatures: "टेक स्टैक", navVault: "वॉल्ट", navPricing: "लागत रणनीति", navAbout: "परिचय",
    heroTitle: "भारत के छात्रों को सशक्त बनाना,",
    heroTitleGrad: "22+ भाषाओं में।",
    heroSub: "Amazon Bedrock द्वारा संचालित ऑल-इन-वन क्षेत्रीय वर्कस्पेस। मुंबई विश्वविद्यालय के छात्रों के लिए विशेष रूप से निर्मित।",
    getStarted: "शुरू करें (डेमो)", signIn: "साइन इन करें", 
    adaptiveTitle: "अडॅप्टिव्ह 3-पैनल मास्टरी",
    adaptiveDesc: "टैब बदलना बंद करें। हमारा 3-पैनल वातावरण—Context, Reasoning, और Vault—भाषा की बाधा को तोड़ता है। मराठी, हिंदी और 22+ भारतीय भाषाओं में ट्यूशन प्राप्त करें।",
    vaultTitle: "वॉल्ट: शैक्षणिक RAG",
    vaultDesc: "S3 और Bedrock द्वारा संचालित, यह वॉल्ट आपके सिलेबस को एक व्यक्तिगत ट्यूटर में बदल देता है जो आपकी अपनी भाषा समझता है।",
    aboutTitle: "भारत के लिए हमारा लक्ष्य",
    aboutDesc: "क्षेत्रीय भाषा समर्थन के साथ AWS GenAI को जोड़कर, हम भारत के हर छात्र के लिए तकनीकी शिक्षा का लोकतंत्रीकरण कर रहे हैं।",
    pricingTitle: "जीरो-एंट्री रणनीति",
    pricingSub: "अधिकतम लागत दक्षता के लिए AWS-First कार्यान्वयन।",
    footerTag: "भारत के आईटी पेशेवरों की अगली पीढ़ी को सशक्त बनाना।",
    resources: "संसाधन", demoVideo: "डेमो वीडियो", architecture: "AWS आर्किटेक्चर", techDocs: "तकनीकी दस्तावेज़"
  }
};

const C = {
  bg0: "#020617", bg1: "#0f172a", bg2: "#1e293b",
  blue: "#6366f1", purple: "#7c3aed",
  grad: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
  gradSoft: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(124,58,237,0.15) 100%)",
  border: "#1e293b",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
  html { scroll-behavior: smooth; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; margin:0; padding:0; }
  .ds-btn {
    background: ${C.grad}; color: #fff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; text-decoration: none;
  }
  .ds-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
  .nav-link { color: inherit; text-decoration: none; font-size: 14px; font-weight: 600; opacity: 0.7; transition: 0.2s; }
  .nav-link:hover { opacity: 1; color: ${C.blue}; }
  .aws-card:hover { border-color: ${C.blue}; transform: translateY(-5px); box-shadow: 0 10px 30px rgba(99,102,241,0.1); }
`;

function Header({ t, locale, isDarkMode, setIsDarkMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLangChange = (e) => {
    const newLocale = e.target.value;
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header style={{ 
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 75, 
      background: isDarkMode ? (scrolled ? "rgba(2,6,23,0.85)" : "transparent") : (scrolled ? "rgba(255,255,255,0.9)" : "transparent"),
      backdropFilter: scrolled ? "blur(20px)" : "none", 
      borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, 
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", transition: "0.3s" 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center" }}><Code2 size={20} color="white" /></div>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>DevSathi</div>
          <div style={{ fontSize: 9, color: C.blue, fontWeight: "700", textTransform: "uppercase" }}>Empowering Bharat</div>
        </div>
      </div>
      <nav style={{ display: "flex", gap: 32 }}>
        <a href="#hero" className="nav-link">{t.navHome}</a>
        <a href="#features" className="nav-link">{t.navFeatures}</a>
        <a href="#vault" className="nav-link">{t.navVault}</a>
        <a href="#pricing" className="nav-link">{t.navPricing}</a>
        <a href="#about" className="nav-link">{t.navAbout}</a>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Zap size={20} fill={isDarkMode ? "#fbbf24" : "none"} color={isDarkMode ? "#fbbf24" : "#64748b"} />
        </button>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Globe size={16} style={{ position: "absolute", left: 10, color: C.blue }} />
          <select value={locale} onChange={handleLangChange} style={{ background: isDarkMode ? "#1e293b" : "#f1f5f9", color: "inherit", border: "none", padding: "6px 12px 6px 34px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", appearance: "none", cursor: "pointer" }}>
            <option value="en">EN</option><option value="hi">हि</option><option value="mr">मरा</option>
          </select>
        </div>
        <button onClick={() => router.push(`/${locale}/signup`)} className="ds-btn">
          {t.signIn} <ArrowRight size={16} /> 
        </button>
      </div>
    </header>
  );
}

export default function HomePage() {
  const params = useParams();
  const locale = params?.locale ?? "en";
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const t = translations[locale] || translations.en;

  useEffect(() => { 
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = C.bg0;
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [isDarkMode]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <div style={{ background: isDarkMode ? C.bg0 : "#ffffff", color: isDarkMode ? "white" : "#020617", transition: "0.4s" }}>
        
        <Header t={t} locale={locale} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* 1. HERO SECTION */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 24px 80px" }}>
          <div style={{ textAlign: "center", maxWidth: 1100 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.gradSoft, borderRadius: 99, color: C.blue, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><Sparkles size={14} /> MU HACKATHON 2026</div>
            <h1 style={{ fontSize: "clamp(44px, 8vw, 76px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>{t.heroTitle} <br /><span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroTitleGrad}</span></h1>
            <p style={{ fontSize: 20, opacity: 0.7, maxWidth: 650, margin: "0 auto 48px" }}>{t.heroSub}</p>
            
            <button 
              onClick={() => {
                localStorage.setItem("user_authenticated", "true"); 
                localStorage.setItem("demo_mode", "true");
                const demoUser = {
                  name: "Priya",
                  email: "judge@mu.edu",
                  university: "Mumbai University",
                  course: "Computer Engineering",
                  isDemo: true
                };
                localStorage.setItem("devSathiUser", JSON.stringify(demoUser));
                router.push(`/${locale}/dashboard`);
              }} 
              className="ds-btn" 
              style={{ padding: "18px 48px", fontSize: 18, marginBottom: 80 }}
            >
              {t.getStarted} <ChevronRight size={22} />
            </button>
            
            {/* FEATURE HIGHLIGHT: 3-PANEL */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center", textAlign: "left", background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 40, borderRadius: 32, border: `1px solid ${C.border}` }}>
               <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                  <div style={{ height: 300, background: C.bg0, display: "flex", padding: 10, gap: 10 }}>
                     <div style={{ flex: 1, background: "#1e293b", borderRadius: 8 }}></div>
                     <div style={{ flex: 1.5, background: C.grad, borderRadius: 8, opacity: 0.3 }}></div>
                     <div style={{ flex: 1, background: "#1e293b", borderRadius: 8 }}></div>
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
                     <Columns3 size={48} color="white" />
                  </div>
               </div>
               <div>
                  <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>{t.adaptiveTitle}</h3>
                  <p style={{ fontSize: 17, opacity: 0.7, lineHeight: 1.8 }}>{t.adaptiveDesc}</p>
                  <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                     <Terminal size={20} color={C.blue}/> <BookOpen size={20} color={C.purple}/> <Languages size={20} color="#0ea5e9"/>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 2. THE AWS JOURNEY (UPDATED) */}
        <section id="features" style={{ padding: "100px 24px", background: isDarkMode ? C.bg1 : "#f1f5f9" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}><h2 style={{ fontSize: 44, fontWeight: 900 }}>{t.journeyTitle}</h2><p style={{ fontSize: 18, opacity: 0.6 }}>{t.journeySub}</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 24 }}>
              {[
                { title: "Amplify", desc: "Identity & Serverless Hosting", icon: <ShieldCheck color={C.blue} /> },
                { title: "Bedrock Nova", desc: "Multilingual Brain (22+ Lng)", icon: <Cpu color={C.purple} /> },
                { title: "S3 + RAG", desc: "MU Syllabus Memory", icon: <Cloud color="#0ea5e9" /> },
                { title: "DynamoDB", desc: "Zero-Latency Progress", icon: <Database color="#f43f5e" /> },
                { title: "UI Engine", desc: "3-Panel Focus", icon: <LayoutDashboard color="#10b981" /> }
              ].map((step, i) => (
                <div key={i} className="aws-card" style={{ padding: 32, background: isDarkMode ? C.bg2 : "white", borderRadius: 24, textAlign: "center", border: `1px solid ${C.border}`, transition: "0.3s" }}>
                  <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>{step.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{step.title}</div>
                  <div style={{ fontSize: 13, opacity: 0.6 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. VAULT */}
        <section id="vault" style={{ padding: "120px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 80, alignItems: "center" }}>
               <div>
                  <div style={{ background: C.gradSoft, padding: "8px 16px", borderRadius: 8, display: "inline-block", color: C.blue, fontWeight: 700, fontSize: 12, marginBottom: 20 }}>VERNACULAR MEMORY</div>
                  <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 24, lineHeight: 1.2 }}>{t.vaultTitle}</h2>
                  <p style={{ fontSize: 18, opacity: 0.7, lineHeight: 1.8 }}>{t.vaultDesc}</p>
               </div>
               <div style={{ position: "relative", height: 400, background: `linear-gradient(45deg, ${C.bg1}, ${C.bg2})`, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${C.blue}` }}>
                  <div style={{ textAlign: "center" }}>
                     <div style={{ width: 120, height: 120, borderRadius: 30, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 20px 40px rgba(99,102,241,0.3)" }}>
                        <HardDrive size={50} color="white" />
                     </div>
                     <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, opacity: 0.5 }}>AMAZON S3 SYLLABUS VAULT</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 4. COST STRATEGY (PDF UPDATED) */}
        <section id="pricing" style={{ padding: "100px 24px", background: isDarkMode ? C.bg1 : "#f8fafc" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
             <div style={{ textAlign: "center", marginBottom: 64 }}><h2 style={{ fontSize: 44, fontWeight: 900 }}>{t.pricingTitle}</h2><p style={{ opacity: 0.6 }}>{t.pricingSub}</p></div>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
                {[
                  { name: "Zero-Entry Strategy", price: "₹0", features: ["1 Million Lambda Requests/mo", "25GB DynamoDB Storage", "5GB Standard S3 Vault"] },
                  { name: "AI Ops (Nova Lite)", price: "₹0.25", features: ["Per Request optimized", "Vernacular RAG Embeddings", "75% Lower Cost than Claude"] },
                  { name: "Monthly Pilot", price: "< ₹800", features: ["Scales to first 100 students", "Zero idle infra costs", "Full 22+ Lng support"] }
                ].map((p, i) => (
                  <div key={i} style={{ padding: 48, background: isDarkMode ? C.bg2 : "white", borderRadius: 32, border: `1px solid ${C.border}` }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{p.name}</h3>
                    <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 32, color: C.blue }}>{p.price}</div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                      {p.features.map(f => <li key={f} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 12, opacity: 0.8 }}><Check size={18} color={C.blue}/> {f}</li>)}
                    </ul>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 5. MISSION */}
        <section id="about" style={{ padding: "120px 24px" }}>
           <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, background: C.gradSoft, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}><Target size={32} color={C.blue} /></div>
              <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 24 }}>{t.aboutTitle}</h2>
              <p style={{ fontSize: 20, opacity: 0.7, lineHeight: 1.8, marginBottom: 48 }}>{t.aboutDesc}</p>
           </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "80px 40px 40px", background: isDarkMode ? C.bg1 : "#f1f5f9", borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 60 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}><Code2 size={28} color={C.blue} /><span style={{ fontSize: 24, fontWeight: 900 }}>DevSathi</span></div>
              <p style={{ fontSize: 15, opacity: 0.6, lineHeight: 1.7, marginBottom: 24 }}>{t.footerTag}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: isDarkMode ? "rgba(255,255,255,0.05)" : "white", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 700 }}>
                 <Cloud size={16} color={C.blue}/> BUILT ON AWS FOR BHARAT
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>{t.resources}</h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <li><a href="https://github.com/Pa-go/AI_Bharat_DevSarthi.git" target="_blank" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}} rel="noreferrer"><Github size={18}/> GitHub Repository</a></li>
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><BookOpen size={18}/> {t.techDocs}</a></li>
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><Video size={18}/> {t.demoVideo}</a></li>
                {/* 🎯 Added AWS Architecture placeholder */}
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><Map size={18}/> {t.architecture}</a></li>
              </ul>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: "80px auto 0", borderTop: `1px solid ${C.border}`, textAlign: "center", paddingTop: 40 }}>
            <p style={{ fontSize: 13, opacity: 0.5 }}>Handcrafted with ❤️ for <b>Bharat’s Digital Future</b> ✦ 2026. Powered by Amazon Bedrock.</p>
          </div>
        </footer>
      </div>
    </>
  );
}