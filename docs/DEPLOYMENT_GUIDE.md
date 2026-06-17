# NextHire AI - Step-by-Step GitHub Upload & Free Deployment Guide

This guide details how to upload the NextHire AI codebase to GitHub and deploy the application (both frontend and backend) on 100% free hosting tiers.

---

## 📁 1. Uploading the Project to GitHub

Follow these steps to push your local code to a new GitHub repository.

### Step 1.1: Create a GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click **New** (or the **+** icon in the top right > **New repository**).
3. Set **Repository name** to `NextHire-AI`.
4. Set description to `AI-powered Resume Builder, ATS Analyzer, Cover Letter Generator, and Web Portfolio Platform`.
5. Keep the repository **Public** or **Private** (Free accounts support private repos).
6. **Do NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (the local project already has these configured).
7. Click **Create repository**.

### Step 1.2: Push the Local Repository to GitHub
Open your terminal (PowerShell, Command Prompt, or Git Bash) in the root directory `NextHire-AI/` and execute:

```bash
# 1. Link the local repository to your remote GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/NextHire-AI.git

# 2. Rename the active branch to master (if not already master)
git branch -M master

# 3. Stage all files
git add .

# 4. Commit all files (if there are any unstaged changes)
git commit -m "feat: Ready for production deployment"

# 5. Push the code to GitHub
git push -u origin master
```

---

## 📡 2. Deploying the Backend on Render (100% Free)

We deploy the Python FastAPI backend on **Render.com** under their Free Web Service tier.

### Step 2.1: Create a Web Service
1. Sign up/Log in to [Render.com](https://render.com) (you can sign up instantly using your GitHub account).
2. On the dashboard, click **New +** and select **Web Service**.
3. Under **Connect a repository**, select your connected GitHub account and select your `NextHire-AI` repository. Click **Connect**.

### Step 2.2: Configure the Web Service
Set the configuration fields precisely as follows:

*   **Name**: `nexthire-backend`
*   **Region**: Select the region closest to you (e.g., *Singapore* or *Frankfurt*).
*   **Branch**: `master`
*   **Root Directory**: `backend` (Crucial: This tells Render to compile from the backend folder).
*   **Runtime**: `Python`
*   **Build Command**: `pip install -r requirements.txt`
*   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
*   **Instance Type**: Select **Free** (0 USD/month).

### Step 2.3: Configure Environment Variables
1. Scroll down and click **Advanced**.
2. Click **Add Environment Variable** and add the following two keys:
   *   **Key**: `DATABASE_URL`
       *   **Value**: `sqlite:///nexthire.db`
   *   **Key**: `GEMINI_API_KEY`
       *   **Value**: `<YOUR_GEMINI_API_KEY>` (Your active API Key)
   *   **Key**: `ENV`
       *   **Value**: `production`
3. Click **Create Web Service**.

Render will trigger the build and deploy. Once the build completes, copy the generated service URL at the top left of the Render panel (e.g., `https://nexthire-backend.onrender.com`).

> [!NOTE]
> Render's Free tier services automatically spin down (suspend) after 15 minutes of inactivity. When a new request arrives, it will take 30-50 seconds to spin back up ("cold start"). This is standard behavior for free hosting.

---

## 💻 3. Deploying the Frontend on Vercel (100% Free)

We deploy the React frontend on **Vercel.com**, which automatically optimizes static builds and serves them on a global CDN.

### Step 3.1: Import the Project
1. Sign up/Log in to [Vercel.com](https://vercel.com) (using your GitHub account is recommended).
2. On your Vercel dashboard, click **Add New** > **Project**.
3. Select your `NextHire-AI` repository from the list and click **Import**.

### Step 3.2: Configure the Project
Set the configuration fields as follows:

*   **Framework Preset**: Select **Vite** (Vercel automatically detects this).
*   **Root Directory**: Click *Edit* and select the **`frontend`** directory, then click *Continue*. (Crucial: This tells Vercel to compile only the React client).
*   **Build and Output Settings**: Leave as default.
*   **Environment Variables**:
    *   Click to expand.
    *   **Key**: `VITE_API_BASE_URL`
    *   **Value**: Paste your Render backend URL copied in Step 2.3 (e.g. `https://nexthire-backend.onrender.com` - **do NOT include a trailing slash `/`**).
    *   Click **Add**.

### Step 3.3: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies, compile the TypeScript source files, and deploy your site on a free `.vercel.app` subdomain.
3. Click **Go to Dashboard** once finished to grab your live working URL (e.g. `https://nexthire-ai.vercel.app`).

---

## 🎯 4. Submitting Your Working Link

Your deployment is complete! When submitting your project to the examiner, provide:
1.  **Your Live Application URL**: The Vercel URL (e.g. `https://nexthire-ai.vercel.app`)
2.  **Your GitHub Repository URL**: (e.g. `https://github.com/username/NextHire-AI`)
3.  **Documentation Reference**: Point the examiner to this guide and the branding specifications in the `docs/` folder.
