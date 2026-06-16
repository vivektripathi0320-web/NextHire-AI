import { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Wrench, 
  Plus, 
  Trash2, 
  Printer, 
  Cloud, 
  CheckCircle,
  Loader2
} from 'lucide-react';

interface Contact {
  name: string;
  email: string;
  phone: string;
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
}

interface Project {
  name: string;
  description: string;
  tech_stack: string;
  link: string;
}

interface ResumeData {
  title: string;
  summary: string;
  contact: Contact;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

const initialResumeData: ResumeData = {
  title: "Frontend Engineer Resume",
  summary: "Dynamic Software Engineer with a passion for building responsive, pixel-perfect user interfaces. Skilled in modern React development, state management, and performance tuning.",
  contact: {
    name: "Alex Mercer",
    email: "alexmercer@email.com",
    phone: "+1 (555) 019-2834",
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
      graduation_date: "May 2021"
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
  ]
};

export default function ResumeGenerator() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTab, setActiveTab] = useState<'ai-prompt' | 'contact' | 'experience' | 'education-projects' | 'skills'>('ai-prompt');
  
  // AI Prompt generation states
  const [promptText, setPromptText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  
  // Saving states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Dynamic list index states for bullet points
  const [newSkillText, setNewSkillText] = useState('');

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
        { institution: '', degree: '', location: '', graduation_date: '' }
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

  // AI Generation Function
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
        projects: data.projects || []
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

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Editor Panel */}
      <aside className="w-full lg:w-[480px] border-r border-white/5 bg-[#0e0e11] flex flex-col h-1/2 lg:h-full no-print">
        {/* Panel Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-zinc-200">Resume Workspace</h2>
          </div>
          <input 
            type="text" 
            value={resumeData.title}
            onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
            className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-primary w-40"
            placeholder="Resume Title"
          />
        </div>

        {/* Tab Selector */}
        <div className="flex overflow-x-auto border-b border-white/5 scrollbar-none">
          <button
            onClick={() => setActiveTab('ai-prompt')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'ai-prompt' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            AI Generator
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'contact' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'experience' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('education-projects')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'education-projects' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Edu & Proj
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap px-4 transition-colors ${
              activeTab === 'skills' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Skills
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: AI PROMPT GENERATOR */}
          {activeTab === 'ai-prompt' && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  Describe your professional background, experience, key achievements, and the AI will automatically write an ATS-optimized resume.
                </span>
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
                  rows={6}
                  placeholder="e.g. I have 4 years experience in frontend dev. I led a team of 3 at Tech Solutions and optimized dashboard load times by 25%. I know React, TypeScript, and Tailwind."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
              {generateError && (
                <p className="text-xs text-rose-500">{generateError}</p>
              )}
              <button
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-primary-glow hover:bg-primary/80 transition-all active:scale-[0.99] disabled:opacity-50"
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
          )}

          {/* TAB 2: CONTACT INFORMATION */}
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Professional Summary</label>
                <textarea 
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: WORK EXPERIENCE */}
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
                        placeholder="e.g. Jan 2022"
                        value={exp.start_date}
                        onChange={(e) => handleExperienceChange(expIdx, 'start_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">End Date</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Present"
                        value={exp.end_date}
                        onChange={(e) => handleExperienceChange(expIdx, 'end_date', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bullet points list */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Accomplishments (STAR)</span>
                      <button
                        onClick={() => addBullet(expIdx)}
                        className="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="h-3 w-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-2 items-center">
                        <input 
                          type="text"
                          value={bullet}
                          onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-primary/50"
                          placeholder="Quantify metric: optimized page speed by 40%..."
                        />
                        <button
                          onClick={() => removeBullet(expIdx, bIdx)}
                          className="text-zinc-500 hover:text-rose-500 transition-colors"
                          aria-label="Remove Bullet"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EDUCATION & PROJECTS */}
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
                    <div className="grid grid-cols-2 gap-3">
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

          {/* TAB 5: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 border-b border-white/5 pb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" /> Key Skills & Expertise
              </h3>

              <form onSubmit={addSkill} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Python, Docker, UI Design"
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
                {resumeData.skills.length === 0 && (
                  <span className="text-xs text-zinc-500">No skills added yet.</span>
                )}
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

        {/* Paper Sheet Preview */}
        <div className="w-full max-w-[800px] bg-white text-zinc-800 p-12 shadow-2xl rounded-none border border-zinc-200 aspect-[1/1.41] flex flex-col justify-start print-sheet text-left font-sans select-text select-all">
          {/* Header */}
          <div className="text-center border-b border-zinc-300 pb-5 mb-5">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">
              {resumeData.contact.name || "YOUR NAME"}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-zinc-600 mt-2.5 font-medium">
              {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
              {resumeData.contact.phone && <span>• {resumeData.contact.phone}</span>}
              {resumeData.contact.linkedin && <span>• {resumeData.contact.linkedin}</span>}
              {resumeData.contact.github && <span>• {resumeData.contact.github}</span>}
              {resumeData.contact.website && <span>• {resumeData.contact.website}</span>}
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-5 text-zinc-700 text-xs sm:text-sm leading-relaxed">
            
            {/* Summary */}
            {resumeData.summary && (
              <section className="space-y-1.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading border-b border-zinc-200 pb-1">
                  Professional Summary
                </h2>
                <p className="text-zinc-600 font-sans text-xs">
                  {resumeData.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading border-b border-zinc-200 pb-1">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start font-medium text-zinc-900">
                        <span className="font-bold">{exp.company || "Company"}</span>
                        <span className="text-xs text-zinc-500">{exp.start_date || "Start"} – {exp.end_date || "End"}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs font-medium text-zinc-700 italic">
                        <span>{exp.role || "Role"}</span>
                        <span>{exp.location || "Location"}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-[11px] pt-1">
                        {exp.bullets.map((b, bIdx) => b && (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading border-b border-zinc-200 pb-1">
                  Education
                </h2>
                <div className="space-y-2">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs text-zinc-700">
                      <div>
                        <span className="font-bold text-zinc-900">{edu.institution || "School"}</span> — <span className="italic">{edu.degree || "Degree"}</span>
                      </div>
                      <span className="text-zinc-500">{edu.graduation_date || "Date"}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading border-b border-zinc-200 pb-1">
                  Key Projects
                </h2>
                <div className="space-y-2.5">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5 text-xs text-zinc-700">
                      <div className="flex justify-between font-medium text-zinc-900">
                        <span className="font-bold">{proj.name || "Project Name"}</span>
                        {proj.link && <span className="text-zinc-500">{proj.link}</span>}
                      </div>
                      <p className="text-zinc-600 text-[11px]">{proj.description}</p>
                      {proj.tech_stack && (
                        <p className="text-[10px] text-zinc-500 font-medium">Tech Stack: {proj.tech_stack}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-heading border-b border-zinc-200 pb-1">
                  Skills & Technical Expertise
                </h2>
                <p className="text-zinc-600 text-xs">
                  <span className="font-semibold text-zinc-800">Expertise: </span>
                  {resumeData.skills.join(", ")}
                </p>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
