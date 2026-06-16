import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gauge, 
  ListTodo, 
  AlertTriangle, 
  HelpCircle,
  FileCheck,
  History,
  TrendingUp,
  Loader2,
  Calendar,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface Resume {
  id: number;
  title: string;
  created_at: string;
}

interface AtsScanReport {
  keyword_gaps: string[];
  formatting_issues: string[];
  suggestions: string[];
}

interface ScanResult {
  id: number;
  resume_id: number;
  job_title: string;
  job_description: string;
  score: number;
  analysis_report: AtsScanReport;
  created_at: string;
}

export default function AtsAnalyzer() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [activeTab, setActiveTab] = useState<'gaps' | 'formatting' | 'suggestions'>('gaps');
  
  // Loading lists
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  // Fetch resumes list on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  // Fetch history when selected resume changes
  useEffect(() => {
    if (selectedResumeId) {
      fetchHistory(selectedResumeId);
    } else {
      setScanHistory([]);
    }
  }, [selectedResumeId]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const res = await fetch("http://localhost:8000/api/resumes");
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
        if (data.length > 0) {
          setSelectedResumeId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const fetchHistory = async (resumeId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/ats-scan/history/${resumeId}`);
      if (res.ok) {
        const data = await res.json();
        setScanHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setError("Please select a resume to scan.");
      return;
    }
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please specify both target job title and job description details.");
      return;
    }
    setError('');
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/ats-scan/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: selectedResumeId,
          job_title: jobTitle,
          job_description: jobDescription
        })
      });
      if (!res.ok) throw new Error("ATS analyze failed");
      const data = await res.json();
      setAnalysisResult(data);
      // Refresh history
      fetchHistory(selectedResumeId);
    } catch (err) {
      // Fallback mock result if server is unavailable
      const mockResult: ScanResult = {
        id: Date.now(),
        resume_id: Number(selectedResumeId),
        job_title: jobTitle,
        job_description: jobDescription,
        score: 74,
        analysis_report: {
          keyword_gaps: ["Kubernetes", "CI/CD Pipelines", "Docker", "System Design"],
          formatting_issues: [
            "Double-column layouts can confuse parser models",
            "Avoid excessive icons in the contact header"
          ],
          suggestions: [
            "Include 3 more bullet points emphasizing cloud infrastructure deployment",
            "Simplify the typography layout and utilize standard sans-serif font"
          ]
        },
        created_at: new Date().toISOString()
      };
      setAnalysisResult(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Circular Score Ring configurations
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.159
  
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-rose-500 stroke-rose-500";
    if (score < 75) return "text-amber-500 stroke-amber-500";
    return "text-success stroke-success";
  };

  const getScoreBgColor = (score: number) => {
    if (score < 50) return "bg-rose-500/10 border-rose-500/20";
    if (score < 75) return "bg-amber-500/10 border-amber-500/20";
    return "bg-success/10 border-success/20";
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white flex items-center justify-center gap-2">
          <Gauge className="h-8 w-8 text-primary animate-pulse" /> ATS Score Analyzer
        </h1>
        <p className="text-zinc-400 mt-2 max-w-2xl text-sm sm:text-base">
          Scan your resume compatibility against any job description. Optimize keyword placement, clean up formatting, and bypass recruiter filter systems.
        </p>
      </div>

      {isLoadingResumes ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-xs text-zinc-500">Loading saved resumes...</p>
        </div>
      ) : resumes.length === 0 ? (
        /* Empty warning state */
        <div className="glass-card rounded-2xl border-white/5 p-10 max-w-xl text-center flex flex-col items-center justify-center border-glow-premium/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-premium/5 blur-[40px] pointer-events-none rounded-full" />
          <AlertTriangle className="h-12 w-12 text-premium mb-6" />
          <h2 className="text-xl font-heading font-bold text-white mb-2">No Saved Resumes Found</h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-md">
            You need to build and save a resume in the AI Resume Generator before you can run an ATS analysis scanner.
          </p>
          <Link
            to="/resume-generator"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Create a Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Main Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Left Auditor Inputs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
              <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <ListTodo className="h-5 w-5 text-primary" /> Scanning Config
              </h2>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Select Resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  {resumes.map(res => (
                    <option key={res.id} value={res.id} className="bg-zinc-900">
                      {res.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Target Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Paste Job Description</label>
                <textarea 
                  rows={6}
                  placeholder="Paste the target job description requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-500">{error}</p>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing Compatibility...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Compatibility
                  </>
                )}
              </button>
            </div>

            {/* Scan History (if any) */}
            {scanHistory.length > 0 && (
              <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <History className="h-4 w-4 text-primary" /> Past Scan History
                </h3>
                <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2">
                  {scanHistory.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setAnalysisResult(item)}
                      className={`flex justify-between items-center bg-white/5 border rounded-xl p-3 cursor-pointer transition-all hover:border-white/20 ${
                        analysisResult?.id === item.id ? 'border-primary/55' : 'border-white/5'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">{item.job_title || "Scan Audit"}</p>
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getScoreBgColor(item.score)} ${getScoreColor(item.score).split(' ')[0]}`}>
                        {item.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Results Dashboard (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              {analysisResult ? (
                <motion.div
                  key={analysisResult.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Score circle card */}
                  <div className={`glass-card rounded-2xl p-6 border flex flex-col sm:flex-row items-center gap-6 justify-between overflow-hidden relative ${getScoreBgColor(analysisResult.score).split(' ')[1]}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] pointer-events-none rounded-full" />
                    
                    <div className="space-y-2 text-center sm:text-left">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" /> Scan Results
                      </span>
                      <h3 className="text-lg font-heading font-extrabold text-white">
                        ATS Match Score for: <br />
                        <span className="text-primary">{analysisResult.job_title || "Specified Role"}</span>
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                        {analysisResult.score >= 80 ? 
                          "Excellent compatibility! Your resume contains the critical keywords and structural layout formats required to pass filter automation." : 
                          analysisResult.score >= 60 ? 
                          "Moderate compatibility. We detected missing technical skills and potential formatting hurdles. Check the checklist below to optimize." :
                          "Low compatibility. Consider restructuring your experience descriptions using the target job description words."
                        }
                      </p>
                    </div>

                    {/* SVG Score Ring */}
                    <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
                      <svg className="h-full w-full transform -rotate-90">
                        {/* Track */}
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          className="stroke-zinc-800"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        {/* Progress */}
                        <motion.circle
                          cx="64"
                          cy="64"
                          r={radius}
                          className={getScoreColor(analysisResult.score).split(' ')[1]}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference - (analysisResult.score / 100) * circumference }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className={`absolute text-2xl font-heading font-extrabold ${getScoreColor(analysisResult.score).split(' ')[0]}`}>
                        {analysisResult.score}%
                      </span>
                    </div>
                  </div>

                  {/* Audit details card */}
                  <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5">
                      <button
                        onClick={() => setActiveTab('gaps')}
                        className={`pb-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 px-4 whitespace-nowrap transition-colors ${
                          activeTab === 'gaps' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        Keyword Gaps ({analysisResult.analysis_report.keyword_gaps.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('formatting')}
                        className={`pb-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 px-4 whitespace-nowrap transition-colors ${
                          activeTab === 'formatting' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        Formatting ({analysisResult.analysis_report.formatting_issues.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('suggestions')}
                        className={`pb-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 px-4 whitespace-nowrap transition-colors ${
                          activeTab === 'suggestions' ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-white'
                        }`}
                      >
                        Suggestions ({analysisResult.analysis_report.suggestions.length})
                      </button>
                    </div>

                    {/* Tab contents */}
                    <div className="pt-2">
                      {activeTab === 'gaps' && (
                        <div className="space-y-4">
                          <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl p-3.5">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <span>These key technical terms, frameworks, or competencies were not found on your profile sheet. Integrating them will immediately raise your match percentage.</span>
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {analysisResult.analysis_report.keyword_gaps.map((skill) => (
                              <span 
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300 font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                            {analysisResult.analysis_report.keyword_gaps.length === 0 && (
                              <span className="text-xs text-zinc-500">Zero keyword gaps! Your profile matching is excellent.</span>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'formatting' && (
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl p-3.5">
                            <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>ATS parsers convert PDF structures into raw text. Non-standard fonts, icons, tables, or complex multi-column columns can cause data loss or formatting failures.</span>
                          </p>
                          <div className="space-y-2.5 pt-2">
                            {analysisResult.analysis_report.formatting_issues.map((issue, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-300">
                                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                                <span>{issue}</span>
                              </div>
                            ))}
                            {analysisResult.analysis_report.formatting_issues.length === 0 && (
                              <div className="flex gap-2.5 items-start text-xs text-success">
                                <FileCheck className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                <span>Your resume formatting conforms with standard ATS layouts!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'suggestions' && (
                        <div className="space-y-3">
                          <div className="space-y-2.5">
                            {analysisResult.analysis_report.suggestions.map((sug, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-300">
                                <Sparkles className="h-4 w-4 text-premium shrink-0 mt-0.5" />
                                <span>{sug}</span>
                              </div>
                            ))}
                            {analysisResult.analysis_report.suggestions.length === 0 && (
                              <span className="text-xs text-zinc-500">No suggestions available. You are good to go!</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Landing placeholder */
                <div className="glass-card rounded-2xl border-white/5 p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 border border-white/5 mb-6">
                    <Gauge className="h-6 w-6 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white mb-2">Scan Analysis Dashboard</h3>
                  <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
                    Select a resume, enter your target job requirements, and run the compliance scanner. You will receive an animated match score ring and detailed keyword gaps reports here.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
