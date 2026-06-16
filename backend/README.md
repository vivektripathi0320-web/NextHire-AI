# NextHire AI - Backend API Service

NextHire AI's backend is a high-performance REST API built using FastAPI, SQLite, and SQLAlchemy. It handles resume storage, automated ATS auditing, and integrates with the Google Gemini API to structure candidate data, optimize accomplishment bullet points, and analyze job descriptions.

---

## 🛠️ Tech Stack & Requirements

*   **Runtime**: Python 3.10+
*   **Framework**: FastAPI
*   **Database**: SQLite (SQLAlchemy ORM)
*   **Server**: Uvicorn
*   **AI SDK**: `google-generativeai`

---

## 🚀 Local Setup Instructions

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Initialize a virtual environment**:
    ```bash
    python -m venv .venv
    ```

3.  **Activate the virtual environment**:
    *   **PowerShell (Windows)**:
        ```powershell
        .\.venv\Scripts\Activate.ps1
        ```
    *   **Git Bash / macOS / Linux**:
        ```bash
        source .venv/bin/activate
        ```

4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure Environment Variables**:
    Create a `.env` file in the `backend/` directory:
    ```env
    DATABASE_URL=sqlite:///nexthire.db
    GEMINI_API_KEY=your_private_gemini_api_key
    ```
    *(Note: If `GEMINI_API_KEY` is omitted, the API fallback mode activates, returning mock responses based on input keywords for development testing).*

6.  **Run the local development server**:
    ```bash
    uvicorn app.main:app --reload
    ```
    The server will startup at [http://127.0.0.1:8000](http://127.0.0.1:8000). You can explore the interactive OpenAPI swagger documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

---

## 📡 API Reference Directory

### Health Check
*   `GET /api/health` - Check database and AI service connectivity.

### Resume Workspaces
*   `POST /api/resumes/generate` - AI parser to structure plain text inputs into resume JSON.
*   `POST /api/resumes` - Save structured resume details.
*   `GET /api/resumes` - List saved resumes.
*   `GET /api/resumes/{resume_id}` - Retrieve a specific resume.
*   `DELETE /api/resumes/{resume_id}` - Delete a resume.

### Resume Enhancer
*   `POST /api/enhancements/optimize` - Rewrite a weak accomplishment bullet point using the STAR method.

### ATS Score Analyzer
*   `POST /api/ats-scan/analyze` - Scan resume against job requirements to calculate compatibility.
*   `GET /api/ats-scan/history/{resume_id}` - Fetch past ATS audits for a resume.

### Portfolio Builder
*   `POST /api/portfolios` - Reserve a unique slug and publish customization layouts.
*   `GET /api/portfolios/{slug}` - Fetch portfolio configurations and serialized resume details.

### JD Matcher
*   `POST /api/match-jd/compare` - Compare resumes vs job descriptions, identifying matched/missing keywords and advice.
