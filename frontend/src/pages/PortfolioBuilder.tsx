import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Globe, ChevronRight, Copy, Check, ExternalLink, 
  Linkedin, Github, Twitter, AlertCircle, Loader2, Settings,
  FileText, Palette, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resume {
  id: number;
  title: string;
  created_at: string;
  json_content: any;
}

export default function PortfolioBuilder() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Form states
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('classic-dark');
  
  // Customization/Socials
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdSlug, setCreatedSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await fetch("http://localhost:8000/api/resumes");
        if (!res.ok) throw new Error("Failed to load resumes from the database.");
        const data = await res.json();
        setResumes(data);
        if (data.length > 0) {
          setSelectedResumeId(data[0].id);
          // Prefill default title
          const name = data[0].json_content?.contact?.name || "Professional";
          setTitle(`${name}'s Portfolio`);
          // Prefill default slug based on name
          const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          setSlug(defaultSlug);
        }
      } catch (err: any) {
        setFetchError(err.message || 'Error occurred while loading data.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const handleResumeChange = (resumeId: number) => {
    setSelectedResumeId(resumeId);
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
      const name = resume.json_content?.contact?.name || "Professional";
      setTitle(`${name}'s Portfolio`);
      const defaultSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setSlug(defaultSlug);
    }
  };

  const handleSlugChange = (val: string) => {
    // Only allow lowercase, numbers and hyphens
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setCreatedSlug('');

    if (!selectedResumeId) {
      setSubmitError('Please select a resume to build the portfolio.');
      return;
    }

    if (!title.trim()) {
      setSubmitError('Please enter a portfolio title.');
      return;
    }

    if (!slug.trim()) {
      setSubmitError('Please enter a public slug.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        resume_id: Number(selectedResumeId),
        title: title.trim(),
        slug: slug.trim(),
        theme: selectedTheme,
        customizations: {
          linkedin: linkedin.trim(),
          github: github.trim(),
          twitter: twitter.trim(),
          website: website.trim()
        }
      };

      const res = await fetch("http://localhost:8000/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Could not compile portfolio. Please check settings.');
      }

      setCreatedSlug(data.slug);
    } catch (err: any) {
      setSubmitError(err.message || 'Server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (!createdSlug) return;
    const url = `${window.location.origin}/portfolio/${createdSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themes = [
    {
      id: 'classic-dark',
      name: 'Classic Dark',
      description: 'Sleek dark theme with rich violet accents, glassmorphic cards, and clean typography.',
      previewBg: 'bg-[#09090B] border-primary/30',
      textColor: 'text-zinc-200',
      accentColor: 'bg-primary'
    },
    {
      id: 'modern-glass',
      name: 'Modern Glass',
      description: 'Futuristic frosted overlays, blue-to-indigo gradients, and striking gold highlight borders.',
      previewBg: 'bg-[#0a1128] border-blue-500/30',
      textColor: 'text-blue-100',
      accentColor: 'bg-amber-400'
    },
    {
      id: 'neon-future',
      name: 'Neon Future',
      description: 'Cyberpunk monospace terminal style with glowing cyan borders and high contrast elements.',
      previewBg: 'bg-black border-cyan-500/40',
      textColor: 'text-cyan-400 font-mono',
      accentColor: 'bg-cyan-500'
    },
    {
      id: 'minimalist-light',
      name: 'Minimalist Light',
      description: 'Pure high-contrast light mode with airy padding, charcoal text, and crisp modern outlines.',
      previewBg: 'bg-white border-zinc-200',
      textColor: 'text-zinc-800',
      accentColor: 'bg-zinc-800'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Loading resume portfolios config...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Failed to Load Workspaces</h2>
        <p className="text-zinc-400 text-sm mb-6">{fetchError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition-all"
        >
          Retry Load
        </button>
      </div>
    );
  }

  // If user has no resumes, render the call-to-action warning card
  if (resumes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-[25%] left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-10 max-w-lg relative border-glow-premium/20"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6 mx-auto">
            <Globe className="h-7 w-7 text-primary" />
          </div>
          
          <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
            AI Portfolio Builder
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
            You don't have any resumes saved yet. NextHire compiles your existing resume details into a stunning public portfolio site. Build a resume first!
          </p>

          <Link
            to="/resume-generator"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-primary-glow transition-all hover:bg-primary/90 hover:scale-[1.02]"
          >
            Create Your First Resume
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white flex items-center gap-3">
            <Globe className="h-8 w-8 text-primary" />
            Portfolio Builder
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Publish your resume details into a customized public web portfolio site instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Middle Config form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Data Source */}
          <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">1. Select Resume Source</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Saved Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => handleResumeChange(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id} className="bg-zinc-950 text-white">
                    {resume.title} (Created {new Date(resume.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-zinc-500 block">
                The content from this resume will be rendered live in the portfolio.
              </span>
            </div>
          </div>

          {/* Section 2: Portfolio Visual Theme */}
          <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">2. Choose Theme Style</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`text-left rounded-xl border p-4 flex flex-col justify-between h-40 transition-all relative ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-primary-glow/20 scale-[1.01]' 
                        : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{theme.name}</span>
                        {isSelected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                        {theme.description}
                      </p>
                    </div>

                    {/* Miniature color dots representing theme */}
                    <div className="flex items-center gap-2 mt-4">
                      <div className={`h-8 w-12 rounded border ${theme.previewBg} flex items-center justify-center`}>
                        <span className={`text-[8px] ${theme.textColor}`}>Aa</span>
                      </div>
                      <div className="flex gap-1">
                        <span className={`h-2.5 w-2.5 rounded-full ${theme.accentColor}`} />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-zinc-650" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Links & Public Routing */}
          <div className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-white">3. Setup Public Links & Slug</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Portfolio Web Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe - Fullstack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Public Url Slug
                </label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 bg-zinc-900/60 focus-within:border-primary transition-colors">
                  <span className="bg-zinc-800 text-zinc-500 px-3 py-3 text-xs sm:text-sm flex items-center border-r border-white/5">
                    nexthire.ai/portfolio/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="john-doe"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="w-full bg-transparent px-3 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block">
                  Letters, numbers, and hyphens only.
                </span>
              </div>
            </div>

            {/* Social details (embedded inside customizations json) */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Social Profile Overrides (Optional)
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative flex items-center">
                  <Linkedin className="h-4 w-4 text-zinc-500 absolute left-4" />
                  <input
                    type="url"
                    placeholder="LinkedIn link override"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-11 pr-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative flex items-center">
                  <Github className="h-4 w-4 text-zinc-500 absolute left-4" />
                  <input
                    type="url"
                    placeholder="GitHub link override"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-11 pr-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative flex items-center">
                  <Twitter className="h-4 w-4 text-zinc-500 absolute left-4" />
                  <input
                    type="url"
                    placeholder="Twitter link override"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-11 pr-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative flex items-center">
                  <Globe className="h-4 w-4 text-zinc-500 absolute left-4" />
                  <input
                    type="url"
                    placeholder="Personal website link"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-11 pr-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Errors */}
          {submitError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Publication Failed:</span> {submitError}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/95 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Compiling Portfolio and Reserving Slug...
              </>
            ) : (
              <>
                Publish Live Portfolio
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Right Info Panel / Success Showcase */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {createdSlug ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-6 border-emerald-500/20 bg-emerald-950/10 space-y-6 relative overflow-hidden"
              >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Check className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Portfolio Published!</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Your resume has been compiled into a professional personal site. Share the live URL with recruiters.
                  </p>
                </div>

                {/* Slug display */}
                <div className="border border-white/5 bg-zinc-950/60 rounded-xl p-3 flex items-center justify-between gap-3 overflow-hidden">
                  <span className="text-xs text-zinc-300 font-mono truncate select-all pr-2">
                    {window.location.origin}/portfolio/{createdSlug}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg shrink-0 transition-colors"
                    title="Copy URL"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`/portfolio/${createdSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-xs font-semibold text-white hover:bg-zinc-700 transition-all"
                  >
                    Visit Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-6 border-white/5 space-y-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <Info className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Build Details</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    Choose one of the responsive themes to control fonts, colors, and layout aesthetics. All themes display experiences and contact buttons optimized for mobile and desktop screens.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-3 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Instant deployment under a custom identifier.</span>
                  </div>
                  <div className="flex gap-3 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Real-time link synchronization with database updates.</span>
                  </div>
                  <div className="flex gap-3 text-xs text-zinc-400">
                    <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>Recruiter-focused layout designed to maximize screen time.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
