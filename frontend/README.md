# NextHire AI - Frontend Workspace

NextHire AI's frontend is a premium, fully-responsive SPA built with React, TypeScript, Tailwind CSS, and Framer Motion. It delivers a glassmorphic dark-themed user experience for resume generation, ATS scoring dashboards, tailoring bullet points, matching job descriptions, and custom portfolio compilation.

---

## 🛠️ Tech Stack & Requirements

*   **Runtime**: Node.js v18+ (npm v9+)
*   **Core**: React 18 (TypeScript)
*   **Bundler**: Vite
*   **Styling**: Tailwind CSS v3
*   **Animations**: Framer Motion
*   **Icons**: Lucide React

---

## 🚀 Local Setup Instructions

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install project dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_API_URL=http://localhost:8000
    ```

4.  **Run the local development server**:
    ```bash
    npm run dev
    ```
    The dev server will startup at [http://localhost:5173/](http://localhost:5173/).

5.  **Compile production bundle**:
    To compile and verify production type safety checks:
    ```bash
    npm run build
    ```
    The compiled client bundle will be outputted to `frontend/dist/`.

---

## 🎨 Visual Tokens & Design System

*   **Background**: `#09090B` (Clean deep charcoal black)
*   **Card Surface**: `#111114` (Frosted glassmorphism background with `backdrop-filter: blur(12px)`)
*   **Primary Accent**: `#7C3AED` (Violet brand color with neon glow effects)
*   **Secondary Accent**: `#3B82F6` (Royal blue highlights)
*   **Success**: `#10B981` (Emerald green for high match ratings)
*   **Premium Accent**: `#D4AF37` (Bright gold for pro features)
*   **Fonts**: *Space Grotesk* (headings) and *Inter* (body text)
*   **Animations**: Custom sliding active navigation indicator underlines and Framer Motion page transitions.

---

## 📂 Page Route Architecture

*   `/` - Landing page with animated feature cards.
*   `/resume-generator` - AI resume builder workspace with a real-time paper page sheet preview.
*   `/resume-enhancer` - Accomplishment tailoring page splitting rewrites into Situation/Task/Action/Result cards.
*   `/ats-analyzer` - Saved resumes compliance scanner featuring SVG radial progress gauges.
*   `/portfolio-builder` - Portfolio customization control room supporting 4 theme selectors.
*   `/portfolio/:slug` - Standalone personal website layouts (classic-dark, modern-glass, neon-future, minimalist-light).
*   `/jd-matcher` - Job description text comparators showing matched/missing competencies.
