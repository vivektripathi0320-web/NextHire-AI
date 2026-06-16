from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

# --- RESUME SCHEMAS ---
class ResumeBase(BaseModel):
    title: str
    summary: Optional[str] = None
    raw_text: Optional[str] = None
    json_content: Dict[str, Any]

class ResumeCreate(ResumeBase):
    pass

class ResumeResponse(ResumeBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# --- ATS SCAN SCHEMAS ---
class AtsScanBase(BaseModel):
    resume_id: int
    job_title: Optional[str] = None
    job_description: Optional[str] = None

class AtsScanCreate(AtsScanBase):
    pass

class AtsScanResponse(AtsScanBase):
    id: int
    score: int
    analysis_report: Dict[str, Any]
    created_at: datetime

    class Config:
        orm_mode = True


# --- PORTFOLIO SCHEMAS ---
class PortfolioBase(BaseModel):
    resume_id: int
    title: str
    theme: str = "dark"
    customizations: Optional[Dict[str, Any]] = None

class PortfolioCreate(PortfolioBase):
    slug: str

class PortfolioResponse(PortfolioBase):
    id: int
    slug: str
    created_at: datetime
    resume: Optional[ResumeResponse] = None

    class Config:
        orm_mode = True


# --- MATCH JD SCHEMAS (Request/Response) ---
class JdMatchRequest(BaseModel):
    resume_text: str
    job_description: str

class JdMatchResponse(BaseModel):
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]


# --- ENHANCER SCHEMAS ---
class EnhancementRequest(BaseModel):
    bullet_point: str
    job_title: Optional[str] = None
    industry: Optional[str] = None

class EnhancementResponse(BaseModel):
    original: str
    enhanced: str
    changes_made: str


# --- RESUME GENERATOR SCHEMAS ---
class ResumeGenerateRequest(BaseModel):
    prompt: str
    target_role: Optional[str] = None


# --- AI ASSISTANT SCHEMAS ---
class AssistantSuggestRequest(BaseModel):
    field_type: str  # 'summary' | 'achievements' | 'skills' | 'projects'
    target_role: str
    current_text: Optional[str] = None

class AssistantSuggestResponse(BaseModel):
    suggestions: List[str]

class RoleRecommendRequest(BaseModel):
    target_role: str

class SkillsRecommendResponse(BaseModel):
    skills: List[str]

class ProjectsRecommendResponse(BaseModel):
    projects: List[Dict[str, Any]]

class CertificationsRecommendResponse(BaseModel):
    certifications: List[Dict[str, Any]]

