import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, Phone, Link as LinkIcon, Linkedin, Github, Twitter, 
  ArrowLeft, Briefcase, GraduationCap, Code, ShieldCheck, Loader2, Sparkles
} from 'lucide-react';

interface PortfolioData {
  id: number;
  slug: string;
  title: string;
  theme: string;
  customizations: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  resume: {
    id: number;
    title: string;
    summary: string;
    json_content: {
      contact: {
        name: string;
        email?: string;
        phone?: string;
        linkedin?: string;
        github?: string;
        website?: string;
      };
      experience?: Array<{
        company: string;
        role: string;
        location?: string;
        start_date: string;
        end_date: string;
        bullets: string[];
      }>;
      education?: Array<{
        institution: string;
        degree: string;
        location?: string;
        graduation_date: string;
      }>;
      projects?: Array<{
        name: string;
        description: string;
        tech_stack?: string;
        link?: string;
      }>;
      skills?: string[];
    };
  };
}

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch(`http://localhost:8000/api/portfolios/${slug}`);
        if (res.status === 404) {
          throw new Error('Portfolio not found');
        }
        if (!res.ok) {
          throw new Error('Could not retrieve portfolio details.');
        }
        const data = await res.json();
        setPortfolio(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchPortfolio();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Loading custom portfolio workspace...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-md w-full p-8 rounded-2xl border-white/5 text-center space-y-6"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
            <Globe className="h-7 w-7 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">404 - Portfolio Not Found</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The portfolio slug you are trying to view does not exist or has been removed.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Platform Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const { theme, title: portfolioTitle, customizations, resume } = portfolio;
  const resumeDetails = resume.json_content;
  const contact = resumeDetails.contact;

  // Set page title dynamically
  document.title = portfolioTitle || `${contact.name}'s Resume Portfolio`;

  // Resolve links (custom overrides vs default resume links)
  const resolvedLinkedin = customizations.linkedin || contact.linkedin;
  const resolvedGithub = customizations.github || contact.github;
  const resolvedTwitter = customizations.twitter;
  const resolvedWebsite = customizations.website || contact.website;

  // Theme configuration definitions
  const themeStyles: Record<string, {
    wrapper: string;
    card: string;
    accentBadge: string;
    textName: string;
    textTitle: string;
    headingSection: string;
    textMuted: string;
    textBody: string;
    listBullet: string;
    skillBadge: string;
    iconColor: string;
  }> = {
    'classic-dark': {
      wrapper: 'min-h-screen bg-[#09090B] text-zinc-300 font-sans pb-24 grid-bg relative',
      card: 'bg-[#111114]/85 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden',
      accentBadge: 'bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider',
      textName: 'text-white font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight',
      textTitle: 'text-primary text-sm sm:text-base font-semibold uppercase tracking-widest font-heading',
      headingSection: 'text-white font-heading font-bold text-xl sm:text-2xl border-b border-white/5 pb-3 mb-6 flex items-center gap-3',
      textMuted: 'text-zinc-400 text-xs sm:text-sm font-medium',
      textBody: 'text-zinc-300 text-sm sm:text-base leading-relaxed',
      listBullet: 'text-primary mt-1.5 shrink-0',
      skillBadge: 'bg-zinc-800/80 border border-zinc-700 hover:border-primary/50 text-zinc-300 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
      iconColor: 'text-zinc-400 group-hover:text-primary transition-colors'
    },
    'modern-glass': {
      wrapper: 'min-h-screen bg-gradient-to-br from-[#070b19] via-[#0f172a] to-[#070b19] text-blue-100 font-sans pb-24 relative overflow-hidden',
      card: 'bg-slate-900/50 backdrop-blur-lg border border-slate-500/20 rounded-2xl p-6 md:p-8 shadow-2xl relative',
      accentBadge: 'bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider',
      textName: 'text-white font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-100 to-amber-200',
      textTitle: 'text-amber-400 text-sm sm:text-base font-semibold uppercase tracking-widest font-heading',
      headingSection: 'text-amber-400 font-heading font-bold text-xl sm:text-2xl border-b border-slate-700/50 pb-3 mb-6 flex items-center gap-3',
      textMuted: 'text-slate-400 text-xs sm:text-sm font-medium',
      textBody: 'text-slate-300 text-sm sm:text-base leading-relaxed',
      listBullet: 'text-amber-400 mt-1.5 shrink-0',
      skillBadge: 'bg-slate-800/70 border border-slate-700/50 hover:border-amber-400/50 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
      iconColor: 'text-slate-400 group-hover:text-amber-400 transition-colors'
    },
    'neon-future': {
      wrapper: 'min-h-screen bg-black text-cyan-400 font-mono pb-24 relative',
      card: 'border border-cyan-500/20 bg-black/90 rounded-none p-6 md:p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative',
      accentBadge: 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs px-3 py-1 rounded-none uppercase tracking-widest',
      textName: 'text-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tighter uppercase',
      textTitle: 'text-cyan-400 text-sm sm:text-base uppercase tracking-wider font-bold',
      headingSection: 'text-cyan-400 font-bold text-lg sm:text-xl border-b border-cyan-500/20 pb-3 mb-6 flex items-center gap-3 uppercase tracking-widest',
      textMuted: 'text-zinc-500 text-xs sm:text-sm',
      textBody: 'text-zinc-300 text-sm sm:text-base leading-relaxed',
      listBullet: 'text-cyan-400 mt-1.5 shrink-0',
      skillBadge: 'border border-cyan-500/30 hover:bg-cyan-950/20 text-cyan-300 text-xs px-3 py-1.5 rounded-none transition-all',
      iconColor: 'text-cyan-500/70 group-hover:text-cyan-400 transition-colors'
    },
    'minimalist-light': {
      wrapper: 'min-h-screen bg-zinc-50 text-zinc-800 font-sans pb-24',
      card: 'bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm relative',
      accentBadge: 'bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider',
      textName: 'text-zinc-900 font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight',
      textTitle: 'text-zinc-600 text-sm sm:text-base font-semibold uppercase tracking-wider font-heading',
      headingSection: 'text-zinc-900 font-heading font-bold text-xl sm:text-2xl border-b border-zinc-200 pb-3 mb-6 flex items-center gap-3',
      textMuted: 'text-zinc-500 text-xs sm:text-sm font-medium',
      textBody: 'text-zinc-700 text-sm sm:text-base leading-relaxed',
      listBullet: 'text-zinc-800 mt-1.5 shrink-0',
      skillBadge: 'bg-zinc-100 border border-zinc-200 hover:border-zinc-400 text-zinc-800 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
      iconColor: 'text-zinc-500 group-hover:text-zinc-900 transition-colors'
    }
  };

  const style = themeStyles[theme] || themeStyles['classic-dark'];

  // Utility to absolute format link
  const formatUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className={style.wrapper}>
      {/* Decorative meshes for dark styles */}
      {theme === 'classic-dark' && (
        <div className="absolute top-0 left-0 w-full h-[600px] radial-gradient-overlay pointer-events-none z-0" />
      )}
      {theme === 'modern-glass' && (
        <>
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[40%] right-[10%] w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none z-0" />
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants} className={style.card}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className={style.textName}>{contact.name}</h1>
                <p className={style.textTitle}>{portfolioTitle || resume.title}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border ${
                      theme === 'minimalist-light' 
                        ? 'border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50' 
                        : theme === 'neon-future'
                          ? 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/20'
                          : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                    } transition-all`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                )}
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border ${
                      theme === 'minimalist-light' 
                        ? 'border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50' 
                        : theme === 'neon-future'
                          ? 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/20'
                          : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
                    } transition-all`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>

            {/* Social Overrides and Resume Links */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5">
              {resolvedLinkedin && (
                <a
                  href={formatUrl(resolvedLinkedin)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                >
                  <Linkedin className="h-3.5 w-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
                  <span>LinkedIn</span>
                </a>
              )}
              {resolvedGithub && (
                <a
                  href={formatUrl(resolvedGithub)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                >
                  <Github className="h-3.5 w-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
                  <span>GitHub</span>
                </a>
              )}
              {resolvedTwitter && (
                <a
                  href={formatUrl(resolvedTwitter)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                >
                  <Twitter className="h-3.5 w-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
                  <span>Twitter</span>
                </a>
              )}
              {resolvedWebsite && (
                <a
                  href={formatUrl(resolvedWebsite)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors group"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
                  <span>Website</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Professional Summary */}
          {resume.summary && (
            <motion.div variants={itemVariants} className={style.card}>
              <h2 className={style.headingSection}>
                <Sparkles className="h-5 w-5 text-primary shrink-0" />
                Executive Summary
              </h2>
              <p className={style.textBody}>{resume.summary}</p>
            </motion.div>
          )}

          {/* Experience */}
          {resumeDetails.experience && resumeDetails.experience.length > 0 && (
            <motion.div variants={itemVariants} className={style.card}>
              <h2 className={style.headingSection}>
                <Briefcase className="h-5 w-5 text-primary shrink-0" />
                Professional Experience
              </h2>
              <div className="space-y-8">
                {resumeDetails.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-3 relative">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-white text-base sm:text-lg leading-tight">{exp.role}</h3>
                        <span className="text-primary text-xs sm:text-sm font-semibold">{exp.company}</span>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className={style.textMuted}>{exp.start_date} — {exp.end_date}</span>
                        {exp.location && (
                          <span className={`block text-[11px] font-medium text-zinc-500 mt-0.5`}>{exp.location}</span>
                        )}
                      </div>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-2.5">
                            <span className={style.listBullet}>•</span>
                            <span className={style.textBody}>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {resumeDetails.projects && resumeDetails.projects.length > 0 && (
            <motion.div variants={itemVariants} className={style.card}>
              <h2 className={style.headingSection}>
                <Code className="h-5 w-5 text-primary shrink-0" />
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeDetails.projects.map((proj, idx) => (
                  <div 
                    key={idx} 
                    className={`rounded-xl border p-5 flex flex-col justify-between h-full ${
                      theme === 'minimalist-light' 
                        ? 'border-zinc-200 bg-white hover:border-zinc-400' 
                        : theme === 'neon-future'
                          ? 'border-cyan-500/20 bg-black'
                          : 'border-white/5 bg-white/2 hover:border-white/10'
                    } transition-colors`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{proj.name}</h3>
                        {proj.link && (
                          <a 
                            href={formatUrl(proj.link)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                          >
                            <LinkIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      <p className={`${style.textBody} text-xs leading-relaxed`}>{proj.description}</p>
                    </div>

                    {proj.tech_stack && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 block mb-1">
                          Technologies
                        </span>
                        <p className="text-xs text-zinc-400 font-medium truncate">
                          {proj.tech_stack}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education */}
          {resumeDetails.education && resumeDetails.education.length > 0 && (
            <motion.div variants={itemVariants} className={style.card}>
              <h2 className={style.headingSection}>
                <GraduationCap className="h-5 w-5 text-primary shrink-0" />
                Education & Credentials
              </h2>
              <div className="space-y-6">
                {resumeDetails.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight">{edu.degree}</h3>
                      <span className="text-primary text-xs sm:text-sm font-semibold">{edu.institution}</span>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className={style.textMuted}>{edu.graduation_date}</span>
                      {edu.location && (
                        <span className={`block text-[11px] text-zinc-500 font-medium mt-0.5`}>{edu.location}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills */}
          {resumeDetails.skills && resumeDetails.skills.length > 0 && (
            <motion.div variants={itemVariants} className={style.card}>
              <h2 className={style.headingSection}>
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                Expertise & Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeDetails.skills.map((skill, idx) => (
                  <span key={idx} className={style.skillBadge}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Back Link Floating Badge to NextHire Platform */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/"
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
              theme === 'minimalist-light' 
                ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                : theme === 'neon-future'
                  ? 'border border-cyan-500 bg-black text-cyan-400 shadow-cyan-500/20'
                  : 'bg-zinc-900/80 border border-white/5 text-zinc-300 hover:text-white hover:border-white/10'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Compiled with NextHire AI</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
