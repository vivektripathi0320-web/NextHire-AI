import { Sparkles, Shuffle, ChevronRight } from 'lucide-react';

export default function JdMatcher() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative">
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-card rounded-2xl p-10 max-w-lg relative border-glow-primary/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 mb-6 mx-auto">
          <Shuffle className="h-7 w-7 text-rose-500" />
        </div>
        
        <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
          Job Description Matcher
        </h1>
        
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
          Compare your resume against any job description to evaluate compatibility and identify targeted optimizations.
        </p>

        <div className="border border-white/5 bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-premium animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300">Phase 8 Release Target</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-zinc-400">
            Coming Soon
          </span>
        </div>

        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-sm font-semibold text-zinc-400 cursor-not-allowed">
          Match Resume
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
