import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileText, 
  Save, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Wand2, 
  Briefcase, 
  Bookmark, 
  Printer, 
  Download,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resume {
  id: number;
  title: string;
  created_at: string;
  json_content: any;
}

interface CoverLetterSection {
  title: string;
  greeting: string;
  introduction: string;
  body: string;
  closing: string;
  signature: string;
}

interface CoverLetter {
  id?: number;
  resume_id?: number;
  title: string;
  letter_type: string;
  style: string;
  content: CoverLetterSection;
  score: number;
  personalization_score: number;
  ats_score: number;
  tone_score: number;
  structure_score: number;
  keywords_detected: string[];
}

export default function CoverLetterGenerator() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | ''>('');
  
  // File Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedResumeData, setUploadedResumeData] = useState<any | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');

  // Form states
  const [letterType, setLetterType] = useState('Professional');
  const [writingStyle, setWritingStyle] = useState('Confident');
  const [jobDescription, setJobDescription] = useState('');

  // Main Cover Letter state
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Template state: 'classic' | 'modern' | 'creative' | 'dark'
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'creative' | 'dark'>('classic');

  // Saved Cover Letters
  const [savedLetters, setSavedLetters] = useState<CoverLetter[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI Paragraph Improve Modal/Pop-up state
  const [improvingSection, setImprovingSection] = useState<keyof CoverLetterSection | null>(null);
  const [improveInstruction, setImproveInstruction] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  // Reference for printable area
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetchResumes();
    fetchSavedLetters();
  }, []);

  const fetchResumes = async () => {
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
      console.error("Failed to load resumes:", err);
    }
  };

  const fetchSavedLetters = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await fetch("http://localhost:8000/api/cover-letters");
      if (res.ok) {
        const data = await res.json();
        setSavedLetters(data);
      }
    } catch (err) {
      console.error("Failed to load saved letters:", err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);
    setUploadedResumeData(null);
    setUploadFileName(file.name);

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File exceeds 10MB limit.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/resumes/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Failed to parse resume file.");
      }

      const data = await res.json();
      setUploadedResumeData(data.resume_data);
      setSelectedResumeId(''); // clear selection since we are using raw uploaded data
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload and parse resume.");
      setUploadFileName('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const payload: any = {
        letter_type: letterType,
        style: writingStyle,
        job_description: jobDescription || null
      };

      if (selectedResumeId) {
        payload.resume_id = Number(selectedResumeId);
      } else if (uploadedResumeData) {
        payload.resume_data = uploadedResumeData;
      } else {
        throw new Error("Please select a saved resume or upload a resume file.");
      }

      const res = await fetch("http://localhost:8000/api/cover-letters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to generate cover letter.");
      }

      const data = await res.json();
      setCoverLetter(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    if (!coverLetter) return;
    if (!jobDescription.trim()) {
      setError("Please paste a Job Description first to perform ATS optimization.");
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:8000/api/cover-letters/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_content: coverLetter.content,
          job_description: jobDescription
        })
      });

      if (!res.ok) throw new Error("Failed to optimize cover letter.");

      const optimizedContent = await res.json();
      
      // Re-score slightly higher for ATS alignment
      setCoverLetter({
        ...coverLetter,
        content: optimizedContent,
        ats_score: Math.min(100, coverLetter.ats_score + 12),
        score: Math.min(100, coverLetter.score + 5)
      });
    } catch (err: any) {
      setError(err.message || "Failed to run optimization.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!coverLetter) return;
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        resume_id: selectedResumeId ? Number(selectedResumeId) : null,
        title: coverLetter.title || `${letterType} Cover Letter`,
        letter_type: coverLetter.letter_type,
        style: coverLetter.style,
        content: coverLetter.content,
        score: coverLetter.score,
        personalization_score: coverLetter.personalization_score,
        ats_score: coverLetter.ats_score,
        tone_score: coverLetter.tone_score,
        structure_score: coverLetter.structure_score,
        keywords_detected: coverLetter.keywords_detected
      };

      const res = await fetch("http://localhost:8000/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save cover letter.");

      const data = await res.json();
      setCoverLetter(data); // update with database ID
      fetchSavedLetters();
    } catch (err: any) {
      setError(err.message || "Failed to save cover letter.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this saved cover letter?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/cover-letters/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        if (coverLetter?.id === id) {
          setCoverLetter(null);
        }
        fetchSavedLetters();
      }
    } catch (err) {
      console.error("Failed to delete letter:", err);
    }
  };

  const handleSectionEdit = (section: keyof CoverLetterSection, value: string) => {
    if (!coverLetter) return;
    setCoverLetter({
      ...coverLetter,
      content: {
        ...coverLetter.content,
        [section]: value
      }
    });
  };

  const triggerImprove = async () => {
    if (!coverLetter || !improvingSection || !improveInstruction.trim()) return;

    setIsImproving(true);
    try {
      const textToImprove = coverLetter.content[improvingSection];
      const res = await fetch("http://localhost:8000/api/cover-letters/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToImprove,
          instruction: improveInstruction
        })
      });

      if (!res.ok) throw new Error("Failed to improve paragraph.");

      const data = await res.json();
      handleSectionEdit(improvingSection, data.improved_text);
      setImprovingSection(null);
      setImproveInstruction('');
    } catch (err: any) {
      setError(err.message || "Failed to improve section.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    const fullText = [
      coverLetter.content.greeting,
      "",
      coverLetter.content.introduction,
      "",
      coverLetter.content.body,
      "",
      coverLetter.content.closing,
      "",
      coverLetter.content.signature
    ].join("\n");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportDOCX = () => {
    if (!coverLetter) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Cover Letter</title><style>body { font-family: Arial; margin: 1in; line-height: 1.5; color: #333333; } h2 { color: #5B21B6; font-size: 20pt; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; } p { font-size: 11pt; margin-bottom: 12pt; }</style></head><body>";
    const footer = "</body></html>";
    
    // Formatting content correctly
    const formattedSignature = coverLetter.content.signature.replace(/\n/g, '<br/>');
    const contentHtml = `
      <div>
        <h2>${coverLetter.content.title}</h2>
        <br/>
        <p>${coverLetter.content.greeting}</p>
        <p>${coverLetter.content.introduction}</p>
        <p>${coverLetter.content.body}</p>
        <p>${coverLetter.content.closing}</p>
        <br/>
        <p>${formattedSignature}</p>
      </div>
    `;

    const blob = new Blob([header + contentHtml + footer], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${coverLetter.title.replace(/\s+/g, '_') || 'Cover_Letter'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Retrieve user contact info from selected resume data to display in template header
  const getSelectedResumeContact = () => {
    if (selectedResumeId) {
      const resObj = resumes.find(r => r.id === Number(selectedResumeId));
      if (resObj && resObj.json_content && resObj.json_content.contact) {
        return resObj.json_content.contact;
      }
    } else if (uploadedResumeData && uploadedResumeData.contact) {
      return uploadedResumeData.contact;
    }
    return { name: "John Doe", email: "johndoe@email.com", phone: "+1 (555) 019-2834", location: "San Francisco, CA" };
  };

  const contact = getSelectedResumeContact();

  // Circular gauge renderer
  const CircularProgress = ({ value, label }: { value: number; label: string }) => {
    const radius = 22;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/5">
        <div className="relative flex items-center justify-center w-12 h-12">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-white/10"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
            <circle
              className="text-primary transition-all duration-500 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="24"
              cy="24"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-white">{value}%</span>
        </div>
        <span className="text-[8px] font-bold text-zinc-400 tracking-wider uppercase text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-white/5 no-print">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary animate-pulse" /> AI Cover Letter Generator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Build bespoke, high-scoring cover letters optimized for ATS and recruiters.
          </p>
        </div>
        
        {/* Template Buttons */}
        {coverLetter && (
          <div className="flex items-center gap-2 mt-4 md:mt-0 bg-white/5 p-1 rounded-xl border border-white/10">
            {(['classic', 'modern', 'creative', 'dark'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTemplate(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedTemplate === t 
                    ? 'bg-primary text-white shadow-primary-glow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
        {/* LEFT COLUMN: Controls & History (no-print) */}
        <div className="lg:col-span-4 flex flex-col gap-6 no-print">
          
          {/* Main Form Configurator */}
          <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Briefcase className="h-4.5 w-4.5 text-primary" /> Letter Configuration
            </h2>

            {/* Resume Selector */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Profile Resume</label>
                
                {/* Custom File Upload Input */}
                <label className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-bold uppercase tracking-wider cursor-pointer transition-colors">
                  <Upload className="h-3 w-3" /> Upload File
                  <input 
                    type="file" 
                    accept=".pdf,.txt,.doc,.docx" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {isUploading ? (
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Processing uploaded resume...</span>
                </div>
              ) : uploadFileName ? (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 text-xs text-primary">
                  <span className="truncate max-w-[80%] font-medium">📄 {uploadFileName}</span>
                  <button 
                    onClick={() => { setUploadedResumeData(null); setUploadFileName(''); if (resumes.length > 0) setSelectedResumeId(resumes[0].id); }} 
                    className="text-zinc-400 hover:text-rose-500 font-bold"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <select 
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value ? Number(e.target.value) : '');
                    setUploadedResumeData(null);
                    setUploadFileName('');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="" disabled className="bg-zinc-900">-- Select Saved Resume --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id} className="bg-zinc-900">
                      {r.title}
                    </option>
                  ))}
                </select>
              )}
              {uploadError && <p className="text-[10px] text-rose-500 mt-1">{uploadError}</p>}
            </div>

            {/* Letter Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Cover Letter Type</label>
              <select 
                value={letterType}
                onChange={(e) => setLetterType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="Professional" className="bg-zinc-900">Professional</option>
                <option value="Internship" className="bg-zinc-900">Internship</option>
                <option value="Entry Level" className="bg-zinc-900">Entry Level</option>
                <option value="Career Change" className="bg-zinc-900">Career Change</option>
                <option value="Experienced" className="bg-zinc-900">Experienced</option>
              </select>
            </div>

            {/* Writing Style */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Writing Style</label>
              <select 
                value={writingStyle}
                onChange={(e) => setWritingStyle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="Professional" className="bg-zinc-900">Professional</option>
                <option value="Formal" className="bg-zinc-900">Formal</option>
                <option value="Friendly" className="bg-zinc-900">Friendly</option>
                <option value="Confident" className="bg-zinc-900">Confident</option>
                <option value="Executive" className="bg-zinc-900">Executive</option>
              </select>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Job Description (Recommended)</label>
              <textarea 
                rows={5}
                placeholder="Paste the target Job Description to extract keywords and customize letter sections..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" /> {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || isUploading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate AI Cover Letter
                </>
              )}
            </button>
          </div>

          {/* Scores/Keywords indicators if letter loaded */}
          {coverLetter && (
            <div className="glass-card rounded-2xl p-6 border-white/5 space-y-4">
              <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> AI Analysis Metrics
              </h2>

              {/* Grid of Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <CircularProgress value={coverLetter.personalization_score} label="Personalization" />
                <CircularProgress value={coverLetter.ats_score} label="ATS Match" />
                <CircularProgress value={coverLetter.tone_score} label="Tone Match" />
                <CircularProgress value={coverLetter.structure_score} label="Structure" />
              </div>

              {/* Total Score Info */}
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-400 font-medium">Overall Compatibility Score</span>
                <span className={`text-sm font-bold ${coverLetter.score >= 80 ? 'text-success' : 'text-primary'}`}>
                  {coverLetter.score}/100
                </span>
              </div>

              {/* Detected keywords */}
              {coverLetter.keywords_detected && coverLetter.keywords_detected.length > 0 && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">ATS Keywords Detected</span>
                  <div className="flex flex-wrap gap-1">
                    {coverLetter.keywords_detected.map((kw, idx) => (
                      <span key={idx} className="bg-primary/10 border border-primary/20 text-primary rounded px-2 py-0.5 text-[10px] font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Letters History List */}
          <div className="glass-card rounded-2xl p-6 border-white/5 space-y-3">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Bookmark className="h-4.5 w-4.5 text-primary" /> Saved Letters
            </h2>

            {isLoadingSaved ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : savedLetters.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No saved cover letters found.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {savedLetters.map((letter) => (
                  <button
                    key={letter.id}
                    onClick={() => {
                      setCoverLetter(letter);
                      setLetterType(letter.letter_type);
                      setWritingStyle(letter.style);
                    }}
                    className={`w-full text-left bg-white/5 border rounded-xl p-3 text-xs flex justify-between items-start transition-all hover:bg-white/10 ${
                      coverLetter?.id === letter.id ? 'border-primary bg-primary/5' : 'border-white/5'
                    }`}
                  >
                    <div className="space-y-1 truncate max-w-[80%]">
                      <p className="font-semibold text-zinc-200 truncate">{letter.title}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {letter.letter_type} • {letter.style}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleDelete(letter.id!, e)}
                      className="text-zinc-500 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sheet Preview & Action Toolbar */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Action Toolbar (no-print) */}
          {coverLetter && (
            <div className="glass-card rounded-2xl p-4 border-white/5 flex flex-wrap items-center justify-between gap-4 no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-zinc-200 hover:bg-white/5 transition-all"
                  title="Regenerate Cover Letter"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Regenerate
                </button>
                
                {jobDescription.trim() && (
                  <button
                    onClick={handleOptimize}
                    disabled={isGenerating}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-all"
                    title="Align with Job Description keywords"
                  >
                    <Wand2 className="h-3.5 w-3.5 animate-pulse" /> ATS Optimize
                  </button>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/80 hover:bg-primary text-xs font-semibold text-white transition-all"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Save
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all hover:bg-white/5 ${
                    copied ? 'border-success text-success bg-success/5' : 'border-white/10 text-zinc-300'
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  Copy
                </button>

                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/5 transition-all"
                >
                  <Printer className="h-3.5 w-3.5" /> Print PDF
                </button>

                <button
                  onClick={handleExportDOCX}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/5 transition-all"
                >
                  <Download className="h-3.5 w-3.5" /> Word DOCX
                </button>
              </div>
            </div>
          )}

          {/* A4 Sheet Preview Container */}
          {coverLetter ? (
            <div className="relative w-full">
              {/* Cover Letter Title input (no-print) */}
              <div className="mb-3 flex items-center gap-2 no-print">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Letter Document Title:</span>
                <input 
                  type="text" 
                  value={coverLetter.title}
                  onChange={(e) => setCoverLetter({ ...coverLetter, title: e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="e.g. Senior Backend Engineer - NextHire AI"
                />
              </div>

              {/* Printable sheet element */}
              <div 
                ref={printRef}
                className={`print-sheet w-full shadow-2xl relative overflow-hidden transition-all duration-300 ${
                  selectedTemplate === 'classic' 
                    ? 'font-serif text-zinc-900 bg-white p-12 sm:p-16 border-t-4 border-zinc-700' 
                    : selectedTemplate === 'modern'
                    ? 'font-sans text-zinc-800 bg-white p-12 sm:p-16 border-t-8 border-primary'
                    : selectedTemplate === 'creative'
                    ? 'font-sans text-zinc-800 bg-white flex flex-col md:flex-row p-0 min-h-[780px]'
                    : 'font-sans text-zinc-100 bg-[#0d0d11]/95 backdrop-blur-md border border-white/10 p-12 sm:p-16 shadow-primary-glow'
                }`}
              >
                
                {/* 1. CLASSIC EXECUTIVE TEMPLATE */}
                {selectedTemplate === 'classic' && (
                  <div className="space-y-6 text-sm text-zinc-900">
                    {/* Header */}
                    <div className="text-center border-b border-zinc-200 pb-4">
                      <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-wide">{contact.name}</h2>
                      <div className="text-xs text-zinc-500 mt-1 space-x-2">
                        <span>{contact.email}</span>
                        <span>•</span>
                        <span>{contact.phone}</span>
                        {contact.location && (
                          <>
                            <span>•</span>
                            <span>{contact.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    {/* Greeting */}
                    <div>
                      <input 
                        type="text" 
                        value={coverLetter.content.greeting}
                        onChange={(e) => handleSectionEdit('greeting', e.target.value)}
                        className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>

                    {/* Body Sections */}
                    <div className="space-y-4 text-justify leading-relaxed">
                      
                      {/* Intro Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.introduction}
                          onChange={(e) => handleSectionEdit('introduction', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('introduction')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                      {/* Body Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={8}
                          value={coverLetter.content.body}
                          onChange={(e) => handleSectionEdit('body', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('body')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                      {/* Closing Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.closing}
                          onChange={(e) => handleSectionEdit('closing', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('closing')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                    </div>

                    {/* Signature */}
                    <div className="pt-4 space-y-6">
                      <textarea 
                        rows={2}
                        value={coverLetter.content.signature}
                        onChange={(e) => handleSectionEdit('signature', e.target.value)}
                        className="w-48 bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-900 font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. MODERN MINIMALIST TEMPLATE */}
                {selectedTemplate === 'modern' && (
                  <div className="space-y-6 text-sm text-zinc-800">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-zinc-100 pb-6">
                      <div>
                        <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">{contact.name}</h2>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{coverLetter.content.title}</p>
                      </div>
                      <div className="text-right text-xs text-zinc-500 mt-4 md:mt-0 space-y-1 font-medium font-sans">
                        <p>{contact.email}</p>
                        <p>{contact.phone}</p>
                        {contact.location && <p>{contact.location}</p>}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-zinc-400 font-medium">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    {/* Greeting */}
                    <div>
                      <input 
                        type="text" 
                        value={coverLetter.content.greeting}
                        onChange={(e) => handleSectionEdit('greeting', e.target.value)}
                        className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm font-extrabold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>

                    {/* Body Sections */}
                    <div className="space-y-4 text-justify leading-relaxed">
                      
                      {/* Intro Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.introduction}
                          onChange={(e) => handleSectionEdit('introduction', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('introduction')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                      {/* Body Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={8}
                          value={coverLetter.content.body}
                          onChange={(e) => handleSectionEdit('body', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('body')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                      {/* Closing Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.closing}
                          onChange={(e) => handleSectionEdit('closing', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('closing')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3 w-3" /> Improve with AI
                        </button>
                      </div>

                    </div>

                    {/* Signature */}
                    <div className="pt-4 space-y-4">
                      <textarea 
                        rows={2}
                        value={coverLetter.content.signature}
                        onChange={(e) => handleSectionEdit('signature', e.target.value)}
                        className="w-48 bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-900 font-extrabold focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CREATIVE VIOLET TEMPLATE */}
                {selectedTemplate === 'creative' && (
                  <>
                    {/* Left Accent Sidebar */}
                    <div className="w-full md:w-[220px] bg-gradient-to-b from-purple-800 to-violet-900 text-purple-100 p-8 flex flex-col justify-between shrink-0 print-side">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight leading-tight">{contact.name}</h2>
                          <div className="h-1 w-12 bg-white/30 rounded mt-3" />
                        </div>

                        <div className="space-y-4 text-xs">
                          <div>
                            <span className="block text-[8px] font-bold uppercase tracking-wider text-purple-300">Email Address</span>
                            <span className="break-all font-medium text-white">{contact.email}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-bold uppercase tracking-wider text-purple-300">Phone Number</span>
                            <span className="font-medium text-white">{contact.phone}</span>
                          </div>
                          {contact.location && (
                            <div>
                              <span className="block text-[8px] font-bold uppercase tracking-wider text-purple-300">Current Location</span>
                              <span className="font-medium text-white">{contact.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-purple-300/80 pt-10 font-bold tracking-widest uppercase">
                        NextHire AI
                      </div>
                    </div>

                    {/* Right Letter Body */}
                    <div className="flex-1 p-8 sm:p-12 space-y-6 text-sm text-zinc-800">
                      {/* Date */}
                      <div className="text-xs text-zinc-400 font-medium border-b border-zinc-100 pb-3">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>

                      {/* Greeting */}
                      <div>
                        <input 
                          type="text" 
                          value={coverLetter.content.greeting}
                          onChange={(e) => handleSectionEdit('greeting', e.target.value)}
                          className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm font-extrabold text-violet-900 focus:outline-none focus:ring-1 focus:ring-violet-300"
                        />
                      </div>

                      {/* Body Sections */}
                      <div className="space-y-4 text-justify leading-relaxed">
                        
                        {/* Intro Paragraph */}
                        <div className="relative group/para">
                          <textarea 
                            rows={4}
                            value={coverLetter.content.introduction}
                            onChange={(e) => handleSectionEdit('introduction', e.target.value)}
                            className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-300 resize-none"
                          />
                          <button 
                            onClick={() => setImprovingSection('introduction')}
                            className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                          >
                            <Wand2 className="h-3 w-3" /> Improve with AI
                          </button>
                        </div>

                        {/* Body Paragraph */}
                        <div className="relative group/para">
                          <textarea 
                            rows={8}
                            value={coverLetter.content.body}
                            onChange={(e) => handleSectionEdit('body', e.target.value)}
                            className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-300 resize-none"
                          />
                          <button 
                            onClick={() => setImprovingSection('body')}
                            className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                          >
                            <Wand2 className="h-3 w-3" /> Improve with AI
                          </button>
                        </div>

                        {/* Closing Paragraph */}
                        <div className="relative group/para">
                          <textarea 
                            rows={4}
                            value={coverLetter.content.closing}
                            onChange={(e) => handleSectionEdit('closing', e.target.value)}
                            className="w-full bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-violet-300 resize-none"
                          />
                          <button 
                            onClick={() => setImprovingSection('closing')}
                            className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 text-zinc-600 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                          >
                            <Wand2 className="h-3 w-3" /> Improve with AI
                          </button>
                        </div>

                      </div>

                      {/* Signature */}
                      <div className="pt-4 space-y-4">
                        <textarea 
                          rows={2}
                          value={coverLetter.content.signature}
                          onChange={(e) => handleSectionEdit('signature', e.target.value)}
                          className="w-48 bg-transparent hover:bg-black/5 focus:bg-black/5 rounded p-1 text-sm text-zinc-900 font-extrabold focus:outline-none focus:ring-1 focus:ring-violet-300 resize-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 4. SLEEK DARK TEMPLATE (Premium) */}
                {selectedTemplate === 'dark' && (
                  <div className="space-y-6 text-sm text-zinc-100">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-white/10 pb-6">
                      <div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{contact.name}</h2>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{coverLetter.content.title}</p>
                      </div>
                      <div className="text-right text-xs text-zinc-400 mt-4 md:mt-0 space-y-1 font-medium">
                        <p>{contact.email}</p>
                        <p>{contact.phone}</p>
                        {contact.location && <p>{contact.location}</p>}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    {/* Greeting */}
                    <div>
                      <input 
                        type="text" 
                        value={coverLetter.content.greeting}
                        onChange={(e) => handleSectionEdit('greeting', e.target.value)}
                        className="w-full bg-transparent hover:bg-white/5 focus:bg-white/5 rounded p-1 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>

                    {/* Body Sections */}
                    <div className="space-y-4 text-justify leading-relaxed">
                      
                      {/* Intro Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.introduction}
                          onChange={(e) => handleSectionEdit('introduction', e.target.value)}
                          className="w-full bg-transparent hover:bg-white/5 focus:bg-white/5 rounded p-1 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('introduction')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3.5 w-3.5 text-primary" /> Improve
                        </button>
                      </div>

                      {/* Body Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={8}
                          value={coverLetter.content.body}
                          onChange={(e) => handleSectionEdit('body', e.target.value)}
                          className="w-full bg-transparent hover:bg-white/5 focus:bg-white/5 rounded p-1 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('body')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3.5 w-3.5 text-primary" /> Improve
                        </button>
                      </div>

                      {/* Closing Paragraph */}
                      <div className="relative group/para">
                        <textarea 
                          rows={4}
                          value={coverLetter.content.closing}
                          onChange={(e) => handleSectionEdit('closing', e.target.value)}
                          className="w-full bg-transparent hover:bg-white/5 focus:bg-white/5 rounded p-1 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                        />
                        <button 
                          onClick={() => setImprovingSection('closing')}
                          className="absolute right-2 top-2 opacity-0 group-hover/para:opacity-100 transition-opacity bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded p-1 text-[10px] font-semibold flex items-center gap-1 shadow-sm no-print"
                        >
                          <Wand2 className="h-3.5 w-3.5 text-primary" /> Improve
                        </button>
                      </div>

                    </div>

                    {/* Signature */}
                    <div className="pt-4 space-y-4">
                      <textarea 
                        rows={2}
                        value={coverLetter.content.signature}
                        onChange={(e) => handleSectionEdit('signature', e.target.value)}
                        className="w-48 bg-transparent hover:bg-white/5 focus:bg-white/5 rounded p-1 text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            /* Empty State if no cover letter generated yet */
            <div className="glass-card rounded-2xl border-white/5 p-12 flex flex-col items-center justify-center text-center flex-1 min-h-[500px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-6 animate-pulse">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">No Cover Letter Generated</h3>
              <p className="text-zinc-400 text-sm max-w-sm mb-6">
                Configure your resume and optional job description on the left panel, then trigger our AI generation.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Multi-theme A4 previews
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Inline editor revisions
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> ATS optimization score
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI PARAGRAPH IMPROVE MODAL */}
      <AnimatePresence>
        {improvingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0e0e12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                  <Wand2 className="h-4.5 w-4.5 text-primary" /> Improve Section with AI
                </h3>
                <button 
                  onClick={() => { setImprovingSection(null); setImproveInstruction(''); }} 
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Current Text</label>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-zinc-300 max-h-[120px] overflow-y-auto italic">
                  "{coverLetter?.content[improvingSection]}"
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Instructions for AI Rewrite</label>
                <input 
                  type="text" 
                  placeholder="e.g. Make it sound more metrics-driven, enthusiastic, or formal..."
                  value={improveInstruction}
                  onChange={(e) => setImproveInstruction(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                  onKeyDown={(e) => { if (e.key === 'Enter') triggerImprove(); }}
                />
              </div>

              {/* Suggestions chips */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Quick Suggestion Filters</span>
                <div className="flex flex-wrap gap-1.5">
                  {["make it sound more experienced", "make it friendly", "ATS-keyword optimize", "add metrics and achievements", "make it formal"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setImproveInstruction(suggestion)}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-white rounded px-2.5 py-1 text-[9px] font-semibold transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => { setImprovingSection(null); setImproveInstruction(''); }}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={triggerImprove}
                  disabled={isImproving || !improveInstruction.trim()}
                  className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all flex items-center gap-1.5"
                >
                  {isImproving ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" /> Improving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" /> Execute Rewrite
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
