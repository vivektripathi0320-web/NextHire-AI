import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, FileText, User, Briefcase, GraduationCap, FolderGit2, 
  Wrench, Plus, Trash2, Printer, Cloud, CheckCircle, Loader2, 
  Upload, AlertCircle, Award, Bot, LayoutGrid,
  ChevronRight, ArrowRight, Mail, Phone, Globe, Linkedin, Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

interface Education {
  institution: string;
  degree: string;
  location: string;
  graduation_date: string;
  cgpa?: string;
}

interface Project {
  name: string;
  description: string;
  tech_stack: string;
  link: string;
}

interface Certification {
  name: string;
  issuer: string;
}

interface ResumeData {
  title: string;
  summary: string;
  contact: Contact;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
}

const initialResumeData: ResumeData = {
  title: "Frontend Engineer Resume",
  summary: "Dynamic Software Engineer with a passion for building responsive, pixel-perfect user interfaces. Skilled in modern React development, state management, and performance tuning.",
  contact: {
    name: "Alex Mercer",
    email: "alexmercer@email.com",
    phone: "+1 (555) 019-2834",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmercer",
    github: "github.com/alexmercer",
    website: "alexmercer.dev"
  },
  experience: [
    {
      company: "Tech Solutions Inc.",
      role: "Frontend Developer",
      location: "San Francisco, CA",
      start_date: "Jan 2022",
      end_date: "Present",
      bullets: [
        "Spearheaded redesign of core dashboard, resulting in 25% faster load times.",
        "Created reusable UI component library in React, saving 15+ developer hours per week."
      ]
    }
  ],
  education: [
    {
      institution: "State University",
      degree: "B.S. in Computer Science",
      location: "Boston, MA",
      graduation_date: "May 2021",
      cgpa: "3.8/4.0"
    }
  ],
  skills: ["React", "TypeScript", "Tailwind CSS", "JavaScript", "Node.js", "Git", "REST APIs"],
  projects: [
    {
      name: "Portfolio Command Center",
      description: "Interactive dark-themed SaaS UI layout showcasing complex chart metrics.",
      tech_stack: "React, Tailwind CSS, Recharts",
      link: "github.com/alexmercer/portfolio"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services"
    }
  ]
};

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTab, setActiveTab] = useState<'ai-prompt' | 'templates' | 'contact' | 'experience' | 'education-projects' | 'skills-certs'>('ai-prompt');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-professional');
  
  // Target role state
  const [targetRole, setTargetRole] = useState('Frontend Engineer');

  // AI Prompt generation states
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  
  // Drag and Drop Upload states
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Developer Debug Mode states
  const [devDebugMode, setDevDebugMode] = useState(false);
  const [debugTrace, setDebugTrace] = useState<any>(null);
  const [uploadStatusStep, setUploadStatusStep] = useState<string>('');
  
  // Preview and score states
  const [extractedPreview, setExtractedPreview] = useState<ResumeData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [extractionConfidence, setExtractionConfidence] = useState<number | null>(null);

  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // AI Suggestions and Context assistant states
  const [focusedField, setFocusedField] = useState<'summary' | 'experience' | 'skills' | 'projects' | null>(null);
  const [focusedExpIdx, setFocusedExpIdx] = useState<number | null>(null);
  const [focusedBulletIdx, setFocusedBulletIdx] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Recommendations lists (auto-suggested based on target role)
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [recommendedCertifications, setRecommendedCertifications] = useState<any[]>([]);

  // Floating AI Assistant state
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [quickActionLoading, setQuickActionLoading] = useState(false);
  const [quickActionStatus, setQuickActionStatus] = useState('');

  // Dynamic inputs states
  const [newSkillText, setNewSkillText] = useState('');
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');

  // Auto-fetch recommendations when targetRole changes
  useEffect(() => {
    if (targetRole.trim().length > 2) {
      fetchSkillsRecommendations();
      fetchProjectsRecommendations();
      fetchCertificationsRecommendations();
    }
  }, [targetRole]);

  const fetchSkillsRecommendations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedSkills(data.skills || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectsRecommendations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCertificationsRecommendations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedCertifications(data.certifications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger AI suggestions for focused field
  const handleGetSuggestions = async (fieldType: 'summary' | 'experience' | 'skills' | 'projects', currentVal: string) => {
    setIsLoadingSuggestions(true);
    setAiSuggestions([]);
    try {
      const res = await fetch("http://localhost:8000/api/ai-assistant/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field_type: fieldType === 'experience' ? 'achievements' : fieldType,
          target_role: targetRole,
          current_text: currentVal
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Enhance a single bullet point in-place with STAR method
  const handleEnhanceBullet = async (expIdx: number, bulletIdx: number) => {
    const currentBullet = resumeData.experience[expIdx].bullets[bulletIdx];
    if (!currentBullet.trim()) return;

    // Set loading indicator
    updateBullet(expIdx, bulletIdx, "Optimizing achievement via STAR method...");
    
    try {
      const res = await fetch("http://localhost:8000/api/enhancements/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet_point: currentBullet,
          job_title: targetRole
        })
      });
      if (res.ok) {
        const data = await res.json();
        updateBullet(expIdx, bulletIdx, data.enhanced || currentBullet);
      } else {
        throw new Error();
      }
    } catch (err) {
      updateBullet(expIdx, bulletIdx, currentBullet); // revert
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadError('');
    setIsUploading(true);
    setExtractionConfidence(null);
    setDebugTrace(null);
    
    // Validate file size (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File exceeds maximum size of 10MB.");
      setIsUploading(false);
      return;
    }
    
    try {
      setUploadStatusStep("Uploading resume file...");
      
      const formData = new FormData();
      formData.append("file", file);

      // Simple timer to update extraction status message
      const stepTimer = setTimeout(() => {
        setUploadStatusStep("Extracting text from document...");
      }, 800);

      const res = await fetch("http://localhost:8000/api/resumes/upload", {
        method: "POST",
        body: formData
      });

      clearTimeout(stepTimer);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Upload parsing failed.");
      }

      setUploadStatusStep("AI parsing resume details...");
      const data = await res.json();
      
      setUploadStatusStep("Validating data integrity...");
      setDebugTrace({
        fileName: file.name,
        fileType: data.file_type || file.name.split('.').pop(),
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        textEngine: data.text_extraction_engine,
        charCount: data.extracted_character_count,
        ocrTriggered: data.ocr_triggered ? 'Yes' : 'No',
        ocrLog: data.ocr_log || 'N/A',
        aiStatus: data.ai_parsing_status,
        jsonValidation: data.json_validation_status,
        rawResponse: data.raw_ai_response,
        confidenceScore: data.confidence_score
      });

      setExtractionConfidence(data.confidence_score);

      const rd = data.resume_data;
      const parsedData: ResumeData = {
        title: rd.name ? `${rd.name} Resume` : "Parsed Resume",
        summary: rd.summary || "",
        contact: {
          name: rd.name || "",
          email: rd.email || "",
          phone: rd.phone || "",
          address: rd.location || "",
          linkedin: rd.linkedin || "",
          github: rd.github || "",
          website: ""
        },
        education: rd.education || [],
        skills: rd.skills || [],
        experience: rd.experience || [],
        projects: rd.projects || [],
        certifications: rd.certifications || []
      };

      setExtractedPreview(parsedData);
      setShowPreviewModal(true);
      setUploadStatusStep("Processing completed successfully.");
    } catch (err: any) {
      setUploadError(err.message || "Failed to parse resume.");
      setUploadStatusStep("Error occurred during parsing.");
    } finally {
      setIsUploading(false);
    }
  };

  // Completeness score calculator
  const calculateCompleteness = () => {
    let score = 0;
    const missing = [];

    if (resumeData.contact.name) score += 15;
    if (resumeData.contact.email) score += 10;
    if (resumeData.contact.phone) score += 10;
    if (resumeData.contact.address) score += 10;
    
    if (resumeData.contact.linkedin) {
      score += 5;
    } else {
      missing.push("LinkedIn Link");
    }

    if (resumeData.contact.github) {
      score += 5;
    } else {
      missing.push("GitHub Link");
    }

    if (resumeData.summary) score += 10;

    if (resumeData.experience.length > 0 && resumeData.experience[0].company) {
      score += 15;
    } else {
      missing.push("Work Experience");
    }

    if (resumeData.education.length > 0 && resumeData.education[0].institution) {
      score += 10;
    } else {
      missing.push("Education Details");
    }

    if (resumeData.projects.length > 0 && resumeData.projects[0].name) {
      score += 5;
    } else {
      missing.push("Projects");
    }

    if (resumeData.certifications.length > 0 && resumeData.certifications[0].name) {
      score += 5;
    } else {
      missing.push("Certifications");
    }

    return { score, missing };
  };

  // Career Readiness Score calculator
  const calculateReadiness = (completeness: number) => {
    // Completeness counts 30%
    const completenessFactor = completeness * 0.3;
    
    // Skills density: 8 skills maxes 20%
    const skillsCount = resumeData.skills.length;
    const skillsFactor = Math.min((skillsCount / 8) * 20, 20);

    // Experience Quality: 2 experience listings with 2 bullet points each maxes 30%
    let expPoints = 0;
    resumeData.experience.forEach(exp => {
      if (exp.company && exp.role) expPoints += 10;
      expPoints += Math.min(exp.bullets.filter(b => b.length > 15).length * 5, 10);
    });
    const expFactor = Math.min(expPoints, 30);

    // Projects: 2 projects with descriptions maxes 20%
    let projPoints = 0;
    resumeData.projects.forEach(proj => {
      if (proj.name && proj.description) projPoints += 10;
    });
    const projFactor = Math.min(projPoints, 20);

    const totalReadiness = Math.round(completenessFactor + skillsFactor + expFactor + projFactor);
    
    let level = 'Beginner';
    if (totalReadiness >= 91) level = 'Interview Ready';
    else if (totalReadiness >= 71) level = 'Job Ready';
    else if (totalReadiness >= 41) level = 'Developing';

    return { score: totalReadiness, level };
  };

  const { score: completenessScore, missing: missingFields } = calculateCompleteness();
  const { score: readinessScore, level: readinessLevel } = calculateReadiness(completenessScore);

  // AI Quick Actions triggers
  const triggerQuickAction = async (action: string) => {
    setQuickActionLoading(true);
    setQuickActionStatus(`Running AI ${action}...`);
    try {
      if (action === 'summary') {
        const res = await fetch("http://localhost:8000/api/ai-assistant/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field_type: 'summary',
            target_role: targetRole,
            current_text: resumeData.summary
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions && data.suggestions[0]) {
            setResumeData(prev => ({ ...prev, summary: data.suggestions[0] }));
          }
        }
      } else if (action === 'skills') {
        const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.skills && data.skills.length > 0) {
            setResumeData(prev => ({
              ...prev,
              skills: Array.from(new Set([...prev.skills, ...data.skills.slice(0, 5)]))
            }));
          }
        }
      } else if (action === 'projects') {
        const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length > 0) {
            setResumeData(prev => ({
              ...prev,
              projects: [...prev.projects, ...data.projects.slice(0, 2)]
            }));
          }
        }
      } else if (action === 'certifications') {
        const res = await fetch("http://localhost:8000/api/ai-assistant/recommend-certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.certifications && data.certifications.length > 0) {
            setResumeData(prev => ({
              ...prev,
              certifications: [...prev.certifications, ...data.certifications.slice(0, 2)]
            }));
          }
        }
      } else if (action === 'experience') {
        // Enhance all experience bullet points in place
        const updatedExp = [...resumeData.experience];
        for (let i = 0; i < updatedExp.length; i++) {
          const bullets = [...updatedExp[i].bullets];
          for (let j = 0; j < bullets.length; j++) {
            if (bullets[j] && bullets[j].length > 5) {
              const res = await fetch("http://localhost:8000/api/enhancements/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bullet_point: bullets[j], job_title: targetRole })
              });
              if (res.ok) {
                const data = await res.json();
                bullets[j] = data.enhanced || bullets[j];
              }
            }
          }
          updatedExp[i].bullets = bullets;
        }
        setResumeData(prev => ({ ...prev, experience: updatedExp }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickActionLoading(false);
      setQuickActionStatus('');
    }
  };

  // Handle Input Changes
  const handleContactChange = (field: keyof Contact, value: string) => {
    setResumeData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Experience Actions
  const handleExperienceChange = (index: number, field: keyof Experience, value: any) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', role: '', location: '', start_date: '', end_date: '', bullets: [''] }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addBullet = (expIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[expIndex].bullets = [...updated[expIndex].bullets, ''];
      return { ...prev, experience: updated };
    });
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      const bullets = [...updated[expIndex].bullets];
      bullets[bulletIndex] = value;
      updated[expIndex].bullets = bullets;
      return { ...prev, experience: updated };
    });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    setResumeData(prev => {
      const updated = [...prev.experience];
      updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, experience: updated };
    });
  };

  // Education Actions
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', location: '', graduation_date: '', cgpa: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Projects Actions
  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', description: '', tech_stack: '', link: '' }
      ]
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Skills Actions
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillText.trim() && !resumeData.skills.includes(newSkillText.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkillText.trim()]
      }));
      setNewSkillText('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Certifications Actions
  const addCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertName.trim() && newCertIssuer.trim()) {
      setResumeData(prev => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          { name: newCertName.trim(), issuer: newCertIssuer.trim() }
        ]
      }));
      setNewCertName('');
      setNewCertIssuer('');
    }
  };

  const removeCertification = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // AI Prompt generation Function
  const handleAiGenerate = async () => {
    if (!promptText.trim()) {
      setGenerateError("Please enter your career details to guide the AI.");
      return;
    }
    setGenerateError('');
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/resumes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          target_role: targetRole || null
        })
      });
      if (!res.ok) throw new Error("Server responded with error status.");
      const data = await res.json();
      setResumeData({
        title: data.title || "AI Generated Resume",
        summary: data.summary || "",
        contact: data.contact || initialResumeData.contact,
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        certifications: data.certifications || []
      });
      setActiveTab('contact'); // Move to manual edit tabs
    } catch (e: any) {
      setGenerateError("Could not generate resume. Using local mockup fallback.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Database Save Function
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("http://localhost:8000/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeData.title,
          summary: resumeData.summary,
          raw_text: JSON.stringify(resumeData),
          json_content: resumeData
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  // CSS template configurations
  const templateConfig: Record<string, {
    container: string;
    header: string;
    sectionTitle: string;
    bullet: string;
  }> = {
    'modern-professional': {
      container: 'font-sans text-zinc-700 bg-white p-12 text-left w-full h-full print-sheet',
      header: 'text-center border-b border-zinc-350 pb-6 mb-6',
      sectionTitle: 'text-sm font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1.5 mb-3 mt-4 font-heading',
      bullet: 'list-disc pl-5 space-y-1 text-zinc-650 text-[11px]'
    },
    'corporate-executive': {
      container: 'font-sans text-zinc-850 bg-white p-12 text-left w-full h-full print-sheet',
      header: 'text-left border-l-4 border-[#1e3a8a] pl-5 pb-4 mb-6',
      sectionTitle: 'text-sm font-bold uppercase tracking-wider text-[#1e3a8a] border-b-2 border-[#1e3a8a]/20 pb-1 mb-3 mt-4 font-heading',
      bullet: 'list-square pl-5 space-y-1 text-zinc-650 text-[11px]'
    },
    'minimal-ats': {
      container: 'font-serif text-black bg-white p-10 text-left w-full h-full print-sheet',
      header: 'text-center pb-2 mb-4',
      sectionTitle: 'text-[11px] font-bold uppercase tracking-widest text-black border-none pb-0.5 mb-2 mt-4 font-sans',
      bullet: 'list-disc pl-5 space-y-0.5 text-zinc-800 text-[10.5px]'
    },
    'creative-portfolio': {
      container: 'font-sans text-zinc-700 bg-white p-10 text-left w-full h-full print-sheet relative border-t-8 border-primary',
      header: 'text-left pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200',
      sectionTitle: 'text-xs font-bold uppercase tracking-widest text-primary pb-1 mb-2 mt-4 font-heading',
      bullet: 'list-disc pl-4 space-y-1 text-zinc-650 text-[10.5px]'
    },
    'premium-dark': {
      container: 'font-sans text-zinc-200 bg-[#111114] p-12 text-left w-full h-full print-sheet border border-white/5',
      header: 'text-center border-b border-white/10 pb-6 mb-6',
      sectionTitle: 'text-sm font-bold uppercase tracking-wider text-premium border-b border-white/10 pb-1.5 mb-3 mt-4 font-heading',
      bullet: 'list-disc pl-5 space-y-1 text-zinc-400 text-[11px]'
    }
  };

  const activeTemp = templateConfig[selectedTemplate] || templateConfig['modern-professional'];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden relative">
      
      {/* Editor Panel */}
      <aside className="w-full lg:w-[490px] border-r border-white/5 bg-[#0e0e11] flex flex-col h-1/2 lg:h-full no-print shrink-0 relative">
        {/* Panel Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-zinc-200 text-sm">Resume Editor</h2>
          </div>
          <input 
            type="text" 
            value={resumeData.title}
            onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-primary w-40"
            placeholder="Resume Title"
          />
        </div>

        {/* Unified Score Panel */}
        <div className="p-4 bg-zinc-900/40 border-b border-white/5 flex items-center gap-4 justify-between">
          {/* Completeness score circle */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-white/5" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="24" cy="24" r="20" 
                  className="stroke-primary" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - completenessScore / 100)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {completenessScore}%
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Completeness</span>
              <span className="text-xs text-zinc-300 font-medium">
                {missingFields.length > 0 ? `Missing: ${missingFields[0]}${missingFields.length > 1 ? ` (+${missingFields.length - 1})` : ''}` : 'Profile complete!'}
              </span>
            </div>
          </div>

          {/* Career Readiness Level */}
          <div className="text-right border-l border-white/5 pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Readiness Score</span>
            <span className={`text-xs font-bold ${
              readinessScore >= 91 ? 'text-emerald-400' : readinessScore >= 71 ? 'text-blue-400' : readinessScore >= 41 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {readinessScore}/100 • {readinessLevel}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex overflow-x-auto border-b border-white/5 scrollbar-none shrink-0 bg-zinc-950/20">
          <button
            onClick={() => setActiveTab('ai-prompt')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'ai-prompt' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            AI Parse
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'templates' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'contact' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'experience' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('education-projects')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'education-projects' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Edu & Proj
          </button>
          <button
            onClick={() => setActiveTab('skills-certs')}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'skills-certs' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Skills/Certs
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: AI PARSING & UPLOAD */}
          {activeTab === 'ai-prompt' && (
            <div className="space-y-6">
              
              {/* Feature 1: Drag & Drop upload */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Upload Existing Resume
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-white/10 bg-zinc-900/40'
                  }`}
                >
                  {isUploading ? (
                    <div className="space-y-3">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                      <p className="text-xs text-zinc-300 font-medium">{uploadStatusStep}</p>
                      <div className="w-48 bg-zinc-850 rounded-full h-1.5 mx-auto overflow-hidden">
                        <div className="bg-primary h-full animate-pulse" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                      <p className="text-xs text-zinc-300 font-medium mb-1">Drag & Drop Resume File</p>
                      <p className="text-[10px] text-zinc-500 mb-4">Supported: PDF, DOCX (Max 10MB)</p>
                      
                      <label className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 cursor-pointer hover:bg-zinc-700 transition-colors">
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>

                {/* Developer debug mode toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Developer Debug Mode</span>
                  <button
                    type="button"
                    onClick={() => setDevDebugMode(!devDebugMode)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      devDebugMode 
                        ? 'bg-primary/20 border-primary text-primary font-bold' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {devDebugMode ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Developer debug traces console */}
                {devDebugMode && debugTrace && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-[11px] text-emerald-400 space-y-2 mt-4 max-h-[300px] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                      <span>Developer Debug Traces</span>
                      <button 
                        type="button" 
                        onClick={() => setDebugTrace(null)} 
                        className="text-zinc-500 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <div><span className="text-zinc-500">1. File Upload Status:</span> <span className="text-white">Success</span></div>
                    <div><span className="text-zinc-500">2. File Type:</span> <span className="text-white">{debugTrace.fileType}</span></div>
                    <div><span className="text-zinc-500">3. File Size:</span> <span className="text-white">{debugTrace.fileSize}</span></div>
                    <div><span className="text-zinc-500">4. Text Extraction Engine:</span> <span className="text-white">{debugTrace.textEngine}</span></div>
                    <div><span className="text-zinc-500">5. Extracted Character Count:</span> <span className="text-white">{debugTrace.charCount}</span></div>
                    <div><span className="text-zinc-500">6. OCR Fallback Triggered:</span> <span className={debugTrace.ocrTriggered === 'Yes' ? 'text-amber-400' : 'text-zinc-400'}>{debugTrace.ocrTriggered}</span></div>
                    <div><span className="text-zinc-500">7. OCR Log details:</span> <span className="text-zinc-300">{debugTrace.ocrLog}</span></div>
                    <div><span className="text-zinc-500">8. AI Parsing Status:</span> <span className="text-white">{debugTrace.aiStatus}</span></div>
                    <div><span className="text-zinc-500">9. JSON Validation:</span> <span className="text-white">{debugTrace.jsonValidation}</span></div>
                    <div><span className="text-zinc-500">10. Confidence Score:</span> <span className="text-amber-400 font-bold">{debugTrace.confidenceScore}%</span></div>
                    <div className="pt-2 border-t border-white/5 mt-2">
                      <span className="text-zinc-500 block mb-1">Raw AI Response:</span>
                      <pre className="text-zinc-400 bg-black/40 p-2 rounded max-h-[120px] overflow-auto text-[10px] whitespace-pre-wrap">{debugTrace.rawResponse}</pre>
                    </div>
                  </div>
                )}
                
                {uploadError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Text generation prompt */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>Or enter target job title and background to write from scratch.</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Target Job Title</label>
                  <input 
                    type="text"
                    placeholder="e.g. Senior React Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Describe yourself & achievements</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. I have 4 years experience in frontend dev. I led a team of 3 at Tech Solutions and optimized dashboard load times by 25%."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                </div>
                {generateError && (
                  <p className="text-xs text-rose-500">{generateError}</p>
                )}
                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Base Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE GALLERY */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" /> Template Gallery
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Select a visual theme template. Swapping styles preserves your resume details instantly.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'modern-professional', name: 'Modern Professional', desc: 'Centered header, standard lines' },
                  { id: 'corporate-executive', name: 'Corporate Executive', desc: 'Left-aligned, dark side border' },
                  { id: 'minimal-ats', name: 'Minimal ATS', desc: 'Pure black-and-white, optimal layout' },
                  { id: 'creative-portfolio', name: 'Creative Portfolio', desc: 'Double column with sidebar accent' },
                  { id: 'premium-dark', name: 'Premium Dark', desc: 'SaaS dark preview, gold titles' }
                ].map((temp) => (
                  <button
                    key={temp.id}
                    onClick={() => setSelectedTemplate(temp.id)}
                    className={`rounded-xl border p-4 flex flex-col justify-between text-left h-36 transition-all ${
                      selectedTemplate === temp.id
                        ? 'border-primary bg-primary/5'
                        : 'border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs text-white block">{temp.name}</span>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-snug">{temp.desc}</p>
                    </div>

                    {/* Miniature thumbnail preview representation */}
                    <div className="w-full h-8 bg-zinc-950/40 rounded flex flex-col justify-center p-1.5 gap-1 select-none">
                      <div className="flex gap-1 items-center justify-between">
                        <div className="h-1.5 w-6 bg-zinc-400 rounded-full" />
                        <div className="h-1 w-3 bg-zinc-650 rounded-full" />
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full" />
                      <div className="h-1 w-4/5 bg-zinc-800 rounded-full" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT INFORMATION */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 border-b border-white/5 pb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal & Contact Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.contact.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={resumeData.contact.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={resumeData.contact.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">LinkedIn</label>
                  <input 
                    type="text" 
                    value={resumeData.contact.linkedin}
                    onChange={(e) => handleContactChange('linkedin', e.target.value)}
                    onFocus={() => { setFocusedField('summary'); }} // Suggestion context trigger
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">GitHub</label>
                  <input 
                    type="text" 
                    value={resumeData.contact.github}
                    onChange={(e) => handleContactChange('github', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Portfolio Site</label>
                  <input 
                    type="text" 
                    value={resumeData.contact.website}
                    onChange={(e) => handleContactChange('website', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Address Location</label>
                <input 
                  type="text" 
                  value={resumeData.contact.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Professional Summary</label>
                  <button
                    type="button"
                    onClick={() => { setFocusedField('summary'); handleGetSuggestions('summary', resumeData.summary); }}
                    className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="h-3 w-3" /> Suggest with AI
                  </button>
                </div>
                <textarea 
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  onFocus={() => { setFocusedField('summary'); }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 resize-none font-sans"
                />
              </div>

              {/* Context suggestions card for summary */}
              {focusedField === 'summary' && aiSuggestions.length > 0 && (
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">AI Summary Suggestions</span>
                  <div className="space-y-2">
                    {aiSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setResumeData(prev => ({ ...prev, summary: sug })); setAiSuggestions([]); }}
                        className="w-full text-left bg-white/2 hover:bg-white/5 p-2 rounded text-[11px] text-zinc-350 leading-relaxed border border-white/5 hover:border-white/10 block"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" /> Work History
                </h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all"
                >
                  <Plus className="h-3 w-3" /> Add Job
                </button>
              </div>

              {resumeData.experience.map((exp, expIdx) => (
                <div key={expIdx} className="border border-white/5 bg-white/5 rounded-xl p-4 space-y-3 relative group">
                  <button
                    onClick={() => removeExperience(expIdx)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove Experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Company</label>
                      <input 
                        type="text" 
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(expIdx, 'company', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Job Title</label>
                      <input 
                        type="text" 
                        value={exp.role}
                        onChange={(e) => handleExperienceChange(expIdx, 'role', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Location</label>
                      <input 
                        type="text" 
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(expIdx, 'location', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Start Date</label>
                      <input 
                        type="text" 
                        placeholder="Jan 2022"
                        value={exp.start_date}
                        onChange={(e) => handleExperienceChange(expIdx, 'start_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">End Date</label>
                      <input 
                        type="text" 
                        placeholder="Present"
                        value={exp.end_date}
                        onChange={(e) => handleExperienceChange(expIdx, 'end_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bullet points list */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">STAR Accomplishments</span>
                      <button
                        onClick={() => addBullet(expIdx)}
                        className="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="h-3 w-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="space-y-1.5">
                        <div className="flex gap-2 items-center">
                          <input 
                            type="text"
                            value={bullet}
                            onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                            onFocus={() => { setFocusedField('experience'); setFocusedExpIdx(expIdx); setFocusedBulletIdx(bIdx); }}
                            className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-primary/50"
                            placeholder="e.g. Managed bookkeeping records"
                          />
                          
                          {/* Feature 4: Enhance with AI bullet optimizer */}
                          <button
                            type="button"
                            onClick={() => handleEnhanceBullet(expIdx, bIdx)}
                            className="p-1.5 hover:bg-primary/10 rounded text-zinc-500 hover:text-primary transition-all"
                            title="Enhance achievement with AI"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => removeBullet(expIdx, bIdx)}
                            className="text-zinc-500 hover:text-rose-500 transition-colors"
                            aria-label="Remove Bullet"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Focus suggestion cards for experience */}
                  {focusedField === 'experience' && focusedExpIdx === expIdx && (
                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-3.5 space-y-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">AI Accomplishment Suggestions</span>
                        <button
                          type="button"
                          onClick={() => handleGetSuggestions('experience', '')}
                          className="text-[9px] text-zinc-400 hover:text-white"
                        >
                          Generate Options
                        </button>
                      </div>
                      
                      {isLoadingSuggestions ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto my-2" />
                      ) : aiSuggestions.length > 0 ? (
                        <div className="space-y-2">
                          {aiSuggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                if (focusedBulletIdx !== null) {
                                  updateBullet(expIdx, focusedBulletIdx, sug);
                                }
                                setAiSuggestions([]);
                              }}
                              className="w-full text-left bg-white/2 hover:bg-white/5 p-2 rounded text-[11px] text-zinc-350 leading-relaxed border border-white/5 block"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-500 block">Click Generate to fetch custom role suggestions.</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EDUCATION & PROJECTS */}
          {activeTab === 'education-projects' && (
            <div className="space-y-6">
              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" /> Education History
                  </h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all"
                  >
                    <Plus className="h-3 w-3" /> Add Education
                  </button>
                </div>

                {resumeData.education.map((edu, eduIdx) => (
                  <div key={eduIdx} className="border border-white/5 bg-white/5 rounded-xl p-4 space-y-3 relative group">
                    <button
                      onClick={() => removeEducation(eduIdx)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove Education"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">School</label>
                        <input 
                          type="text" 
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(eduIdx, 'institution', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Degree</label>
                        <input 
                          type="text" 
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(eduIdx, 'degree', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Location</label>
                        <input 
                          type="text" 
                          value={edu.location}
                          onChange={(e) => handleEducationChange(eduIdx, 'location', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Graduation Date</label>
                        <input 
                          type="text" 
                          value={edu.graduation_date}
                          onChange={(e) => handleEducationChange(eduIdx, 'graduation_date', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">CGPA / GPA</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 3.8/4.0"
                          value={edu.cgpa || ''}
                          onChange={(e) => handleEducationChange(eduIdx, 'cgpa', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-primary" /> Key Projects
                  </h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary/20 transition-all"
                  >
                    <Plus className="h-3 w-3" /> Add Project
                  </button>
                </div>

                {/* Auto Project Recommendations */}
                {recommendedProjects.length > 0 && (
                  <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">💡 Auto Project Recommendations</span>
                    <div className="flex flex-col gap-2">
                      {recommendedProjects.map((proj, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/2 p-2 rounded border border-white/5 text-left">
                          <div>
                            <span className="text-[11px] font-semibold text-white block">{proj.name}</span>
                            <span className="text-[9px] text-zinc-400 block truncate max-w-[280px]">{proj.description}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResumeData(prev => ({
                              ...prev,
                              projects: [...prev.projects, { name: proj.name, description: proj.description, tech_stack: proj.tech_stack, link: '' }]
                            }))}
                            className="text-[10px] font-bold text-primary hover:underline px-2 py-1 shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.projects.map((proj, projIdx) => (
                  <div key={projIdx} className="border border-white/5 bg-white/5 rounded-xl p-4 space-y-3 relative group">
                    <button
                      onClick={() => removeProject(projIdx)}
                      className="absolute top-4 right-4 text-zinc-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Project Name</label>
                        <input 
                          type="text" 
                          value={proj.name}
                          onChange={(e) => handleProjectChange(projIdx, 'name', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Project Link</label>
                        <input 
                          type="text" 
                          value={proj.link}
                          onChange={(e) => handleProjectChange(projIdx, 'link', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Tech Stack (comma separated)</label>
                      <input 
                        type="text" 
                        value={proj.tech_stack}
                        onChange={(e) => handleProjectChange(projIdx, 'tech_stack', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        placeholder="e.g. React, Node.js, SQLite"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Description</label>
                      <textarea 
                        rows={2}
                        value={proj.description}
                        onChange={(e) => handleProjectChange(projIdx, 'description', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS & CERTIFICATIONS */}
          {activeTab === 'skills-certs' && (
            <div className="space-y-6">
              
              {/* Skills Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-300 border-b border-white/5 pb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" /> Key Skills & Expertise
                </h3>

                <form onSubmit={addSkill} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="e.g. Python, Docker"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                  >
                    Add
                  </button>
                </form>

                {/* Auto Skill Recommendations */}
                {recommendedSkills.length > 0 && (
                  <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">💡 Auto Skill Recommendations (One-Click Add)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendedSkills.map((skill, index) => {
                        const exists = resumeData.skills.includes(skill);
                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={exists}
                            onClick={() => setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill] }))}
                            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                              exists 
                                ? 'bg-zinc-800/20 border-zinc-800 text-zinc-650 cursor-not-allowed' 
                                : 'bg-primary/5 border-primary/20 text-primary-light hover:bg-primary/10 hover:border-primary/30'
                            }`}
                          >
                            + {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {resumeData.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300 font-medium hover:border-rose-500/30 hover:text-white transition-colors cursor-pointer group"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill}
                      <Trash2 className="h-3 w-3 text-zinc-500 group-hover:text-rose-500 transition-colors" />
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications Section */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" /> Certifications
                  </h3>
                </div>

                <form onSubmit={addCertification} className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Cert Name</label>
                      <input 
                        type="text"
                        placeholder="AWS Solutions Architect"
                        value={newCertName}
                        onChange={(e) => setNewCertName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Issuer</label>
                      <input 
                        type="text"
                        placeholder="Amazon Web Services"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary/10 border border-primary/20 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
                  >
                    Add Certification
                  </button>
                </form>

                {/* Auto Suggested Certifications */}
                {recommendedCertifications.length > 0 && (
                  <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">💡 Suggested Certifications</span>
                    <div className="flex flex-col gap-2">
                      {recommendedCertifications.map((cert, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/2 p-2 rounded border border-white/5 text-left">
                          <div>
                            <span className="text-[11px] font-semibold text-white block">{cert.name}</span>
                            <span className="text-[9px] text-zinc-400 block">{cert.issuer}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResumeData(prev => ({
                              ...prev,
                              certifications: [...prev.certifications, { name: cert.name, issuer: cert.issuer }]
                            }))}
                            className="text-[10px] font-bold text-primary hover:underline px-2 py-1 shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {resumeData.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3">
                      <div>
                        <span className="text-xs font-bold text-white block">{cert.name}</span>
                        <span className="text-[10px] text-zinc-400 block">{cert.issuer}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-zinc-500 hover:text-rose-500 p-1.5 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </aside>

      {/* Main Preview Panel */}
      <main className="flex-1 bg-[#16161a] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start relative">
        {/* Floating Toolbar */}
        <div className="w-full max-w-[800px] mb-6 flex justify-between items-center no-print">
          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-success" /> Auto-saved locally
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold transition-all hover:bg-white/10 active:scale-95 ${
                saveSuccess ? 'border-success text-success' : 'text-zinc-300'
              }`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4" />
                  Save Cloud
                </>
              )}
            </button>
            <button
              onClick={triggerPrint}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all active:scale-95"
            >
              <Printer className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview container styled dynamically based on selectedTemplate */}
        <div className={`${activeTemp.container} select-text`}>
          {selectedTemplate === 'creative-portfolio' ? (
            /* Creative Portfolio Split Layout */
            <div className="flex h-full gap-8">
              {/* Sidebar column */}
              <div className="w-[30%] border-r border-zinc-200 pr-6 space-y-6 flex flex-col justify-start">
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight leading-none font-heading">{resumeData.contact.name || "YOUR NAME"}</h1>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block font-heading">{targetRole}</span>
                </div>
                
                <div className="space-y-3.5 pt-4 border-t border-zinc-100 text-[10px] text-zinc-650 font-medium">
                  {resumeData.contact.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0 text-zinc-400" /> <span className="truncate">{resumeData.contact.email}</span></div>}
                  {resumeData.contact.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0 text-zinc-400" /> <span>{resumeData.contact.phone}</span></div>}
                  {resumeData.contact.address && <div className="flex items-center gap-2"><Globe className="h-3 w-3 shrink-0 text-zinc-400" /> <span>{resumeData.contact.address}</span></div>}
                  {resumeData.contact.linkedin && <div className="flex items-center gap-2"><Linkedin className="h-3 w-3 shrink-0 text-zinc-400" /> <span className="truncate">{resumeData.contact.linkedin}</span></div>}
                  {resumeData.contact.github && <div className="flex items-center gap-2"><Github className="h-3 w-3 shrink-0 text-zinc-400" /> <span className="truncate">{resumeData.contact.github}</span></div>}
                </div>

                {resumeData.skills.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-zinc-100">
                    <h3 className={activeTemp.sectionTitle}>Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.map((s, idx) => (
                        <span key={idx} className="bg-zinc-100 text-zinc-800 text-[9px] px-2 py-0.5 rounded font-medium border border-zinc-200">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.certifications?.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-zinc-100">
                    <h3 className={activeTemp.sectionTitle}>Certifications</h3>
                    <div className="space-y-2">
                      {resumeData.certifications.map((c, idx) => (
                        <div key={idx} className="text-[10px]">
                          <span className="font-semibold text-zinc-900 block leading-tight">{c.name}</span>
                          <span className="text-zinc-500 text-[9px] block leading-none mt-0.5">{c.issuer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main content column */}
              <div className="w-[70%] space-y-5 flex flex-col justify-start">
                {resumeData.summary && (
                  <div className="space-y-1">
                    <h3 className={activeTemp.sectionTitle}>Profile</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div className="space-y-4">
                    <h3 className={activeTemp.sectionTitle}>Experience</h3>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-start text-xs font-semibold text-zinc-900">
                            <span className="font-bold">{exp.company}</span>
                            <span className="text-zinc-500 text-[10px]">{exp.start_date} – {exp.end_date}</span>
                          </div>
                          <div className="flex justify-between items-start text-[11px] text-zinc-600 italic">
                            <span>{exp.role}</span>
                            <span>{exp.location}</span>
                          </div>
                          <ul className={activeTemp.bullet}>
                            {exp.bullets.map((b, bIdx) => b && <li key={bIdx}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.projects.length > 0 && (
                  <div className="space-y-3">
                    <h3 className={activeTemp.sectionTitle}>Projects</h3>
                    <div className="space-y-3">
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="space-y-0.5 text-xs text-zinc-700">
                          <div className="flex justify-between font-medium text-zinc-900">
                            <span className="font-bold">{proj.name}</span>
                            {proj.link && <span className="text-zinc-500 text-[10px]">{proj.link}</span>}
                          </div>
                          <p className="text-zinc-650 text-[11px]">{proj.description}</p>
                          {proj.tech_stack && <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">Tech: {proj.tech_stack}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="space-y-2">
                    <h3 className={activeTemp.sectionTitle}>Education</h3>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs text-zinc-700">
                        <div>
                          <span className="font-bold text-zinc-900">{edu.institution}</span> — <span className="italic">{edu.degree}</span>
                        </div>
                        <div className="text-right text-zinc-500 text-[10px]">
                          <span>{edu.graduation_date}</span>
                          {edu.cgpa && <span className="block text-[9px] font-medium text-zinc-400 mt-0.5">GPA: {edu.cgpa}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Standard Full-width Templates */
            <>
              {/* Template Header */}
              <div className={activeTemp.header}>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-none font-heading">
                  {resumeData.contact.name || "YOUR NAME"}
                </h1>
                {selectedTemplate !== 'minimal-ats' && <span className="text-xs font-semibold text-primary uppercase tracking-widest block mt-1">{targetRole}</span>}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-500 mt-2 font-medium">
                  {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
                  {resumeData.contact.phone && <span>• {resumeData.contact.phone}</span>}
                  {resumeData.contact.address && <span>• {resumeData.contact.address}</span>}
                  {resumeData.contact.linkedin && <span>• {resumeData.contact.linkedin}</span>}
                  {resumeData.contact.github && <span>• {resumeData.contact.github}</span>}
                  {resumeData.contact.website && <span>• {resumeData.contact.website}</span>}
                </div>
              </div>

              {/* Template Body */}
              <div className="space-y-5 text-zinc-700 text-xs sm:text-sm leading-relaxed">
                {resumeData.summary && (
                  <section className="space-y-1">
                    <h2 className={activeTemp.sectionTitle}>Professional Summary</h2>
                    <p className="text-zinc-650 text-xs">{resumeData.summary}</p>
                  </section>
                )}

                {resumeData.experience.length > 0 && (
                  <section className="space-y-3">
                    <h2 className={activeTemp.sectionTitle}>Professional Experience</h2>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-start font-semibold text-zinc-900 text-xs">
                            <span className="font-bold">{exp.company || "Company"}</span>
                            <span className="text-zinc-500 text-[10px]">{exp.start_date || "Start"} – {exp.end_date || "End"}</span>
                          </div>
                          <div className="flex justify-between items-start text-xs font-medium text-zinc-600 italic">
                            <span>{exp.role || "Role"}</span>
                            <span>{exp.location || "Location"}</span>
                          </div>
                          <ul className={activeTemp.bullet}>
                            {exp.bullets.map((b, bIdx) => b && <li key={bIdx}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {resumeData.education.length > 0 && (
                  <section className="space-y-2">
                    <h2 className={activeTemp.sectionTitle}>Education</h2>
                    <div className="space-y-2.5">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs text-zinc-700">
                          <div>
                            <span className="font-bold text-zinc-900">{edu.institution || "School"}</span> — <span className="italic">{edu.degree || "Degree"}</span>
                          </div>
                          <div className="text-right text-zinc-500 text-[10px]">
                            <span>{edu.graduation_date || "Date"}</span>
                            {edu.cgpa && <span className="block text-[9px] font-medium text-zinc-400 mt-0.5">GPA: {edu.cgpa}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {resumeData.projects.length > 0 && (
                  <section className="space-y-3">
                    <h2 className={activeTemp.sectionTitle}>Key Projects</h2>
                    <div className="space-y-2.5">
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="space-y-0.5 text-xs text-zinc-700">
                          <div className="flex justify-between font-medium text-zinc-900">
                            <span className="font-bold">{proj.name || "Project Name"}</span>
                            {proj.link && <span className="text-zinc-500 text-[10px]">{proj.link}</span>}
                          </div>
                          <p className="text-zinc-650 text-[11px]">{proj.description}</p>
                          {proj.tech_stack && <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">Tech Stack: {proj.tech_stack}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {resumeData.skills.length > 0 && (
                  <section className="space-y-1">
                    <h2 className={activeTemp.sectionTitle}>Skills</h2>
                    <p className="text-zinc-650 text-xs">
                      {resumeData.skills.join(", ")}
                    </p>
                  </section>
                )}

                {resumeData.certifications?.length > 0 && (
                  <section className="space-y-2">
                    <h2 className={activeTemp.sectionTitle}>Certifications</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {resumeData.certifications.map((c, idx) => (
                        <div key={idx} className="text-xs text-zinc-700">
                          <span className="font-bold text-zinc-900 block">{c.name}</span>
                          <span className="text-[10px] text-zinc-500 block">Issuer: {c.issuer}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </div>

        {/* Feature 8: Floating AI Quick Actions Panel */}
        <div className="fixed bottom-6 right-6 z-40 no-print">
          <div className="relative">
            {/* Action panel popover */}
            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-16 right-0 w-72 glass-card rounded-2xl p-4 border-glow-primary/20 space-y-4 shadow-2xl"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Quick Actions Panel</span>
                  </div>

                  {quickActionLoading ? (
                    <div className="py-6 text-center space-y-3">
                      <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto" />
                      <span className="text-[11px] text-zinc-400 block">{quickActionStatus}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {[
                        { id: 'summary', name: 'Improve Summary' },
                        { id: 'skills', name: 'Improve Skills' },
                        { id: 'experience', name: 'Improve Experience (STAR)' },
                        { id: 'projects', name: 'Generate 2 Projects' },
                        { id: 'certifications', name: 'Suggest Certifications' }
                      ].map(action => (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => triggerQuickAction(action.id)}
                          className="w-full text-left bg-white/5 hover:bg-primary/10 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 border border-white/5 hover:border-primary/25 transition-all flex justify-between items-center group"
                        >
                          <span>{action.name}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                      
                      <Link
                        to="/portfolio-builder"
                        className="w-full text-left bg-white/5 hover:bg-primary/10 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 border border-white/5 hover:border-primary/25 transition-all flex justify-between items-center group"
                      >
                        <span>Generate Portfolio Website</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                      </Link>
                      
                      <Link
                        to="/ats-analyzer"
                        className="w-full text-left bg-white/5 hover:bg-primary/10 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 border border-white/5 hover:border-primary/25 transition-all flex justify-between items-center group"
                      >
                        <span>Optimize For ATS Score</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Assistant Trigger Button */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-primary-glow hover:scale-105 active:scale-95 transition-all pulse-glow-button"
              aria-label="AI Actions Panel"
            >
              <Bot className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Extraction Preview Modal */}
        {showPreviewModal && extractedPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-zinc-950/40">
                <div>
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Resume Extraction Preview
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Review, edit, and confirm the extracted information before importing it to the Resume Builder.</p>
                </div>
                
                {/* Confidence Score Gauge */}
                {extractionConfidence !== null && (
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5">
                    <span className="text-xs text-zinc-400">Confidence Quality:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      extractionConfidence >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                      extractionConfidence >= 50 ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {extractionConfidence}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Step-by-step alert messages */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Resume processed successfully. All fields have been populated.</span>
                </div>

                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5 flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Contact & Summary Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Full Name</label>
                      <input
                        type="text"
                        value={extractedPreview.contact.name}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, name: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        value={extractedPreview.contact.email}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, email: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone</label>
                      <input
                        type="text"
                        value={extractedPreview.contact.phone}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, phone: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Location</label>
                      <input
                        type="text"
                        value={extractedPreview.contact.address}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, address: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={extractedPreview.contact.linkedin}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, linkedin: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">GitHub</label>
                      <input
                        type="text"
                        value={extractedPreview.contact.github}
                        onChange={(e) => setExtractedPreview({
                          ...extractedPreview,
                          contact: { ...extractedPreview.contact, github: e.target.value }
                        })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Professional Summary</label>
                    <textarea
                      rows={3}
                      value={extractedPreview.summary}
                      onChange={(e) => setExtractedPreview({ ...extractedPreview, summary: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 resize-none font-sans"
                    />
                  </div>
                </div>

                {/* Section 2: Skills */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5 flex items-center gap-1.5">
                    <Wrench className="h-4 w-4" />
                    Skills (Comma Separated)
                  </h4>
                  <input
                    type="text"
                    value={extractedPreview.skills.join(', ')}
                    onChange={(e) => setExtractedPreview({
                      ...extractedPreview,
                      skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                  />
                </div>

                {/* Section 3: Experience */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    Professional Experience
                  </h4>
                  {extractedPreview.experience.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No experience entries found.</p>
                  ) : (
                    <div className="space-y-4">
                      {extractedPreview.experience.map((exp, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...extractedPreview.experience];
                                updated[idx].company = e.target.value;
                                setExtractedPreview({ ...extractedPreview, experience: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...extractedPreview.experience];
                                updated[idx].role = e.target.value;
                                setExtractedPreview({ ...extractedPreview, experience: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Duration (Start - End)</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Start"
                                value={exp.start_date}
                                onChange={(e) => {
                                  const updated = [...extractedPreview.experience];
                                  updated[idx].start_date = e.target.value;
                                  setExtractedPreview({ ...extractedPreview, experience: updated });
                                }}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                              <input
                                type="text"
                                placeholder="End"
                                value={exp.end_date}
                                onChange={(e) => {
                                  const updated = [...extractedPreview.experience];
                                  updated[idx].end_date = e.target.value;
                                  setExtractedPreview({ ...extractedPreview, experience: updated });
                                }}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => {
                                const updated = [...extractedPreview.experience];
                                updated[idx].location = e.target.value;
                                setExtractedPreview({ ...extractedPreview, experience: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Accomplishments / Bullets</label>
                            <textarea
                              rows={3}
                              value={exp.bullets.join('\n')}
                              onChange={(e) => {
                                const updated = [...extractedPreview.experience];
                                updated[idx].bullets = e.target.value.split('\n').filter(Boolean);
                                setExtractedPreview({ ...extractedPreview, experience: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none resize-none font-sans"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 4: Education */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-primary/10 pb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    Education History
                  </h4>
                  {extractedPreview.education.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No education entries found.</p>
                  ) : (
                    <div className="space-y-4">
                      {extractedPreview.education.map((edu, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...extractedPreview.education];
                                updated[idx].institution = e.target.value;
                                setExtractedPreview({ ...extractedPreview, education: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...extractedPreview.education];
                                updated[idx].degree = e.target.value;
                                setExtractedPreview({ ...extractedPreview, education: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Graduation Date</label>
                            <input
                              type="text"
                              value={edu.graduation_date}
                              onChange={(e) => {
                                const updated = [...extractedPreview.education];
                                updated[idx].graduation_date = e.target.value;
                                setExtractedPreview({ ...extractedPreview, education: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-0.5">CGPA</label>
                            <input
                              type="text"
                              value={edu.cgpa || ''}
                              onChange={(e) => {
                                const updated = [...extractedPreview.education];
                                updated[idx].cgpa = e.target.value;
                                setExtractedPreview({ ...extractedPreview, education: updated });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5 bg-zinc-950/40">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Discard Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Commit to builder
                    setResumeData(extractedPreview);
                    if (extractedPreview.title) {
                      setTargetRole(extractedPreview.title.replace(" Resume", ""));
                    }
                    setShowPreviewModal(false);
                    setActiveTab('contact');
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                  }}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Apply to Resume Builder
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
