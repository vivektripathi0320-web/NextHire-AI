import { Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative"
    >
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-card rounded-2xl p-10 max-w-2xl relative border-glow-primary/10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6 mx-auto">
          <HelpCircle className="h-7 w-7 text-primary" />
        </div>
        
        <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
          About NextHire AI
        </h1>
        
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
          NextHire AI is an advanced career acceleration platform built using state-of-the-art AI technology. Our mission is to empower professionals to build smarter resumes, launch premium online portfolios, analyze ATS compatibility, and land better careers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h3 className="font-heading font-bold text-white text-sm mb-1">Our Mission</h3>
            <p className="text-xs text-zinc-400">Democratizing career opportunities by building professional branding tools accessible to everyone.</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4">
            <h3 className="font-heading font-bold text-white text-sm mb-1">Powered by Gemini</h3>
            <p className="text-xs text-zinc-400">Leverages Google's state-of-the-art Gemini LLM to analyze, enhance, and structure career data.</p>
          </div>
        </div>

        <div className="border border-white/5 bg-white/5 rounded-xl p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-premium animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300">Phase 11 Documentation Target</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 px-2 py-0.5 rounded text-primary">
            Active Project
          </span>
        </div>
      </div>
    </motion.div>
  );
}
