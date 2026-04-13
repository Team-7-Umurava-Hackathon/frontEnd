"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = (timestamp: number, startTime: number) => {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
          };
          requestAnimationFrame((t) => step(t, t));
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Smart Candidate Matching",
    description: "AI analyzes every applicant against your job requirements and ranks them by fit — no manual screening needed.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Explainable AI Scores",
    description: "Every candidate gets a match score with clear reasoning — strengths, gaps, and a final hiring recommendation.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
    title: "Bulk Upload Support",
    description: "Import hundreds of applicants from CSV or Excel in seconds. The AI screens them all instantly.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "Recruiter Dashboard",
    description: "Manage all your jobs, applicants, and shortlists in one clean interface built for speed.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Talent Profile Schema",
    description: "Structured applicant profiles that capture skills, experience, education, and projects in a standardized format.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Faster Time to Hire",
    description: "Cut screening time by 80%. Focus on interviews, not reading through hundreds of resumes manually.",
  },
];

const steps = [
  { number: "01", title: "Post a Job", description: "Create a job with required skills, experience, and description." },
  { number: "02", title: "Applicants Apply", description: "Candidates submit structured profiles or you upload a spreadsheet." },
  { number: "03", title: "AI Screens", description: "Our AI evaluates every applicant and ranks them by fit score." },
  { number: "04", title: "You Hire", description: "Review the shortlist with full reasoning and make confident decisions." },
];

const stats = [
  { target: 80, suffix: "%", label: "Reduction in screening time" },
  { target: 500, suffix: "+", label: "Candidates screened per job" },
  { target: 95, suffix: "%", label: "Recruiter satisfaction rate" },
  { target: 10, suffix: "x", label: "Faster shortlisting" },
];

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-background font-sans overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-blue-200 rounded-full opacity-30 blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightBlue text-primary text-xs font-semibold mb-6 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
            Powered by Gemini AI
          </span>
        </div>

        {/* Headline */}
        <h1 className={`text-5xl md:text-6xl font-bold text-gray-900 max-w-3xl leading-tight transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Hire Smarter with{" "}
          <span className="text-primary relative inline-block">
            AI-Powered
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="#2E73F1" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
            </svg>
          </span>{" "}
          Screening
        </h1>

        <p className={`text-gray-500 max-w-xl mt-6 text-lg leading-relaxed transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Stop manually reviewing hundreds of resumes. Let AI rank your candidates, explain its reasoning, and deliver a shortlist — in seconds.
        </p>

        {/* CTAs */}
        <div className={`flex flex-wrap gap-4 mt-10 justify-center transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Link href="/login">
            <button className="px-8 py-3.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-200">
              Get Started Free
            </button>
          </Link>
          <Link href="/jobs">
            <button className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-lightBlue hover:border-primary hover:text-primary transition-all">
              Browse Jobs
            </button>
          </Link>
        </div>

        {/* Floating score cards */}
        <div className={`mt-16 w-full max-w-lg relative transition-all duration-1000 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="bg-white rounded-2xl border shadow-xl p-5 text-left">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">🏆 AI Shortlist — Frontend Developer</p>
              <span className="text-xs text-gray-400">Just now</span>
            </div>
            {[
              { name: "Alice Mutoni", score: 94, color: "bg-green-500" },
              { name: "Bruno Habimana", score: 81, color: "bg-green-400" },
              { name: "Carol Uwase", score: 67, color: "bg-yellow-400" },
            ].map((c, i) => (
              <div
                key={c.name}
                className="flex items-center gap-3 py-2.5 border-b last:border-0"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-lightBlue text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${c.color} rounded-full transition-all duration-1000`}
                      style={{ width: visible ? `${c.score}%` : "0%" }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 shrink-0">{c.score}/100</span>
              </div>
            ))}
          </div>

          {/* Floating reasoning badge */}
          <div className="absolute -right-4 -bottom-4 bg-white border rounded-xl shadow-lg px-4 py-3 text-xs max-w-48 hidden md:block">
            <p className="text-green-600 font-semibold mb-0.5">✅ Strengths</p>
            <p className="text-gray-500">Expert React · 3yrs Next.js · Built recruiter dashboards</p>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-white">
                <Counter target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">From job post to shortlist in minutes</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-blue-100" />
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-lightBlue text-primary font-bold text-lg flex items-center justify-center mb-4 border-2 border-blue-100 relative z-10 bg-white">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold mb-2">Features</p>
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to hire better</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-6 hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-lightBlue text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-primary relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-56 h-56 bg-blue-300 rounded-full opacity-20 blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your hiring?</h2>
          <p className="text-blue-200 mb-8">Join recruiters using AI to find the best talent faster.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <button className="px-8 py-3.5 rounded-xl bg-white text-primary font-medium hover:opacity-90 active:scale-95 transition-all">
                Start Screening Now
              </button>
            </Link>
            <Link href="/jobs">
              <button className="px-8 py-3.5 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition-all">
                View Open Positions
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-white border-t px-6 py-8 text-center text-sm text-gray-400">
        <p>© 2026 AI Recruiter · Built with Next.js & Gemini AI · Powered by Umurava</p>
      </footer>
    </main>
  );
}