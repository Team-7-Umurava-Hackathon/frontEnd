"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();

   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [method, setMethod] = useState<"manual" | "upload" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  // ================= BASIC INFO =================
  const [basic, setBasic] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    headline: "",
    bio: "",
  });

  const handleBasicChange = (e: any) => {
    setBasic({ ...basic, [e.target.name]: e.target.value });
  };

  // ================= Type Definitions =================
  type Skill = { name: string; level: string; yearsOfExperience: number };
  type Language = { name: string; proficiency: string };
  type Experience = {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string;
  };
  type Education = {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: string;
    endYear: string;
  };
  type Certification = { name: string; issuer: string; issueDate: string };
  type Project = {
    name: string;
    role: string;
    link: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string;
  };

  // ================= DETAILED FORM STATE =================
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: "", level: "Beginner", yearsOfExperience: 0 });
  const handleSkillChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addSkill = () => {
    if (currentSkill.name && currentSkill.level && currentSkill.yearsOfExperience >= 0) {
      setSkills([...skills, currentSkill]);
      setCurrentSkill({ name: "", level: "Beginner", yearsOfExperience: 0 });
    }
  };
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>({ name: "", proficiency: "Basic" });
  const handleLanguageChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addLanguage = () => {
    if (currentLanguage.name) {
      setLanguages([...languages, currentLanguage]);
      setCurrentLanguage({ name: "", proficiency: "Basic" });
    }
  };
  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: "",
  });
  const handleExperienceChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addExperience = () => {
    if (currentExperience.company && currentExperience.role) {
      setExperiences([...experiences, currentExperience]);
      setCurrentExperience({ company: "", role: "", startDate: "", endDate: "", description: "", technologies: "" });
    }
  };
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const [education, setEducation] = useState<Education[]>([]);
  const [currentEducation, setCurrentEducation] = useState<Education>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });
  const handleEducationChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      setEducation([...education, currentEducation]);
      setCurrentEducation({ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" });
    }
  };
  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [currentCertification, setCurrentCertification] = useState<Certification>({ name: "", issuer: "", issueDate: "" });
  const handleCertificationChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addCertification = () => {
    if (currentCertification.name && currentCertification.issuer) {
      setCertifications([...certifications, currentCertification]);
      setCurrentCertification({ name: "", issuer: "", issueDate: "" });
    }
  };
  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({ name: "", role: "", link: "", startDate: "", endDate: "", description: "", technologies: "" });
  const handleProjectChange = (setter: any, state: any) => (e: any) => {
    setter({ ...state, [e.target.name]: e.target.value });
  };
  const addProject = () => {
    if (currentProject.name && currentProject.role) {
      setProjects([...projects, currentProject]);
      setCurrentProject({ name: "", role: "", link: "", startDate: "", endDate: "", description: "", technologies: "" });
    }
  };
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // ================= SUBMIT HANDLERS =================
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!basic.firstName || !basic.lastName || !basic.email) {
      alert("Fill required fields");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...basic,
        skills,
        languages,
        experiences,
        education,
        certifications,
        projects,
        job: id,
      };

      const res = await fetch(`${API_URL}/talents/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        window.alert("Unable to submit your application. Please try again later.");
        return;
      }
      alert("Application submitted!");
      router.push("/jobs");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePDFSubmit = async () => {
    if (!resumeFile) {
      alert("Select a PDF file");
      return;
    }

    // Check authentication before upload
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upload a resume. Please log in and try again.");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", resumeFile);
      formData.append("jobId", id as string);

      const res = await fetch(`${API_URL}/talents/upload/pdf?type=pdf`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        window.alert("Unable to submit your application. Please try again later.");
        return;
      }
      alert("Resume uploaded successfully!");
      router.push("/jobs");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Render
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Apply for this position</h1>

        {/* Method selection */}
        {!method && (
          <div className="space-y-4 mb-8">
            <p className="text-gray-600">Choose how you want to apply</p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => setMethod("manual")}
                className="flex-1 py-4 rounded-xl bg-primary text-white font-semibold"
              >
                Fill Form Manually
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert("You must be logged in to upload a resume. Please log in first.");
                    router.push("/login");
                    return;
                  }
                  setMethod("upload");
                }}
                className={`flex-1 py-4 rounded-xl font-semibold transition ${
                  isAuthenticated
                    ? "bg-lightBlue text-primary hover:opacity-80"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                }`}
                disabled={!isAuthenticated}
              >
                Upload PDF Resume {!isAuthenticated && "(Login Required)"}
              </button>
            </div>
          </div>
        )}

        {/* Manual form */}
        {method === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <button
              type="button"
              onClick={() => setMethod(null)}
              className="text-sm text-primary underline mb-4"
            >
              ← Change method
            </button>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                name="firstName"
                placeholder="First Name *"
                value={basic.firstName}
                onChange={handleBasicChange}
                className="border rounded-xl p-3"
              />
              <input
                name="lastName"
                placeholder="Last Name *"
                value={basic.lastName}
                onChange={handleBasicChange}
                className="border rounded-xl p-3"
              />
              <input
                name="email"
                placeholder="Email *"
                value={basic.email}
                onChange={handleBasicChange}
                className="border rounded-xl p-3 md:col-span-2"
              />
              <input
                name="location"
                placeholder="Location"
                value={basic.location}
                onChange={handleBasicChange}
                className="border rounded-xl p-3"
              />
              <input
                name="headline"
                placeholder="Headline (e.g. Senior Developer)"
                value={basic.headline}
                onChange={handleBasicChange}
                className="border rounded-xl p-3 md:col-span-2"
              />
              <textarea
                name="bio"
                placeholder="Bio / About You"
                value={basic.bio}
                onChange={handleBasicChange}
                className="border rounded-xl p-3 md:col-span-2 min-h-24 resize-none"
              />
            </div>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
              <div className="space-y-3 mb-4">
                {skills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-lightBlue rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.level} • {s.yearsOfExperience} years</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSkill(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <input
                  placeholder="Skill Name"
                  value={currentSkill.name}
                  onChange={handleSkillChange(setCurrentSkill, currentSkill)}
                  name="name"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={currentSkill.level}
                  onChange={handleSkillChange(setCurrentSkill, currentSkill)}
                  name="level"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <input
                  type="number"
                  placeholder="Years"
                  value={currentSkill.yearsOfExperience}
                  onChange={handleSkillChange(setCurrentSkill, currentSkill)}
                  name="yearsOfExperience"
                  min="0"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Skill
              </button>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Languages</h2>
              <div className="space-y-3 mb-4">
                {languages.map((l, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-lightBlue rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{l.name}</p>
                      <p className="text-xs text-gray-500">{l.proficiency}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLanguage(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Language"
                  value={currentLanguage.name}
                  onChange={handleLanguageChange(setCurrentLanguage, currentLanguage)}
                  name="name"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={currentLanguage.proficiency}
                  onChange={handleLanguageChange(setCurrentLanguage, currentLanguage)}
                  name="proficiency"
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addLanguage}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Language
              </button>
            </section>

            {/* Work Experience */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Experience</h2>
              <div className="space-y-3 mb-4">
                {experiences.map((exp, i) => (
                  <div key={i} className="border rounded-xl p-4 bg-lightBlue relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(i)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl"
                    >
                      ×
                    </button>
                    <h3 className="font-semibold text-gray-800 pr-6">{exp.role} at {exp.company}</h3>
                    <p className="text-sm text-gray-600">{exp.startDate} – {exp.endDate || "Present"}</p>
                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                    {exp.technologies && (
                      <p className="text-xs text-gray-500 mt-2">Tech: {exp.technologies}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="border rounded-xl p-6 bg-gray-50 space-y-4 mb-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="company"
                    value={currentExperience.company}
                    onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Company Name"
                  />
                  <input
                    name="role"
                    value={currentExperience.role}
                    onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Job Title"
                  />
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={currentExperience.startDate}
                      onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">End Date (leave blank if current)</label>
                    <input
                      type="date"
                      name="endDate"
                      value={currentExperience.endDate}
                      onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                      className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <textarea
                  name="description"
                  value={currentExperience.description}
                  onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                  placeholder="Key responsibilities and achievements"
                />
                <input
                  name="technologies"
                  value={currentExperience.technologies}
                  onChange={handleExperienceChange(setCurrentExperience, currentExperience)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Technologies used (comma-separated)"
                />
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Experience
              </button>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>
              <div className="space-y-3 mb-4">
                {education.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-lightBlue rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{e.degree} in {e.fieldOfStudy}</p>
                      <p className="text-xs text-gray-500">{e.institution} • {e.startYear}–{e.endYear}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEducation(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleEducationChange(setCurrentEducation, currentEducation)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Institution/University"
                />
                <input
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleEducationChange(setCurrentEducation, currentEducation)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Degree"
                />
                <input
                  name="fieldOfStudy"
                  value={currentEducation.fieldOfStudy}
                  onChange={handleEducationChange(setCurrentEducation, currentEducation)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Field of Study"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="startYear"
                    value={currentEducation.startYear}
                    onChange={handleEducationChange(setCurrentEducation, currentEducation)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Start Year"
                  />
                  <input
                    type="number"
                    name="endYear"
                    value={currentEducation.endYear}
                    onChange={handleEducationChange(setCurrentEducation, currentEducation)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="End Year"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Education
              </button>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Certifications</h2>
              <div className="space-y-3 mb-4">
                {certifications.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-lightBlue rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.issuer} • {c.issueDate}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertification(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <input
                  name="name"
                  value={currentCertification.name}
                  onChange={handleCertificationChange(setCurrentCertification, currentCertification)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Certification Name"
                />
                <input
                  name="issuer"
                  value={currentCertification.issuer}
                  onChange={handleCertificationChange(setCurrentCertification, currentCertification)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Issuer"
                />
                <input
                  type="date"
                  name="issueDate"
                  value={currentCertification.issueDate}
                  onChange={handleCertificationChange(setCurrentCertification, currentCertification)}
                  className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={addCertification}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Certification
              </button>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects</h2>
              <div className="space-y-3 mb-4">
                {projects.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-lightBlue rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.role} • {p.startDate}–{p.endDate}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="border rounded-xl p-6 bg-gray-50 space-y-4 mb-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    value={currentProject.name}
                    onChange={handleProjectChange(setCurrentProject, currentProject)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Project Name"
                  />
                  <input
                    name="role"
                    value={currentProject.role}
                    onChange={handleProjectChange(setCurrentProject, currentProject)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Role"
                  />
                  <input
                    name="link"
                    value={currentProject.link}
                    onChange={handleProjectChange(setCurrentProject, currentProject)}
                    className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Project Link (URL)"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      name="startDate"
                      value={currentProject.startDate}
                      onChange={handleProjectChange(setCurrentProject, currentProject)}
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={currentProject.endDate}
                      onChange={handleProjectChange(setCurrentProject, currentProject)}
                      className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <textarea
                  name="description"
                  value={currentProject.description}
                  onChange={handleProjectChange(setCurrentProject, currentProject)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-20"
                  placeholder="Project Description"
                />
                <input
                  name="technologies"
                  value={currentProject.technologies}
                  onChange={handleProjectChange(setCurrentProject, currentProject)}
                  className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Technologies used (comma-separated)"
                />
              </div>
              <button
                type="button"
                onClick={addProject}
                className="px-4 py-2 bg-lightBlue text-primary font-medium rounded-xl hover:opacity-80 transition"
              >
                + Add Project
              </button>
            </section>

            {/* Submit Button for detailed form */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}

        {/* Upload PDF */}
        {method === "upload" && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setMethod(null)}
              className="text-sm text-primary underline mb-4"
            >
              ← Change method
            </button>
            <div className="border-2 border-dashed rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                id="pdf"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="pdf" className="cursor-pointer">
                <p className="font-medium">Upload your PDF resume</p>
                {resumeFile && <p className="text-green-600 mt-2">✓ {resumeFile.name}</p>}
              </label>
            </div>
            <button
              onClick={handlePDFSubmit}
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded-xl"
            >
              {submitting ? "Uploading..." : "Submit Resume"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
