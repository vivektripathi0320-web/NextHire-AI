import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, ChevronRight, AlertCircle, Loader2, ArrowRight,
  CheckCircle2, ShieldAlert, ListChecks, Check, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Resume {
  id: number;
  title: string;
  created_at: string;
  raw_text?: string;
  json_content: any;
}

interface MatchReport {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}

export default function JdMatcher() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Form states
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  const [jobDescription, setJobDescription] = useState('');

  // Matching states
  const [isMatching, setIsMatching] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [report, setReport] = useState<MatchReport | null>(null);
  
  // Tab states for analysis results
  const [activeTab, setActiveTab] = useState<'matched' | 'missing' | 'advice'>('matched');

  useEffect(() => {
    async function fetchResumes() {
      try {
        const res = await fetch("http://localhost:8000/api/resumes");
        if (!res.ok) throw new Error("Could not load saved resumes.");
        const data = await res.json();
        setResumes(data);
        if (data.length > 0) {
          setSelectedResumeId(data[0].id);
        }
      } catch (err: any) {
        setFetchError(err.message || 'Error loading resumes.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchResumes();
  }, []);

  const getResumeText = (resume: Resume) => {
    if (resume.raw_text && resume.raw_text.trim()) {
      return resume.raw_text.trim();
    }
    
    const content = resume.json_content;
    if (!content) return '';
    
    let text = '';
    if (content.contact?.name) text += `Name: ${content.contact.name}\n`;
    if (content.title) text += `Title: ${content.title}\n`;
    if (content.summary) text += `Summary: ${content.summary}\n\n`;
    
    if (content.skills && content.skills.length > 0) {
      text += `Skills: ${content.skills.join(', ')}\n\n`;
    }
    
    if (content.experience && content.experience.length > 0) {
      text += `Experience:\n`;
      content.experience.forEach((exp: any) => {
        text += `- ${exp.role} at ${exp.company} (${exp.start_date} - ${exp.end_date})\n`;
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach((b: string) => {
            text += `  * ${b}\n`;
          });
        }
      });
      text += '\n';
    }
    
    if (content.projects && content.projects.length > 0) {
      text += `Projects:\n`;
      content.projects.forEach((proj: any) => {
        text += `- ${proj.name}: ${proj.description}\n`;
        if (proj.tech_stack) text += `  Tech Stack: ${proj.tech_stack}\n`;
      });
      text += '\n';
    }
    
    if (content.education && content.education.length > 0) {
      text += `Education:\n`;
      content.education.forEach((edu: any) => {
        text += `- ${edu.degree} from ${edu.institution} (${edu.graduation_date})\n`;
      });
      text += '\n';
    }
    
    return text.trim();
  };

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchError('');
    setReport(null);

    if (!selectedResumeId) {
      setMatchError('Please select a resume to match.');
      return;
    }

    if (!jobDescription.trim()) {
      setMatchError('Please paste a job description.');
      return;
    }

    const resume = resumes.find(r => r.id === selectedResumeId);
    if (!resume) {
      setMatchError('Selected resume not found.');
      return;
    }

    const compiledResumeText = getResumeText(resume);
    if (!compiledResumeText) {
      setMatchError('Selected resume is empty or lacks parseable details.');
      return;
    }

    setIsMatching(true);

    try {
      const payload = {
        resume_text: compiledResumeText,
        job_description: jobDescription.trim()
      };

      const res = await fetch("http://localhost:8000/api/match-jd/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to compile alignment matching report.");
      }

      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      setMatchError(err.message || 'Server error occurred during matching.');
    } finally {
      setIsMatching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 60) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-500 stroke-rose-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-zinc-400 text-sm font-medium">Loading JD Matcher workspace...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Failed to Load Saved Resumes</h2>
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

  // Render warning block if no resumes exist
  if (resumes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto text-center relative">
        <div className="absolute top-[25%] left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-10 max-w-lg relative border-glow-primary/20"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 mb-6 mx-auto">
            <Shuffle className="h-7 w-7 text-rose-500" />
          </div>
          
          <h1 className="text-3xl font-heading font-extrabold text-white mb-4">
            JD Match Auditor
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
            You don't have any resumes saved yet. Build a resume first to compare alignment scores against targeted job descriptions.
          </p>

          <Link
            to="/resume-generator"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-primary-glow transition-all hover:bg-primary/95 hover:scale-[1.02]"
          >
            Create Your Resume
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white flex items-center gap-3">
          <Shuffle className="h-8 w-8 text-primary" />
          Job Description Matcher
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Compare your resume against detailed requirements to evaluate compatibility and identify targeted optimizations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleMatch} className="glass-card rounded-2xl p-6 border-white/5 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                1. Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id} className="bg-zinc-950 text-white">
                    {resume.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                2. Target Job Description
              </label>
              <textarea
                required
                rows={12}
                placeholder="Paste the target job description details here (responsibilities, requirements, skills list)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors font-sans leading-relaxed resize-y"
              />
            </div>

            {matchError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3 text-sm text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{matchError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isMatching}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/95 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMatching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating Alignment...
                </>
              ) : (
                <>
                  Match Compatibility
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {report ? (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
              >
                {/* Score Showcase Card */}
                <div className="glass-card rounded-2xl p-6 border-white/5 flex flex-col md:flex-row items-center gap-6">
                  {/* Score circle */}
                  <div className="relative h-28 w-28 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-white/5"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="48"
                        className={getScoreColor(report.match_percentage)}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - report.match_percentage / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {report.match_percentage}%
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                        Alignment
                      </span>
                    </div>
                  </div>

                  {/* Summary/Badging feedback */}
                  <div className="space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getScoreBgColor(report.match_percentage)}`}>
                        {report.match_percentage >= 80 ? 'Excellent Match' : report.match_percentage >= 60 ? 'Moderate Match' : 'Weak Alignment'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-400 px-2 py-0.5 rounded">
                        ATS Compatibility Scan
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Match Report Summary</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      We compared your resume details against the targeted description. {report.match_percentage >= 80 ? 'Your skills align strongly with this job requirements.' : report.match_percentage >= 60 ? 'You satisfy most requirements, but adding a few missing keywords will boost visibility.' : 'Review recommendations to close formatting gaps and add required competencies.'}
                    </p>
                  </div>
                </div>

                {/* Audit Tabs Interface */}
                <div className="glass-card rounded-2xl border-white/5 overflow-hidden">
                  <div className="flex border-b border-white/5 bg-zinc-900/30">
                    <button
                      type="button"
                      onClick={() => setActiveTab('matched')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                        activeTab === 'matched' 
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/2'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Matched ({report.matched_skills.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('missing')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                        activeTab === 'missing' 
                          ? 'border-rose-500 text-rose-400 bg-rose-500/5' 
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/2'
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>Missing ({report.missing_skills.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('advice')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                        activeTab === 'advice' 
                          ? 'border-primary text-primary-light bg-primary/5' 
                          : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/2'
                      }`}
                    >
                      <ListChecks className="h-4 w-4 shrink-0" />
                      <span>Advice ({report.recommendations.length})</span>
                    </button>
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'matched' && (
                        <motion.div
                          key="matched-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="space-y-4"
                        >
                          <p className="text-zinc-400 text-xs sm:text-sm">
                            The following skills and keywords were successfully detected on your profile:
                          </p>
                          {report.matched_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {report.matched_skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-400 font-semibold"
                                >
                                  <Check className="h-3 w-3 shrink-0" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-zinc-500 text-xs font-medium border border-dashed border-white/5 rounded-xl">
                              No matching keywords found. Try scanning another resume or adjusting search settings.
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'missing' && (
                        <motion.div
                          key="missing-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="space-y-4"
                        >
                          <p className="text-zinc-400 text-xs sm:text-sm">
                            Integrate these keywords into your skills or bullet points to improve alignment scores:
                          </p>
                          {report.missing_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {report.missing_skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-xs text-rose-450 font-semibold"
                                >
                                  <AlertCircle className="h-3 w-3 shrink-0" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 text-emerald-400 text-xs font-semibold border border-dashed border-emerald-500/20 rounded-xl bg-emerald-500/5">
                              Excellent! You have no missing skill gaps for this job specification.
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'advice' && (
                        <motion.div
                          key="advice-tab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="space-y-4"
                        >
                          <p className="text-zinc-400 text-xs sm:text-sm">
                            Actionable optimization strategies to tailor your bullet points:
                          </p>
                          {report.recommendations.length > 0 ? (
                            <ul className="space-y-3 pt-2">
                              {report.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3 text-xs sm:text-sm">
                                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary-light mt-0.5">
                                    {index + 1}
                                  </div>
                                  <span className="text-zinc-350 leading-relaxed pt-0.5">{rec}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-6 text-zinc-500 text-xs font-medium border border-dashed border-white/5 rounded-xl">
                              No recommendations required.
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-2xl p-8 border-white/5 flex flex-col items-center justify-center text-center h-[400px] relative overflow-hidden"
              >
                {/* Mesh graphic */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 border border-white/5 text-zinc-500 mb-6">
                  <HelpCircle className="h-7 w-7" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">No Matching Run Active</h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
                  Select a resume and paste the job description requirement text on the left to analyze alignment audits and keyword suggestions.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
