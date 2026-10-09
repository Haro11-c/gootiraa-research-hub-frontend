# Gootiraa Research Hub (ጎቲራ) — Frontend

> **Scholarly Repository, Open Science & Independent Science Journalism**

An open, high-integrity academic discovery platform and science journalism portal combining researcher profiles, publication discovery, author patronage, empirical fact-checking, and evidence-grounded AI workflows.

---

## 🌐 Live Web App Deployments

| Component | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Web App (Frontend)** | **Vercel** | [https://gootiraa-research-hub-frontend.vercel.app](https://gootiraa-research-hub-frontend.vercel.app) | 🟢 Production Ready |
| **API Backend** | **Render** | [https://gootiraa-research-hub-backend.onrender.com](https://gootiraa-research-hub-backend.onrender.com) | 🟢 API Live |
| **API Health Check** | **Render** | [https://gootiraa-research-hub-backend.onrender.com/api/v1/health](https://gootiraa-research-hub-backend.onrender.com/api/v1/health) | 🟢 Health OK |

---

## 🚀 How to Deploy on Vercel (1-Click Guide)

You can deploy this frontend directly to your **Vercel** account in under 2 minutes:

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository: `Haro11-c/gootiraa-research-hub-frontend`.
4. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://gootiraa-research-hub-backend.onrender.com` *(your Render backend URL)*
6. Click **Deploy**! 

*Note: The included [`vercel.json`](./vercel.json) automatically handles single-page application (SPA) routing, so all deep links (`/discovery`, `/editorial`, `/admin`, `/policy`) load smoothly without 404 errors.*

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/Haro11-c/gootiraa-research-hub-frontend.git
cd gootiraa-research-hub-frontend

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# App will run at http://localhost:3000 (or http://localhost:5173)

# 4. Build production bundle
npm run build
```

---

## 🔑 Demo Access Accounts

All accounts use password: **`Gootiraa2026Secure!`**

| Role | Email | Description |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@gootiraa.org` | Financial payouts, anti-fraud telemetry, user roles |
| **Moderator / Editor** | `admin@gootiraa.org` | Manuscript approvals, publishing science news & fact-checks |
| **Senior Scholar** | `almaz.bekele@aau.edu.et` | Dr. Almaz Bekele (AAU) — Top 1% Ranked Researcher |
| **Active Scholar** | `harouturakerro@gmail.com` | Haro Utura — Research contributor & impact wallet |

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (SPA routing via `vercel.json`)
