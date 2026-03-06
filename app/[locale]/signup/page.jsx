"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Code2, ArrowRight, Loader2, Sparkles, ChevronLeft, ShieldAlert } from "lucide-react";

const translations = {
  en: { signIn: "Sign In", signInSub: "Welcome back.", emailLabel: "EMAIL", passLabel: "PASSWORD", newHere: "New here?", createAccount: "Create account", registration: "Registration", regSub: "Join us.", fullName: "FULL NAME", university: "UNIVERSITY", course: "COURSE", backBtn: "Back", btnCreate: "Create", alertSuccess: "Success! Sign in now.", demoBtn: "Demo Access (Instant)" },
  mr: { signIn: "प्रवेश करा", signInSub: "स्वागत आहे.", emailLabel: "ईमेल", passLabel: "पासवर्ड", newHere: "नवीन आहात?", createAccount: "खाते तयार करा", registration: "नोंदणी", regSub: "सहभागी व्हा.", fullName: "पूर्ण नाव", university: "विद्यापीठ", course: "कोर्स", backBtn: "परत", btnCreate: "तयार करा", alertSuccess: "यशस्वी!", demoBtn: "डेमो प्रवेश" },
  hi: { signIn: "साइन इन", signInSub: "स्वागत है।", emailLabel: "ईमेल", passLabel: "पासवर्ड", newHere: "नए हैं?", createAccount: "खाता बनाएं", registration: "पंजीकरण", regSub: "जुड़ें।", fullName: "पूरा नाव", university: "विश्वविद्यालय", course: "कोर्स", backBtn: "वापस", btnCreate: "बनाएं", alertSuccess: "सफल!", demoBtn: "डेमो एक्सेस" }
};

export default function SignupFlow() {
  const router = useRouter();
  const { locale } = useParams();
  const t = translations[locale] || translations.en;
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", university: "", course: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🎯 THE HACKATHON BYPASS: Instant Login
  const handleDemoAccess = () => {
    setLoading(true);
    const demoUser = {
      name: "Hackathon Judge",
      email: "judge@aws.com",
      university: "Mumbai University",
      course: "Computer Engineering",
      isDemo: true
    };
    // Match the exact key your dashboard looks for
    localStorage.setItem("devSathiUser", JSON.stringify(demoUser));
    localStorage.setItem("user_authenticated", "true");
    
    setTimeout(() => {
      router.push(`/${locale}/dashboard`);
    }, 800);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        localStorage.setItem("devSathiUser", JSON.stringify(data.user));
        router.push(`/${locale}/dashboard`);
      } catch (err) {
        // 🚦 If server fails, offer the Demo Access automatically
        alert("Server Error: " + err.message + ". Try 'Demo Access' instead!");
      } finally { setLoading(false); }
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      alert(t.alertSuccess);
      setStep(1);
    } catch (err) {
      alert(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617] p-6">
      <div className="w-full max-w-md bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center"><Code2 size={18} color="white" /></div>
            <span className="text-xl font-bold text-indigo-500">DevSathi</span>
          </div>

          {step === 1 ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-2xl font-black">{t.signIn}</h1>
              
              <form onSubmit={handleAction} className="space-y-4">
                <input type="email" name="email" placeholder={t.emailLabel} required onChange={handleChange} className="w-full p-3.5 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white" />
                <input type="password" name="password" placeholder={t.passLabel} required onChange={handleChange} className="w-full p-3.5 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-gray-900 dark:text-white" />
                <button type="submit" disabled={loading} className="w-full p-4 bg-gray-900 dark:bg-white dark:text-black text-white font-bold rounded-xl flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" /> : <>{t.signIn} <ArrowRight size={18}/></>}
                </button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-slate-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#0f172a] px-2 text-gray-500">Or bypass for demo</span></div>
              </div>

              {/* 🚀 QUICK ACCESS BUTTON */}
              <button 
                onClick={handleDemoAccess} 
                className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Sparkles size={18} /> {t.demoBtn}
              </button>

              <button type="button" onClick={() => setStep(2)} className="w-full text-center text-sm font-bold text-indigo-500">{t.createAccount}</button>
            </div>
          ) : (
            <form onSubmit={handleAction} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 flex items-center gap-1"><ChevronLeft size={14}/> {t.backBtn}</button>
              <h1 className="text-2xl font-black">{t.registration}</h1>
              <input type="text" name="name" placeholder={t.fullName} required onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl" />
              <input type="email" name="email" placeholder={t.emailLabel} required onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <input type="password" name="password" placeholder="Pass" required onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl" />
                <input type="password" name="confirmPassword" placeholder="Confirm" required onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl" />
              </div>
              <input type="text" name="university" placeholder={t.university} required onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-[#020617] border border-gray-200 dark:border-slate-700 rounded-xl" />
              <button type="submit" disabled={loading} className="w-full p-4 bg-indigo-500 text-white font-bold rounded-xl">{loading ? <Loader2 className="animate-spin m-auto" /> : t.btnCreate}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}