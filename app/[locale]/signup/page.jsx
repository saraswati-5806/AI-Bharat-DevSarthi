"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code2, ArrowRight, Loader2, Sparkles, ChevronLeft } from "lucide-react";

const C = {
  bg0: "#020617",
  bg1: "#0f172a",
  blue: "#6366f1",
  purple: "#a855f7",
  grad: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  border: "rgba(255,255,255,0.08)",
};

const translations = {
  en: {
    brand: "DevSathi", title: "Sign In", registration: "Registration", phEmail: "EMAIL", phPass: "PASSWORD",
    btnSignIn: "Sign In", demoText: "OR BYPASS FOR DEMO", btnDemo: "Demo Access (Instant)",
    linkCreate: "Create account", backBtn: "Back", fullName: "Full Name", university: "University",
    btnCreate: "Create Account", msgMatch: "Passwords do not match!", msgSuccess: "Account created! Please Sign In."
  },
  hi: {
    brand: "DevSathi", title: "साइन इन करें", registration: "पंजीकरण", phEmail: "ईमेल", phPass: "पासवर्ड",
    btnSignIn: "साइन इन करें", demoText: "या डेमो के लिए बायपास करें", btnDemo: "डेमो एक्सेस (तुरंत)",
    linkCreate: "अकाउंट बनाएं", backBtn: "पीछे", fullName: "पूरा नाम", university: "विश्वविद्यालय",
    btnCreate: "अकाउंट बनाएं", msgMatch: "पासवर्ड मेल नहीं खाते!", msgSuccess: "अकाउंट बन गया! कृपया साइन इन करें।"
  },
  mr: {
    brand: "DevSathi", title: "साइन इन करा", registration: "नोंदणी", phEmail: "ईमेल", phPass: "पासवर्ड",
    btnSignIn: "साइन इन करा", demoText: "किंवा डेमोसाठी बायपास करा", btnDemo: "डेमो ॲक्सेस (त्वरित)",
    linkCreate: "अकाउंट तयार करा", backBtn: "परत", fullName: "पूर्ण नाव", university: "विद्यापीठ",
    btnCreate: "अकाउंट तयार करा", msgMatch: "पासवर्ड जुळत नाहीत!", msgSuccess: "अकाउंट तयार झाले! कृपया साइन इन करा."
  }
};

const AWS_LAMBDA_URL = "https://6ngxltk6lgc3flyu3lyx4wdd7i0kiokm.lambda-url.us-east-1.on.aws/"; 

export default function SignupFlow() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? "en";
  const t = translations[locale] || translations.en;
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", university: "" });

  useEffect(() => { 
    setMounted(true); 
    // ⚡ Pre-loading dashboard assets for a faster transition
    router.prefetch(`/${locale}/dashboard`);
  }, [locale, router]);
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🎯 DEMO BYPASS
  const handleDemoAccess = () => {
    setLoading(true);
    const demoUser = { 
      name: "Priya", email: "priya.demo@mumbai.university", 
      university: "Mumbai University", course: "Computer Engineering", isDemo: true 
    };
    localStorage.setItem("devSathiUser", JSON.stringify(demoUser));
    localStorage.setItem("user_authenticated", "true");
    router.push(`/${locale}/dashboard`);
  };

  // 🎯 SIGN IN LOGIC
  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const url = `${AWS_LAMBDA_URL}?email=${encodeURIComponent(formData.email)}`;
    const res = await fetch(url); // ⚡ Simple GET
    
    if (res.ok) {
      const data = await res.json();
      if (data.password === formData.password) {
        localStorage.setItem("devSathiUser", JSON.stringify(data));
        localStorage.setItem("user_authenticated", "true");
        router.push(`/${locale}/dashboard`);
      } else {
        alert("Wrong password");
      }
    } else {
      alert("User not found");
    }
  } catch (err) {
    console.error("Login failed:", err);
  }
  setLoading(false);
};

  // 🎯 REGISTER LOGIC
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t.msgMatch);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(AWS_LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          university: formData.university,
          createdAt: new Date().toISOString()
        })
      });
      if (res.ok) { 
        alert(t.msgSuccess); 
        setStep(1); 
      } else { 
        alert("Signup Failed on Server"); 
      }
    } catch (err) { 
      console.error("REG_ERROR:", err); 
    }
    setLoading(false);
  };

  const inputBaseStyle = { background: C.bg0, border: `1px solid ${C.border}`, color: "#ffffff" };

  if (!mounted) return <div style={{ background: "#020617", minHeight: "100vh" }} />;

  return (
    <div style={{ background: C.bg0 }} className="min-h-screen flex items-center justify-center p-6 font-sans text-white" suppressHydrationWarning>
      <div style={{ background: C.bg1, border: `1px solid ${C.border}` }} className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div style={{ background: C.grad, height: '6px' }} className="w-full" />
        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div style={{ background: C.grad }} className="w-10 h-10 rounded-xl flex items-center justify-center"><Code2 size={22} color="white" /></div>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px" }}>{t.brand}</span>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              <h1 className="text-2xl font-black">{t.title}</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" name="email" placeholder={t.phEmail} required onChange={handleChange} style={inputBaseStyle} className="w-full p-4 rounded-xl outline-none" />
                <input type="password" name="password" placeholder={t.phPass} required onChange={handleChange} style={inputBaseStyle} className="w-full p-4 rounded-xl outline-none" />
                <button type="submit" disabled={loading} style={{ background: 'white', color: 'black' }} className="w-full p-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <>{t.btnSignIn} <ArrowRight size={18}/></>}
                </button>
              </form>
              <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center"><span style={{ borderColor: C.border }} className="w-full border-t"></span></div>
                 <div className="relative flex justify-center text-xs uppercase"><span style={{ background: C.bg1 }} className="px-2 text-gray-500 font-bold">{t.demoText}</span></div>
               </div>
               <button onClick={handleDemoAccess} style={{ background: C.grad }} className="w-full p-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                 <Sparkles size={18} /> {t.btnDemo}
               </button>
               <button type="button" onClick={() => setStep(2)} className="w-full text-center text-sm font-bold text-indigo-400">{t.linkCreate}</button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 flex items-center gap-1 mb-2 hover:text-white transition-colors"><ChevronLeft size={14}/> {t.backBtn}</button>
              <h1 className="text-2xl font-black">{t.registration}</h1>
              <input type="text" name="name" placeholder={t.fullName} required onChange={handleChange} style={inputBaseStyle} className="w-full p-4 rounded-xl outline-none" />
              <input type="email" name="email" placeholder={t.phEmail} required onChange={handleChange} style={inputBaseStyle} className="w-full p-4 rounded-xl outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="password" name="password" placeholder="Pass" required onChange={handleChange} style={inputBaseStyle} className="p-4 rounded-xl outline-none" />
                <input type="password" name="confirmPassword" placeholder="Confirm" required onChange={handleChange} style={inputBaseStyle} className="p-4 rounded-xl outline-none" />
              </div>
              <input type="text" name="university" placeholder={t.university} required onChange={handleChange} style={inputBaseStyle} className="w-full p-4 rounded-xl outline-none" />
              <button type="submit" disabled={loading} style={{ background: C.grad }} className="w-full p-4 text-white font-bold rounded-xl mt-4 transition-transform active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin m-auto" /> : t.btnCreate}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}