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
   TRANSLATIONS DICTIONARY
   ═══════════════════════════════════════════════════════════════════════════ */
const translations = {
  en: {
    navHome: "Home", navFeatures: "Features", navVault: "The Vault", navPricing: "Pricing", navAbout: "About",
    heroTitle: "Your AI Coding Companion,",
    heroTitleGrad: "in Your Language.",
    heroSub: "Experience the all-in-one workspace for Bharat, Powered by Amazon Bedrock.",
    getStarted: "Get Started (Demo)", signIn: "Sign In", 
    journeyTitle: "The AWS Journey",
    journeySub: "5 Managed Services. 1 Seamless Workspace.",
    adaptiveTitle: "Adaptive 5-Panel Mastery",
    adaptiveDesc: "Stop switching between 10 browser tabs. DevSathi provides a fluid environment that morphs to your workflow. Whether you're debugging C++ code, researching Mumbai University PDFs, or generating study notes, our 5-panel system keeps your focus sharp.",
    vaultTitle: "The Vault: Your Academic Memory",
    vaultDesc: "Standard AI forgets your files instantly. The Vault, powered by Amazon S3, creates a permanent, secure cloud library for your syllabus and textbooks. Our RAG system allows Sathi to provide tutoring based specifically on YOUR materials.",
    aboutTitle: "Our Mission for Bharat",
    aboutDesc: "DevSathi bridges the digital divide for students across Bharat. By combining AWS Generative AI with native regional language logic, we are democratizing technical education for every student.",
    pricingTitle: "Simple, Bharat-Scale Pricing",
    pricingSub: "Free for students, powerful for pros.",
    footerTag: "Empowering the next generation of IT professionals in Bharat.",
    resources: "Resources", demoVideo: "Demo Video", architecture: "AWS Architecture", techDocs: "Technical Docs"
  },
  mr: {
    navHome: "मुख्यपृष्ठ", navFeatures: "वैशिष्ट्ये", navVault: "व्हॉल्ट", navPricing: "किंमत", navAbout: "बद्दल",
    heroTitle: "तुमचा AI कोडिंग सोबती,",
    heroTitleGrad: "तुमच्या भाषेत.",
    heroSub: "भारतासाठी डिझाइन केलेले अष्टपैलू वर्कस्पेस, Amazon Bedrock द्वारे समर्थित.",
    getStarted: "सुरुवात करा (डेमो)", signIn: "प्रवेश करा", 
    adaptiveTitle: "अडॅप्टिव्ह ५-पॅनेल मास्टरी",
    adaptiveDesc: "१० टॅबमध्ये फिरणे थांबवा. देवसाथी एक प्रवाही वर्कस्पेस प्रदान करते. तुम्ही सी++ कोड डीबग करणे असो किंवा मुंबई विद्यापीठाच्या पीडीएफ शोधणे असो, आमचे ५-पॅनेल सिस्टम तुमचे लक्ष विचलित होऊ देत नाही.",
    vaultTitle: "व्हॉल्ट: तुमची शैक्षणिक मेमरी",
    vaultDesc: "अॅमेझॉन एस ३ द्वारे समर्थित व्हॉल्ट तुमच्या अभ्यासक्रमासाठी आणि नोट्ससाठी कायमस्वरूपी सुरक्षित क्लाउड लायब्ररी तयार करते, ज्यामुळे साथी तुमच्या साहित्यावर आधारित ट्युटरिंग देऊ शकते.",
    aboutTitle: "भारतासाठी आमचे ध्येय",
    aboutDesc: "प्रादेशिक भाषा समर्थनासह AWS GenAI ला जोडून, आम्ही भारतातील प्रत्येक विद्यार्थ्यासाठी तांत्रिक शिक्षण खऱ्या अर्थाने सुलभ आणि लोकशाहीत करत आहोत.",
    pricingTitle: "सोपी आणि परवडणारी किंमत",
    pricingSub: "विद्यार्थ्यांसाठी विनामूल्य, प्रो साठी शक्तिशाली.",
    footerTag: "भारतातील आयटी व्यावसायिकांच्या पुढच्या पिढीला सक्षम करणे.",
    resources: "संसाधने", demoVideo: "डेमो व्हिडिओ", architecture: "आर्किटेक्चर", techDocs: "तांत्रिक दस्तऐवज"
  },
  hi: {
    navHome: "होम", navFeatures: "विशेषताएं", navVault: "वॉल्ट", navPricing: "कीमत", navAbout: "परिचय",
    heroTitle: "आपका AI कोडिंग साथी,",
    heroTitleGrad: "आपका अपनी भाषा में।",
    heroSub: "भारत के लिए ऑल-इन-वन वर्कस्पेस, Amazon Bedrock द्वारा संचालित।",
    getStarted: "शुरू करें (डेमो)", signIn: "साइन इन करें", 
    adaptiveTitle: "अडॅप्टिव्ह 5-पैनल मास्टरी",
    adaptiveDesc: "10 ब्राउज़र टैब के बीच स्विच करना बंद करें। देवसाथी एक सहज वातावरण प्रदान करता है। चाहे आप C++ कोड डीबग कर रहे हों या मुंबई विश्वविद्यालय की पीडीएफ पर शोध कर रहे हों, हमारा 5-पैनल सिस्टम आपका ध्यान केंद्रित रखता है।",
    vaultTitle: "वॉल्ट: आपकी शैक्षणिक मेमोरी",
    vaultDesc: "अमेज़ॅन एस 3 द्वारा संचालित वॉल्ट आपके सिलेबस और नोट्स के लिए एक सुरक्षित क्लाउड लाइब्रेरी बनाता है, जिससे साथी विशेष रूप से आपकी सामग्री के आधार पर ट्यूशन दे सकता है।",
    aboutTitle: "भारत के लिए हमारा लक्ष्य",
    aboutDesc: "क्षेत्रीय भाषा समर्थन के साथ AWS GenAI को जोड़कर, हम भारत के हर छात्र के लिए तकनीकी शिक्षा का लोकतंत्रीकरण कर रहे हैं।",
    pricingTitle: "सरल और किफायती दाम",
    pricingSub: "छात्रों के लिए मुफ्त, प्रो के लिए शक्तिशाली।",
    footerTag: "भारत के आईटी पेशेवरों की अगली पीढ़ी को सशक्त बनाना।",
    resources: "संसाधन", demoVideo: "डेमो वीडियो", architecture: "आर्किटेक्चर", techDocs: "तकनीकी दस्तावेज़"
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
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.gradSoft, borderRadius: 99, color: C.blue, fontSize: 12, fontWeight: 700, marginBottom: 24 }}><Sparkles size={14} /> THE AI STUDENT REVOLUTION</div>
            <h1 style={{ fontSize: "clamp(44px, 8vw, 76px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>{t.heroTitle} <br /><span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroTitleGrad}</span></h1>
            <p style={{ fontSize: 20, opacity: 0.7, maxWidth: 650, margin: "0 auto 48px" }}>{t.heroSub}</p>
            
            {/* 🎯 BYPASS BUTTON: DIRECT TO DASHBOARD */}
            <button 
              onClick={() => {
                localStorage.setItem("user_authenticated", "true"); 
                localStorage.setItem("demo_mode", "true");
                router.push(`/${locale}/dashboard`);
              }} 
              className="ds-btn" 
              style={{ padding: "18px 48px", fontSize: 18, marginBottom: 80 }}
            >
              {t.getStarted} <ChevronRight size={22} />
            </button>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center", textAlign: "left", background: isDarkMode ? "#0f172a" : "#f8fafc", padding: 40, borderRadius: 32, border: `1px solid ${C.border}` }}>
               <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                  <div style={{ height: 350, background: C.bg0, display: "flex", flexWrap: "wrap", padding: 10, gap: 10 }}>
                     <div style={{ flex: 1, background: "#1e293b", borderRadius: 8 }}></div>
                     <div style={{ flex: 2, background: C.grad, borderRadius: 8, opacity: 0.2 }}></div>
                     <div style={{ width: "100%", height: "40%", background: "#1e293b", borderRadius: 8 }}></div>
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
                     <Layers size={48} color="white" />
                  </div>
               </div>
               <div>
                  <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>{t.adaptiveTitle}</h3>
                  <p style={{ fontSize: 17, opacity: 0.7, lineHeight: 1.8 }}>{t.adaptiveDesc}</p>
                  <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                     <Terminal size={20} color={C.blue}/> <BookOpen size={20} color={C.purple}/> <FileText size={20} color="#0ea5e9"/>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 2. AWS JOURNEY */}
        <section id="features" style={{ padding: "100px 24px", background: isDarkMode ? C.bg1 : "#f1f5f9" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}><h2 style={{ fontSize: 44, fontWeight: 900 }}>{t.journeyTitle}</h2><p style={{ fontSize: 18, opacity: 0.6 }}>{t.journeySub}</p></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 24 }}>
              {[
                { title: "Amplify", desc: "Identity", icon: <ShieldCheck color={C.blue} /> },
                { title: "Bedrock", desc: "GenAI Brain", icon: <Cpu color={C.purple} /> },
                { title: "S3", desc: "Secure Vault", icon: <Cloud color="#0ea5e9" /> },
                { title: "DynamoDB", desc: "Smart Progress", icon: <Database color="#f43f5e" /> },
                { title: "UI Engine", desc: "5-Panel Mastery", icon: <LayoutDashboard color="#10b981" /> }
              ].map((step, i) => (
                <div key={i} className="aws-card" style={{ padding: 32, background: isDarkMode ? C.bg2 : "white", borderRadius: 24, textAlign: "center", border: `1px solid ${C.border}` }}>
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
                  <div style={{ background: C.gradSoft, padding: "8px 16px", borderRadius: 8, display: "inline-block", color: C.blue, fontWeight: 700, fontSize: 12, marginBottom: 20 }}>RELIABLE STORAGE</div>
                  <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 24, lineHeight: 1.2 }}>{t.vaultTitle}</h2>
                  <p style={{ fontSize: 18, opacity: 0.7, lineHeight: 1.8 }}>{t.vaultDesc}</p>
               </div>
               <div style={{ position: "relative", height: 400, background: `linear-gradient(45deg, ${C.bg1}, ${C.bg2})`, borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${C.blue}` }}>
                  <div style={{ textAlign: "center" }}>
                     <div style={{ width: 120, height: 120, borderRadius: 30, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 20px 40px rgba(99,102,241,0.3)" }}>
                        <HardDrive size={50} color="white" />
                     </div>
                     <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, opacity: 0.5 }}>ENCRYPTED S3 BUCKET</div>
                  </div>
                  <div style={{ position: "absolute", top: 40, right: 40 }}><Share2 color={C.blue} opacity={0.3}/></div>
               </div>
            </div>
          </div>
        </section>

        {/* 4. PRICING */}
        <section id="pricing" style={{ padding: "100px 24px", background: isDarkMode ? C.bg1 : "#f8fafc" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
             <div style={{ textAlign: "center", marginBottom: 64 }}><h2 style={{ fontSize: 44, fontWeight: 900 }}>{t.pricingTitle}</h2><p style={{ opacity: 0.6 }}>{t.pricingSub}</p></div>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
                {[
                  { name: "Sathi Starter", price: "₹0", features: ["1GB S3 Vault", "Standard Bedrock AI", "3-Panel Layout", "Community Support"] },
                  { name: "Sathi Pro", price: "₹199", features: ["10GB S3 Vault", "Priority Bedrock Nova", "5-Panel Mastery", "Syllabus RAG Sync", "No Language Limits"], accent: true },
                  { name: "Institutional", price: "Custom", features: ["Bulk Student Licenses", "Admin Dashboard", "Private S3 Buckets", "Custom MU Syllabus Integration"] }
                ].map((p, i) => (
                  <div key={i} style={{ padding: 48, background: isDarkMode ? C.bg2 : "white", borderRadius: 32, border: p.accent ? `2px solid ${C.blue}` : `1px solid ${C.border}`, position: "relative" }}>
                    {p.accent && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.grad, color: "white", padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>RECOMMENDED</div>}
                    <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{p.name}</h3>
                    <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 32 }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.5 }}>/mo</span></div>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                      {p.features.map(f => <li key={f} style={{ fontSize: 15, display: "flex", alignItems: "center", gap: 12, opacity: 0.8 }}><Check size={18} color={C.blue}/> {f}</li>)}
                    </ul>
                    <button className="ds-btn" style={{ width: "100%", justifyContent: "center" }}>Select Plan</button>
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

        <footer style={{ padding: "80px 40px 40px", background: isDarkMode ? C.bg1 : "#f1f5f9", borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 60 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}><Code2 size={28} color={C.blue} /><span style={{ fontSize: 24, fontWeight: 900 }}>DevSathi</span></div>
              <p style={{ fontSize: 15, opacity: 0.6, lineHeight: 1.7, marginBottom: 24 }}>{t.footerTag}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: isDarkMode ? "rgba(255,255,255,0.05)" : "white", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 700 }}>
                 <Cloud size={16} color={C.blue}/> BUILT ON AWS
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>{t.resources}</h4>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <li><a href="https://github.com/palakgoda" target="_blank" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}} rel="noreferrer"><Github size={18}/> GitHub Repository</a></li>
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><BookOpen size={18}/> {t.techDocs}</a></li>
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><Video size={18}/> {t.demoVideo}</a></li>
                <li><a href="#" className="nav-link" style={{opacity:1, display:"flex", alignItems:"center", gap:10}}><Map size={18}/> {t.architecture}</a></li>
              </ul>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: "80px auto 0", borderTop: `1px solid ${C.border}`, textAlign: "center", paddingTop: 40 }}>
            <p style={{ fontSize: 13, opacity: 0.5 }}>Handcrafted with ❤️ for <b>Bharat’s Digital Future</b> ✦ 2026. Powered by AWS GenAI.</p>
          </div>
        </footer>
      </div>
    </>
  );
}