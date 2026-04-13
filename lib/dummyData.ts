export const applicants = [
  {
    id: "a1",
    appliedJobId: "1",
    status: "pending",
    name: "Alice Mutoni",
    email: "alice@gmail.com",
    location: "Kigali, Rwanda",
    headline: "Frontend Developer with 3 years experience",
    bio: "Passionate about building clean UIs and great user experiences.",
    skills: [
      { skill: "React", proficiency: "Expert", years: "3" },
      { skill: "Next.js", proficiency: "Advanced", years: "2" },
      { skill: "Tailwind CSS", proficiency: "Advanced", years: "2" },
      { skill: "TypeScript", proficiency: "Intermediate", years: "1" },
    ],
    experience: [
      {
        company: "TechCorp Rwanda",
        role: "Frontend Developer",
        startDate: "2022-01",
        endDate: "2024-12",
        responsibilities: "Built recruiter dashboards and internal tools using React and Next.js.",
        technologies: "React, Next.js, Tailwind, REST APIs",
      },
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor's",
        fieldOfStudy: "Computer Science",
        startYear: "2018",
        endYear: "2022",
      },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
    ],
    certifications: [
      { name: "React Developer Certification", issuer: "Meta", issueDate: "2023-06" },
    ],
    projects: [
      {
        name: "HR Dashboard",
        description: "A full recruiter dashboard with analytics.",
        role: "Lead Developer",
        link: "https://github.com/alice/hr-dashboard",
        technologies: "React, Next.js, Tailwind",
      },
    ],
  },
  {
    id: "a2",
    appliedJobId: "1",
    status: "pending",
    name: "Bruno Habimana",
    email: "bruno@gmail.com",
    location: "Nairobi, Kenya",
    headline: "UI Engineer focused on design systems",
    bio: "I love creating beautiful, accessible interfaces.",
    skills: [
      { skill: "React", proficiency: "Advanced", years: "2" },
      { skill: "Next.js", proficiency: "Intermediate", years: "1" },
      { skill: "Tailwind CSS", proficiency: "Expert", years: "3" },
      { skill: "Figma", proficiency: "Advanced", years: "2" },
    ],
    experience: [
      {
        company: "DesignHub",
        role: "UI Engineer",
        startDate: "2021-06",
        endDate: "2024-06",
        responsibilities: "Led design system development and component library maintenance.",
        technologies: "React, Storybook, Tailwind",
      },
    ],
    education: [
      {
        institution: "Strathmore University",
        degree: "Bachelor's",
        fieldOfStudy: "Information Technology",
        startYear: "2017",
        endYear: "2021",
      },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Swahili", proficiency: "Native" },
    ],
    certifications: [],
    projects: [
      {
        name: "Design System Kit",
        description: "Open source Tailwind component library.",
        role: "Creator",
        link: "https://github.com/bruno/ds-kit",
        technologies: "Tailwind, React, Storybook",
      },
    ],
  },
  {
    id: "a3",
    appliedJobId: "2",
    status: "pending",
    name: "Clara Ishimwe",
    email: "clara@gmail.com",
    location: "Kampala, Uganda",
    headline: "AI Engineer specializing in LLM integrations",
    bio: "Building intelligent systems that make decisions transparent and fair.",
    skills: [
      { skill: "Python", proficiency: "Expert", years: "4" },
      { skill: "Prompt Engineering", proficiency: "Advanced", years: "2" },
      { skill: "LLMs", proficiency: "Advanced", years: "2" },
      { skill: "TensorFlow", proficiency: "Intermediate", years: "1" },
    ],
    experience: [
      {
        company: "AI Labs Africa",
        role: "AI Engineer",
        startDate: "2021-03",
        endDate: "2024-11",
        responsibilities: "Designed and deployed NLP pipelines and LLM-based ranking systems.",
        technologies: "Python, Gemini API, LangChain, FastAPI",
      },
    ],
    education: [
      {
        institution: "Makerere University",
        degree: "Master's",
        fieldOfStudy: "Artificial Intelligence",
        startYear: "2019",
        endYear: "2021",
      },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Luganda", proficiency: "Native" },
    ],
    certifications: [
      { name: "Google AI Certification", issuer: "Google", issueDate: "2023-09" },
    ],
    projects: [
      {
        name: "Candidate Ranker",
        description: "LLM-powered candidate scoring system using Gemini.",
        role: "Lead AI Engineer",
        link: "https://github.com/clara/candidate-ranker",
        technologies: "Python, Gemini API, FastAPI",
      },
    ],
  },
  {
    id: "a4",
    appliedJobId: "2",
    status: "pending",
    name: "David Nkurunziza",
    email: "david@gmail.com",
    location: "Kigali, Rwanda",
    headline: "ML Engineer with NLP focus",
    bio: "Turning unstructured text into structured insights.",
    skills: [
      { skill: "Python", proficiency: "Expert", years: "5" },
      { skill: "NLP", proficiency: "Advanced", years: "3" },
      { skill: "LLMs", proficiency: "Intermediate", years: "1" },
      { skill: "PyTorch", proficiency: "Advanced", years: "3" },
    ],
    experience: [
      {
        company: "DataWorks",
        role: "ML Engineer",
        startDate: "2019-07",
        endDate: "2024-12",
        responsibilities: "Built text classification and entity extraction systems for HR tech.",
        technologies: "Python, PyTorch, HuggingFace, FastAPI",
      },
    ],
    education: [
      {
        institution: "Carnegie Mellon Africa",
        degree: "Master's",
        fieldOfStudy: "Machine Learning",
        startYear: "2017",
        endYear: "2019",
      },
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "French", proficiency: "Conversational" },
      { name: "Kinyarwanda", proficiency: "Native" },
    ],
    certifications: [
      { name: "AWS ML Specialty", issuer: "Amazon", issueDate: "2022-11" },
    ],
    projects: [
      {
        name: "ResumeParser Pro",
        description: "Automated resume parsing and scoring tool.",
        role: "Lead Engineer",
        link: "https://github.com/david/resume-parser",
        technologies: "Python, HuggingFace, FastAPI",
      },
    ],
  },
];

