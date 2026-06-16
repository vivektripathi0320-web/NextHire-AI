# NextHire AI

> **Smart Resumes. Stunning Portfolios. Better Careers.**

NextHire AI is a modern, premium dark-themed AI-powered SaaS web application designed to help job seekers accelerate their career path. The application uses state-of-the-art AI technology to generate ATS-friendly resumes, analyze resume compatibility, enhance resumes, build professional portfolios, and compare profiles against job descriptions.

---

## 🚀 Key Features

*   **AI Resume Generator**: Generate beautiful, ATS-compliant resumes tailored to your target industry.
*   **AI Resume Enhancer**: Improve your current resume using smart suggestions, vocabulary upgrades, and formatting tweaks.
*   **ATS Score Analyzer**: Check how well your resume scores against standard Applicant Tracking Systems.
*   **Portfolio Generator**: Turn your resume into a stunning, responsive, shareable web portfolio.
*   **Resume vs Job Description Matcher**: Compare your resume against job descriptions to optimize your application.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: SQLite (SQLAlchemy ORM)
*   **AI Engine**: Google Gemini API

### Deployment
*   **Frontend**: Vercel
*   **Backend**: Render

---

## 📂 Project Structure

```text
NextHire-AI/
├── frontend/             # React (Vite) frontend application
├── backend/              # FastAPI backend application
├── docs/                 # Project documentation
├── assets/               # Branding assets, screenshots, and diagrams
├── .gitignore            # Git ignore configuration
└── README.md             # Project overview
```

---

## 📈 Development Roadmap

*   [x] **Phase 1**: Project Initialization
*   [x] **Phase 2**: Frontend Foundation
*   [x] **Phase 3**: Backend Foundation
*   [x] **Phase 4**: Resume Generator
*   [x] **Phase 5**: Resume Enhancer
*   [x] **Phase 6**: ATS Analyzer
*   [x] **Phase 7**: Portfolio Builder
*   [x] **Phase 8**: JD Matcher
*   [x] **Phase 9**: UI Polish
*   [x] **Phase 10**: Deployment Configurations
*   [ ] **Phase 11**: Technical Documentation
*   [ ] **Phase 12**: Final QA

---

## 🚀 Deployment Guide

This project is configured for single-click deployment using **Vercel** (for the frontend) and **Render** (for the backend).

### Frontend Deployment (Vercel)
1. Import the repository in Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set the build commands automatically (Framework preset: `Vite`).
4. Set the **Environment Variable**:
   *   `VITE_API_URL`: The live URL of your Render backend (e.g., `https://nexthire-backend.onrender.com`).
5. Vercel will build and route client requests correctly using the configuration in [vercel.json](./frontend/vercel.json).

### Backend Deployment (Render)
1. Import the repository in Render using the Blueprint feature, or create a Web Service.
2. Render will automatically parse the configuration in [render.yaml](./render.yaml).
3. Set the **Environment Variable**:
   *   `GEMINI_API_KEY`: Paste your private Google Gemini API key.
4. Render mounts a 1GB persistent disk under `/data` to store the SQLite `nexthire.db` database file, preventing data loss on build restarts.

