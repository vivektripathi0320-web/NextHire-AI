import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)
    # JSON-structured details: education, experience, skills, projects, contact
    json_content = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    scans = relationship("AtsScan", back_populates="resume", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="resume", cascade="all, delete-orphan")


class AtsScan(Base):
    __tablename__ = "ats_scans"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=True)
    score = Column(Integer, nullable=False)
    # Detailed analysis output: keyword_gaps, format_issues, suggestions
    analysis_report = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="scans")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    theme = Column(String(50), default="dark")
    # Portfolio custom layout and content overrides
    customizations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="portfolios")