export type Applicant = typeof applicants[0];


// ================= AI SCREENING RESULTS =================
export type AIResult = {
  id: string;
  rank: number;
  score: number;
  strengths: string;
  gaps: string;
  recommendation: string;
};

export const dummyScreeningResults: Record<string, AIResult[]> = {
  "1": [
    {
      id: "a1",
      rank: 1,
      score: 94,
      strengths: "3 years of hands-on React and Next.js experience, expert-level Tailwind CSS, has built production-grade recruiter dashboards which directly aligns with this role. Strong portfolio with real-world projects.",
      gaps: "Limited TypeScript experience (only 1 year, intermediate level). No mention of testing frameworks like Jest or Cypress.",
      recommendation: "Highly recommended. Alice is a near-perfect fit for this role. Prioritize for first interview.",
    },
    {
      id: "a2",
      rank: 2,
      score: 81,
      strengths: "Expert-level Tailwind CSS and strong design system background. Experience maintaining component libraries with Storybook is a strong asset for building scalable UIs.",
      gaps: "Next.js experience is only intermediate (1 year). Less exposure to API integration compared to the job requirements. No TypeScript mentioned.",
      recommendation: "Recommended. Bruno brings strong UI fundamentals. Would benefit from a technical screen focused on API integration skills.",
    },
  ],
  "2": [
    {
      id: "a3",
      rank: 1,
      score: 96,
      strengths: "Expert Python skills with 4 years experience, advanced LLM and prompt engineering knowledge, has directly built LLM-based ranking systems using Gemini API — exactly what this role requires. Master's in AI adds strong theoretical foundation.",
      gaps: "TensorFlow proficiency is only intermediate. No mention of experience with TypeScript or Node.js for backend integration.",
      recommendation: "Highly recommended. Clara is an outstanding match. Her direct Gemini API experience and candidate ranking project make her the top candidate for this position.",
    },
    {
      id: "a4",
      rank: 2,
      score: 87,
      strengths: "5 years of Python experience, advanced NLP and PyTorch skills, built an automated resume parsing tool which is highly relevant to the role. Master's in ML from Carnegie Mellon Africa is a strong credential.",
      gaps: "LLM experience is only intermediate (1 year) compared to the advanced level expected. Less direct experience with Gemini API specifically. Prompt engineering not mentioned.",
      recommendation: "Recommended. David has solid ML foundations and relevant projects. Would need to upskill on LLM prompt engineering but shows strong potential.",
    },
  ],
};