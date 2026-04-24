# AI Recruiter — Team 7

An AI-powered recruitment platform built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Gemini AI**. It lets recruiters post jobs, receive applicant profiles, and get instant AI-generated candidate rankings with explainable scores.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v3
- **State:** Redux Toolkit + React Redux
- **Font:** Work Sans (`@fontsource/work-sans`)
- **AI:** Gemini AI (candidate screening & scoring)
- **Language:** TypeScript

---

## Project Structure

```
app/
├── page.tsx              # Landing page (hero, features, stats)
├── layout.tsx            # Root layout with Navbar
├── login/page.tsx        # Recruiter login
├── jobs/
│   ├── page.tsx          # Public job listings
│   └── [id]/
│       ├── page.tsx      # Job detail
│       └── apply/        # Candidate application form
└── dashboard/
    ├── page.tsx          # Recruiter dashboard home
    ├── layout.tsx        # Dashboard layout
    ├── applicants/
    │   ├── page.tsx      # All applicants list
    │   └── [id]/page.tsx # Applicant detail + AI score
    ├── jobs/
    │   ├── page.tsx      # Manage jobs
    │   └── [id]/page.tsx # Job-specific applicants
    └── settings/page.tsx # Account settings

components/
└── Navbar.tsx            # Top nav with auth state

data/
└── jobs.ts               # Job listings data

lib/
├── auth.ts               # Login / logout / session helpers
└── dummyData.ts          # Applicant profiles + AI screening results
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials:**
- Email: `admin@umurava.com`
- Password: `password123`

---

## Key Features

- **AI Candidate Screening** — Gemini AI ranks applicants by fit score with strengths, gaps, and a hiring recommendation
- **Recruiter Dashboard** — Manage jobs and applicants in one place
- **Public Job Board** — Candidates can browse and apply to open positions
- **Bulk Applicant Support** — Structured applicant profiles with skills, experience, education, and projects
- **Auth** — Cookie + localStorage-based session (dummy auth for demo)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
