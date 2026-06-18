import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Globe, 
  Github, 
  TrendingUp,
  Mail,
  Zap,
  Brain
} from 'lucide-react';

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const totalSlides = 12;
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slideVariants = {
    initial: { opacity: 0, x: 40, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -40, scale: 0.98, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  const screenshots = [
    {
      title: '1. App Landing Page',
      src: './assets/landing_screenshot.png',
      desc: 'NextHire AI landing page displaying feature modules, core metrics, and active theme switches.'
    },
    {
      title: '2. AI Resume Builder',
      src: './assets/resume_editor_screenshot.png',
      desc: 'AI-powered Resume Builder workspace with real-time completeness scoring and template selection.'
    },
    {
      title: '3. AI Resume Enhancer',
      src: './assets/resume_enhancer_screenshot.png',
      desc: 'AI Resume Enhancer showing weak bullet point transformation using the STAR method and ATS optimization.'
    },
    {
      title: '4. JD Matcher',
      src: './assets/jd_matcher_screenshot.png',
      desc: 'Job Description Matcher comparing profile skills against job descriptions to compute compatibility.'
    },
    {
      title: '5. Public Portfolio',
      src: './assets/portfolio_live_screenshot.png',
      desc: 'A live, responsive compiled personal portfolio hosted directly on a clean public URL path.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-between p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600 opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 opacity-5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => navigate('/')} 
            className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/30 cursor-pointer hover:scale-105 duration-200"
          >
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-wider text-white">NextHire <span className="text-violet-400">AI</span></span>
            <span className="hidden md:inline px-2 py-0.5 ml-2 text-[10px] uppercase font-bold tracking-widest text-violet-400 border border-violet-500/30 rounded bg-violet-950/40">Demo Slide Deck</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900/50 duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </button>
          <div className="text-xs text-zinc-400 font-semibold tracking-wide">
            Slide {currentSlide} of {totalSlides}
          </div>
        </div>
      </header>

      {/* Slide Content Window */}
      <main className="flex-grow flex items-center justify-center my-6 relative min-h-[500px] z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {/* ================= SLIDE 1: TITLE SLIDE ================= */}
            {currentSlide === 1 && (
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-2xl shadow-violet-600/40 mb-6 relative">
                  <div className="absolute inset-[-6px] rounded-2xl border border-violet-400/20 animate-pulse" />
                  <Zap className="w-8 h-8 text-white fill-current" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight font-outfit">
                  NextHire <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-300 font-medium tracking-wide mb-2 max-w-2xl font-outfit">
                  Smart Resumes. Stunning Portfolios. Better Careers.
                </p>
                <p className="text-xs md:text-sm text-zinc-500 max-w-xl mb-10">
                  An AI-powered SaaS web application designed to help job seekers bypass ATS filters, build professional portfolios, and tailor job applications.
                </p>
                
                <div className="bg-zinc-900/50 backdrop-blur-md px-6 py-4 rounded-xl flex items-center gap-4 text-left border border-white/5 shadow-2xl shadow-black/40">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-white border border-zinc-700">
                    VT
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Presenter</div>
                    <div className="text-sm font-bold text-white">Vivek Tripathi</div>
                    <div className="text-[11px] text-zinc-400">Full Stack Developer & Lead Architect</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 2: PROBLEM STATEMENT ================= */}
            {currentSlide === 2 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-8">
                  <span className="text-xs uppercase font-bold tracking-widest text-red-400">Current Market Challenges</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    The Job Hunting Bottleneck
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-red-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 font-bold text-sm">
                      01
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">The ATS Filter Trap</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Over <strong>75%</strong> of resumes are discarded by automated Applicant Tracking Systems (ATS) due to formatting errors or keyword deficits before ever reaching a human recruiter.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-red-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 font-bold text-sm">
                      02
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">The Portfolio Burden</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Building, deploying, and hosting a custom web portfolio requires code experience, web domain purchases, design skills, and hours of layout tweaks.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-red-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 font-bold text-sm">
                      03
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Application Fatigue</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Candidates waste dozens of hours manually customizing resumes and cover letters for different applications or send the same generic resume, yielding poor results.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 3: PROPOSED SOLUTION ================= */}
            {currentSlide === 3 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-8">
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Our Solution</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    NextHire AI: The Intelligent Solution
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-emerald-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">ATS Optimization</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Upload resumes or paste job descriptions to receive immediate compatibility scores, identify keyword deficits, and implement auto-corrections.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-emerald-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">One-Click Portfolios</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Instantly compile resume database records into a gorgeous, shareable, and responsive web portfolio on a customizable public URL.
                    </p>
                  </div>
                  
                  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 border-t-emerald-500/50 border-t-2 shadow-xl hover:translate-y-[-2px] duration-300">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Contextual AI Engine</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Powered by the Google Gemini API to analyze context, generate active verbs, recommend skills, and write custom cover letters tailored to target positions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 4: CORE FEATURES ================= */}
            {currentSlide === 4 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Platform Capabilities</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    Core Features At A Glance
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: 'AI Resume Generator', desc: 'Generate clean, professional, ATS-compliant resumes with structured sections.' },
                    { title: 'AI Resume Enhancer', desc: 'Refine descriptions using active verbs, vocabulary upgrades, and quantitative details.' },
                    { title: 'ATS Score Analyzer', desc: 'Grade compatibility, scan formatting errors, and view keyword coverage lists.' },
                    { title: 'Portfolio Builder', desc: 'Publish a stunning web portfolio instantly on a custom slug with dark/light themes.' },
                    { title: 'Resume vs JD Matcher', desc: 'Compare resumes directly with target job descriptions and output similarity metrics.' },
                    { title: 'Cover Letter Writer', desc: 'Draft customized and tailored cover letters matching the requirements of the job post.' }
                  ].map((feat, idx) => (
                    <div key={idx} className="bg-zinc-900/40 backdrop-blur-md p-4 rounded-xl border border-white/5 hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300">
                      <h3 className="font-bold text-white text-sm mb-1">{feat.title}</h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SLIDE 5: ARCHITECTURE ================= */}
            {currentSlide === 5 && (
              <div className="max-w-5xl mx-auto w-full px-6 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/5 text-center md:text-left">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Tech Architecture</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 mb-4 font-outfit">
                    System Architecture
                  </h2>
                  <div className="space-y-3.5 text-left text-xs text-zinc-400">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">1</div>
                      <p><strong>Frontend (React + Vite):</strong> Single-page application using Tailwind and Framer Motion, hosted on Vercel CDN.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">2</div>
                      <p><strong>API Layer (FastAPI):</strong> High-performance async Python backend endpoints deployed on Render.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">3</div>
                      <p><strong>Database (SQLite + SQLAlchemy):</strong> Flat-file SQL database with persistent volume mappings to avoid data loss.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">4</div>
                      <p><strong>AI Engine (Google Gemini API):</strong> Semantic parsing, keyword matching matrices, and parsing services.</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-3/5">
                  <div className="bg-zinc-900/60 p-2 rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_25px_rgba(124,58,237,0.1)]">
                    <img src="./assets/architecture_diagram.png" alt="Architecture Diagram" className="w-full h-auto rounded-xl border border-zinc-800 object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 6: AI WORKFLOW ================= */}
            {currentSlide === 6 && (
              <div className="max-w-5xl mx-auto w-full px-6 flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-2/5 text-center md:text-left">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Resume Processing</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 mb-4 font-outfit">
                    AI Ingestion Workflow
                  </h2>
                  <div className="space-y-3.5 text-left text-xs text-zinc-400">
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">A</span>
                      <p><strong>Ingest & Parse:</strong> PDF resume file processed and extracted to raw string lines.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">B</span>
                      <p><strong>Gemini Schema Parsing:</strong> Messy text formatted into structured database schema JSON using LLM prompt formats.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">C</span>
                      <p><strong>Keyword Scanning:</strong> Comparison arrays check resume text against JD skills requirements.</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-5 h-5 rounded bg-violet-600/20 flex items-center justify-center font-bold text-violet-400 shrink-0 text-[10px]">D</span>
                      <p><strong>Enhance Loop:</strong> Outputs scores and enables single-click prompt corrections.</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-3/5">
                  <div className="bg-zinc-900/60 p-2 rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_25px_rgba(124,58,237,0.1)]">
                    <img src="./assets/resume_workflow.png" alt="Resume Workflow" className="w-full h-auto rounded-xl border border-zinc-800 object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 7: TECHNOLOGY STACK ================= */}
            {currentSlide === 7 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Tech Stack Specs</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    Technology Stack Breakdown
                  </h2>
                </div>
                
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-x-auto shadow-2xl">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-zinc-900/80">
                        <th className="p-4 font-bold text-zinc-300 uppercase tracking-wider text-[10px] md:text-xs">Layer</th>
                        <th className="p-4 font-bold text-zinc-300 uppercase tracking-wider text-[10px] md:text-xs">Technology</th>
                        <th className="p-4 font-bold text-zinc-300 uppercase tracking-wider text-[10px] md:text-xs">Purpose & Capabilities</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      <tr>
                        <td className="p-3.5 font-semibold text-white">Frontend Framework</td>
                        <td className="p-3.5 text-violet-400 font-mono">React (Vite, TS)</td>
                        <td className="p-3.5 text-zinc-400 text-xs">High performance client bundle, type-safe structures, and component modularity.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-white">Styling & Motion</td>
                        <td className="p-3.5 text-violet-400 font-mono">Tailwind CSS + Framer Motion</td>
                        <td className="p-3.5 text-zinc-400 text-xs">Glassmorphic styling, responsive layout structures, and animated transitions.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-white">API Framework</td>
                        <td className="p-3.5 text-violet-400 font-mono">FastAPI (Python)</td>
                        <td className="p-3.5 text-zinc-400 text-xs">Asynchronous routing, quick parsing execution, and CORS middleware controls.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-white">Database & ORM</td>
                        <td className="p-3.5 text-violet-400 font-mono">SQLite + SQLAlchemy</td>
                        <td className="p-3.5 text-zinc-400 text-xs">Lightweight SQL relational engine mapping model definitions and relationship models.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold text-white">AI Engine</td>
                        <td className="p-3.5 text-violet-400 font-mono">Google Gemini Pro API</td>
                        <td className="p-3.5 text-zinc-400 text-xs">Parsing unstructured text, comparing job posts, and generating optimized bullets.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= SLIDE 8: DEMO RESULTS ================= */}
            {currentSlide === 8 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Real Case Study</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    Demo Results: Vivek Tripathi
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="bg-zinc-900/40 border border-white/5 border-t-2 border-t-red-500/50 p-5 rounded-2xl flex flex-col items-center justify-center shadow-lg h-1/2">
                      <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase mb-1">Original Resume</span>
                      <div className="text-4xl font-extrabold text-red-500 font-outfit">52%</div>
                      <span className="text-[9px] text-zinc-500 mt-1">Generic terms, lack of metrics</span>
                    </div>
                    <div className="bg-zinc-900/40 border border-white/5 border-t-2 border-t-emerald-500/50 p-5 rounded-2xl flex flex-col items-center justify-center shadow-lg h-1/2">
                      <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase mb-1">Optimized by NextHire</span>
                      <div className="text-4xl font-extrabold text-emerald-400 font-outfit">89%</div>
                      <span className="text-[9px] text-zinc-500 mt-1">Tech keywords, metrics added</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-8 bg-zinc-900/40 border border-white/5 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-violet-400" />
                        Resume Bullet Point Optimization
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 text-xs">
                          <div className="text-red-400 font-medium line-through mb-1">❌ "Created API endpoints in Python."</div>
                          <div className="text-emerald-400 font-semibold">
                            ✅ "Designed and optimized <span className="underline">FastAPI REST endpoints</span> using custom <span className="underline">Redis caching middleware</span>, reducing response latency by <span className="underline">35%</span>."
                          </div>
                        </div>
                        
                        <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 text-xs">
                          <div className="text-red-400 font-medium line-through mb-1">❌ "Worked on the frontend React website."</div>
                          <div className="text-emerald-400 font-semibold">
                            ✅ "Developed responsive frontend dashboards using <span className="underline">React (Vite)</span> and <span className="underline">Framer Motion</span>, increasing user session duration by <span className="underline">22%</span>."
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase">Keywords Added:</span>
                      {['TypeScript', 'RESTful Routing', 'Vector Embeddings', 'CI/CD Pipelines'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-violet-950/40 border border-violet-500/20 text-violet-400 font-mono">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 9: PRODUCT SCREENSHOTS ================= */}
            {currentSlide === 9 && (
              <div className="max-w-5xl mx-auto w-full px-6 flex flex-col justify-between">
                <div className="text-center md:text-left mb-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Interface Gallery</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    Application Screenshots
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-12 gap-6 items-stretch">
                  <div className="md:col-span-3 flex flex-col gap-2 justify-center">
                    {screenshots.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveScreenshot(idx)} 
                        className={`text-left px-4 py-3 rounded-xl border text-xs md:text-sm font-semibold duration-200 ${
                          activeScreenshot === idx 
                            ? 'bg-zinc-900 border-violet-500/40 text-violet-400 shadow-md shadow-violet-950/20' 
                            : 'border-white/5 text-zinc-400 hover:bg-white/5'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                  
                  <div className="md:col-span-9 flex items-center justify-center">
                    <div className="bg-zinc-900/60 p-2 rounded-2xl border border-white/10 w-full flex flex-col justify-center items-center relative overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                      <img 
                        src={screenshots[activeScreenshot].src} 
                        alt="Active Screenshot" 
                        className="max-w-full max-h-[300px] md:max-h-[320px] rounded-xl border border-zinc-800 object-contain" 
                      />
                      <div className="mt-3 bg-black/60 border border-white/5 px-4 py-2 rounded-xl text-center text-xs text-zinc-400 w-[95%]">
                        {screenshots[activeScreenshot].desc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 10: ALGORITHM & DEPLOYMENT ================= */}
            {currentSlide === 10 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Core Engine & Hosting</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    AI Algorithm & Production Deployment
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: AI Algorithms */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Core NLP & Matching Algorithms
                    </h3>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">1. Structured NLP Ingestion (Parser)</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Messy resume text lines are scanned by backend parsers and structured into strict, database-compliant Pydantic schemas using context-guided Gemini API prompts.</p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">2. ATS Score Weight Matrix</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Calculates similarities between resumes and JDs using keyword token frequency vectors, matching keyphrase weight algorithms, and Jaccard similarity metrics.</p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">3. STAR Accomplishment Optimizer</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Custom prompt layers rewrite weak bullets into STAR-format (Situation, Task, Action, Result) accomplishments with active verbs and quantitative impacts.</p>
                    </div>
                  </div>
                  
                  {/* Right: Production Deployment */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      CI/CD & Deployment Stack
                    </h3>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">Frontend (Vercel CDN Edge)</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">React client code is optimized, compiled, and served via Vercel's global CDN nodes. Integrates push-to-master automated Git CI/CD pipelines.</p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">Backend (FastAPI on Render)</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Python API services are hosted on Render Web Services. Implements Cross-Origin Resource Sharing (CORS) security to secure requests between client/server.</p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-xl hover:border-violet-500/20 duration-300">
                      <h4 className="font-bold text-white text-xs mb-1">Database State Persistence</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Mounts a 1GB persistent disk volume under `/data` on Render to store the SQLite database. Prevents candidate data erasure on container rebuild restarts.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SLIDE 11: FUTURE SCOPE ================= */}
            {currentSlide === 11 && (
              <div className="max-w-5xl mx-auto w-full px-6">
                <div className="text-center md:text-left mb-6">
                  <span className="text-xs uppercase font-bold tracking-widest text-violet-400">Development Roadmap</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1 font-outfit">
                    Future Scope & Roadmap
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { phase: 'Phase 1', title: 'Kanban Application Tracker', desc: 'Add job pipelines (Applied, Interview, Offer) linked directly to the customized resume generated.', eta: 'PLANNED Q3' },
                    { phase: 'Phase 2', title: 'Design Themes Store', desc: 'Add customizable portfolio themes (e.g. Cyberpunk, Glassmorphic, Light Mode) with customization sliders.', eta: 'PLANNED Q4' },
                    { phase: 'Phase 3', title: 'GitHub & LinkedIn Sync', desc: 'Sync candidate details automatically based on commits or social platform updates via webhook integrations.', eta: 'PLANNED Q1' },
                    { phase: 'Phase 4', title: 'Gemini Audio Interviews', desc: 'Perform mock audio and text technical interviews powered by Gemini, targeting user resume details.', eta: 'PLANNED Q2' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-violet-500/20 duration-250">
                      <div>
                        <div className="text-[10px] font-bold text-violet-400 tracking-wider uppercase mb-1.5">{item.phase}</div>
                        <h3 className="font-bold text-white text-xs mb-1.5">{item.title}</h3>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="mt-4 text-[9px] text-violet-400 font-bold font-mono">{item.eta}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SLIDE 12: CONCLUSION ================= */}
            {currentSlide === 12 && (
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center p-6">
                <span className="text-xs uppercase font-bold tracking-widest text-violet-400 mb-2">Project Wrap-Up</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 font-outfit">
                  Elevating Careers with AI
                </h2>
                
                <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed mb-8">
                  NextHire AI automates resume customization, ATS score checking, and web portfolio hosting. Linking a React frontend with a FastAPI backend and harnessing the Google Gemini API, we deliver a rapid, responsive, SaaS platform designed to optimize job search workflows.
                </p>

                <h3 className="text-xl md:text-2xl font-bold text-violet-400 mb-4 font-outfit">Thank You!</h3>

                <div className="bg-zinc-900/40 p-4 rounded-xl flex flex-col md:flex-row gap-4 md:gap-8 text-xs font-medium text-zinc-400 border border-white/5 shadow-lg">
                  <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-zinc-500" /> <span className="text-white font-mono">vivek.tripathi@nexthire.ai</span></div>
                  <div className="hidden md:block text-zinc-800">|</div>
                  <div className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-zinc-500" /> <span className="text-white font-mono">vivektripathi0320-web</span></div>
                  <div className="hidden md:block text-zinc-800">|</div>
                  <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-zinc-500" /> <span className="text-white font-mono">nexthire-ai.vercel.app/vivek-tripathi</span></div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="flex justify-between items-center z-20 pt-4 border-t border-zinc-800">
        <div className="hidden md:flex items-center gap-1 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
          <span>Keyboard controls:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[9px] ml-1">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[9px]">→</kbd>
          <span>or</span>
          <kbd className="px-3 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[9px]">Space</kbd>
        </div>
        <div className="md:hidden text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
          Tap buttons to navigate
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentSlide(idx + 1)}
              className={`transition-all duration-300 cursor-pointer ${
                currentSlide === idx + 1 
                  ? 'w-5 h-2 rounded bg-violet-400' 
                  : 'w-2 h-2 rounded-full bg-zinc-800 hover:bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentSlide === 1}
            className={`px-3 py-1.5 rounded-lg border border-zinc-800 text-xs font-bold transition duration-200 ${
              currentSlide === 1 
                ? 'opacity-40 cursor-not-allowed text-zinc-600' 
                : 'bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
          >
            Prev
          </button>
          <button 
            onClick={handleNext}
            disabled={currentSlide === totalSlides}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 shadow-md ${
              currentSlide === totalSlides 
                ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500 shadow-none' 
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/20'
            }`}
          >
            Next
          </button>
        </div>
      </footer>

      {/* Progress bar line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-950">
        <div 
          className="h-full bg-gradient-to-r from-violet-600 to-purple-400 transition-all duration-300" 
          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
        />
      </div>
    </div>
  );
}
