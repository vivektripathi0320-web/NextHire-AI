import { Mail, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative">
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glass-card rounded-2xl p-10 max-w-lg relative border-glow-primary/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6 mx-auto">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        
        <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
          Get in Touch
        </h1>
        
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
          Have questions or want to collaborate? Reach out to us. We would love to hear from you.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5" htmlFor="message">
              Message
            </label>
            <textarea 
              id="message" 
              rows={4}
              placeholder="Your message..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Send Message
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
