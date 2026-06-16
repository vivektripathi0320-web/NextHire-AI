import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileText, 
  Zap, 
  Globe, 
  ArrowRight, 
  ChevronRight, 
  Gauge, 
  Shuffle, 
  Check
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function LandingPage() {
  const stats = [
    { value: "10,000+", label: "Resumes Built" },
    { value: "98.2%", label: "ATS Pass Rate" },
    { value: "3.5x", label: "Interview Increase" }
  ];

  const features = [
    {
      title: "AI Resume Generator",
      description: "Generate professionally structured, ATS-compliant resumes tailored to your target roles in seconds.",
      icon: FileText,
      link: "/resume-generator",
      color: "from-purple-500/20 to-indigo-500/20",
      borderHover: "hover:border-purple-500/30"
    },
    {
      title: "AI Resume Enhancer",
      description: "Transform weak bullet points into high-impact, results-driven action statements that stand out.",
      icon: Zap,
      link: "/resume-enhancer",
      color: "from-blue-500/20 to-cyan-500/20",
      borderHover: "hover:border-blue-500/30"
    },
    {
      title: "ATS Score Analyzer",
      description: "Get a comprehensive score audit identifying grammar issues, formatting flaws, and keyword gaps.",
      icon: Gauge,
      link: "/ats-analyzer",
      color: "from-emerald-500/20 to-teal-500/20",
      borderHover: "hover:border-emerald-500/30"
    },
    {
      title: "Portfolio Generator",
      description: "Convert your resume details into a gorgeous, interactive online portfolio hosted on a public link.",
      icon: Globe,
      link: "/portfolio-builder",
      color: "from-amber-500/20 to-orange-500/20",
      borderHover: "hover:border-amber-500/30",
      premium: true
    },
    {
      title: "JD Matcher",
      description: "Paste a job description and verify your resume compatibility. Get actionable advice to bridge the gap.",
      icon: Shuffle,
      link: "/jd-matcher",
      color: "from-rose-500/20 to-pink-500/20",
      borderHover: "hover:border-rose-500/30"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Input details or upload resume",
      desc: "Provide your work history and target title, or start with your existing resume."
    },
    {
      step: "02",
      title: "Let AI Optimize",
      desc: "Our model tailors bullet points, matches keywords, and selects the optimal format."
    },
    {
      step: "03",
      title: "Review & Deploy",
      desc: "Export an ATS-friendly PDF or launch your custom live portfolio link in one click."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Background Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-zinc-400 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          NextHire AI v1.0 is Live
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-white leading-[1.15]"
        >
          Smart Resumes. <br />
          <span className="bg-gradient-to-r from-primary via-secondary to-premium bg-clip-text text-transparent">
            Stunning Portfolios.
          </span> <br />
          Better Careers.
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-xl text-zinc-400 mt-6 leading-relaxed"
        >
          Accelerate your job search. Build ATS-optimized resumes, receive AI enhancements, audit compatibility, and deploy professional online portfolios instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <Link
            to="/resume-generator"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
          >
            Create Your Resume
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/portfolio-builder"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-base font-semibold text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all w-full sm:w-auto"
          >
            Generate Portfolio
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 w-full max-w-4xl border-t border-b border-white/5 py-8"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                {stat.value}
              </span>
              <span className="text-sm text-zinc-500 mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Core Features Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Supercharge Your Job Search
          </h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Five powerful AI tools housed in one interface, built to make you stand out and bypass recruiter filters.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between ${feat.borderHover} ${
                  feat.premium ? 'border-glow-premium/20 hover:border-glow-premium/40' : ''
                }`}
              >
                {/* Background color gradient glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feat.color} blur-[40px] pointer-events-none rounded-full`} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {feat.premium && (
                      <span className="text-[10px] font-bold tracking-widest text-premium bg-premium/10 border border-premium/20 px-2 py-0.5 rounded-full uppercase">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8">{feat.description}</p>
                </div>

                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-white transition-colors mt-auto group"
                >
                  Explore Tool
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">How It Works</h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Transforming your application process in three simple, automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-8 relative flex flex-col items-start">
              <span className="text-5xl font-heading font-bold text-white/5 absolute top-4 right-6 selection:bg-transparent">
                {item.step}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-6">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative glass-card border border-white/5 rounded-3xl p-8 sm:p-16 overflow-hidden text-center flex flex-col items-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 blur-[80px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 blur-[80px] pointer-events-none rounded-full" />

          <Sparkles className="h-12 w-12 text-primary mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-tight">
            Ready to Land Your Next Role?
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
            Join thousands of candidates using NextHire AI to write smarter resumes, create portfolios, and pass ATS scans effortlessly.
          </p>
          <Link
            to="/resume-generator"
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all hover:scale-[1.02] active:scale-[0.98] mt-10"
          >
            Build Your Resume Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
