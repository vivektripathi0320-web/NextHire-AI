import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative"
    >
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="contact-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-10 max-w-lg w-full relative border-glow-primary/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 mb-6 mx-auto">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            
            <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
              Get in Touch
            </h1>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
              Have questions or want to collaborate? Reach out to us. We would love to hear from you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  placeholder="Your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all hover:scale-[1.01] active:scale-[0.99] pulse-glow-button"
              >
                Send Message
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-10 max-w-md w-full relative border-emerald-500/20 bg-emerald-950/5 text-center space-y-6"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Message Dispatched!</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Thank you for contacting NextHire AI. Our support team will review your query and respond shortly to <span className="text-zinc-350 font-semibold">{email}</span>.
              </p>
            </div>

            <div className="pt-4 flex gap-3">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-xs font-semibold text-white hover:bg-zinc-700 transition-all"
              >
                Go Home
              </Link>
              <Link
                to="/resume-generator"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/95 transition-all"
              >
                Build Resume
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
