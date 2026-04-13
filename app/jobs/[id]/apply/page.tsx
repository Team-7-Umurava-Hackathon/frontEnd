"use client";

import { useState } from "react";

export default function ApplyPage() {
  const [resumeOption, setResumeOption] = useState<"manual" | "upload" | "link">("manual");

  // ================= SKILLS =================
  const [skills, setSkills] = useState<any[]>([]);
  const [currentSkill, setCurrentSkill] = useState({ skill: "", proficiency: "", years: "" });

  // ================= EXPERIENCE =================
  const [experiences, setExperiences] = useState<any[]>([]);
  const [currentExperience, setCurrentExperience] = useState({
    company: "", role: "", startDate: "", endDate: "", responsibilities: "", technologies: "",
  });

  // ================= LANGUAGES =================
  const [languages, setLanguages] = useState<any[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState({ name: "", proficiency: "" });

  // ================= EDUCATION =================
  const [education, setEducation] = useState<any[]>([]);
  const [currentEducation, setCurrentEducation] = useState({
    institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "",
  });

  // ================= CERTIFICATIONS =================
  const [certifications, setCertifications] = useState<any[]>([]);
  const [currentCertification, setCurrentCertification] = useState({ name: "", issuer: "", issueDate: "" });

  // ================= PROJECTS =================
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState({
    name: "", description: "", role: "", link: "", startDate: "", endDate: "", technologies: "",
  });

  // ================= GENERIC HANDLER =================
  const handleChange =
    (setter: any, state: any) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setter({ ...state, [e.target.name]: e.target.value });
    };

  // ================= GENERIC ADD =================
  const addItem = (list: any[], setList: any, item: any, reset: () => void) => {
    const isEmpty = Object.values(item).every((v) => v === "");
    if (isEmpty) return;
    setList([...list, item]);
    reset();
  };

  // ================= EXPERIENCE HANDLERS =================
  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentExperience((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addExperience = () => {
    addItem(experiences, setExperiences, currentExperience, () =>
      setCurrentExperience({ company: "", role: "", startDate: "", endDate: "", responsibilities: "", technologies: "" })
    );
  };

  const removeExperience = (index: number) =>
    setExperiences((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-background px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary">Talent Profile Application</h1>
        <p className="text-gray-500 mt-2">Complete your profile to apply for this position.</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Application Method</h2>
          <p className="text-gray-500 mb-4">
            Choose only one way to submit your profile: fill the form manually, upload a PDF resume, or share a resume link.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            {(["manual", "upload", "link"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setResumeOption(value)}
                className={`px-4 py-2 rounded-xl capitalize ${
                  resumeOption === value ? "bg-primary text-white" : "bg-lightBlue text-primary"
                }`}
              >
                {value === "manual" ? "Fill Manually" : value === "upload" ? "Upload PDF" : "Resume Link"}
              </button>
            ))}
          </div>
          {resumeOption === "upload" && (
            <input type="file" accept=".pdf" className="w-full border rounded-xl px-4 py-3" />
          )}
          {resumeOption === "link" && (
            <input className="w-full border rounded-xl px-4 py-3" placeholder="Paste resume URL" />
          )}
        </section>

        <form className="mt-8 space-y-10">
          {resumeOption === "manual" && (
            <>
              {/* ================= BASIC INFO ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="w-full border rounded-xl px-4 py-3" placeholder="First Name" />
                  <input className="w-full border rounded-xl px-4 py-3" placeholder="Last Name" />
                  <input type="email" className="w-full border rounded-xl px-4 py-3" placeholder="Email" />
                  <input className="w-full border rounded-xl px-4 py-3" placeholder="Location (City, Country)" />
                </div>
                <input className="w-full border rounded-xl px-4 py-3 mt-4" placeholder="Professional Headline" />
                <textarea className="w-full border rounded-xl px-4 py-3 mt-4 min-h-32" placeholder="Professional Bio (optional)" />
              </section>

              {/* ================= SKILLS ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Skills</h2>
                {skills.map((s, i) => (
                  <div key={i} className="p-3 bg-lightBlue rounded-xl mb-2">
                    {s.skill} • {s.proficiency} • {s.years} yrs
                  </div>
                ))}
                <div className="grid md:grid-cols-3 gap-4">
                  <input name="skill" value={currentSkill.skill} onChange={handleChange(setCurrentSkill, currentSkill)} className="border p-2 rounded" placeholder="Skill" />
                  <select name="proficiency" value={currentSkill.proficiency} onChange={handleChange(setCurrentSkill, currentSkill)} className="border p-2 rounded">
                    <option value="">Proficiency</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <input name="years" value={currentSkill.years} onChange={handleChange(setCurrentSkill, currentSkill)} className="border p-2 rounded" placeholder="Years" />
                </div>
                <button
                  type="button"
                  onClick={() => addItem(skills, setSkills, currentSkill, () => setCurrentSkill({ skill: "", proficiency: "", years: "" }))}
                  className="mt-3 px-4 py-2 bg-lightBlue rounded"
                >
                  + Add Skill
                </button>
              </section>

              {/* ================= LANGUAGES ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Languages</h2>
                {languages.map((l, i) => (
                  <div key={i} className="p-3 bg-lightBlue rounded-xl mb-2">
                    {l.name} • {l.proficiency}
                  </div>
                ))}
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="name" value={currentLanguage.name} onChange={handleChange(setCurrentLanguage, currentLanguage)} className="border p-2 rounded" placeholder="Language" />
                  <select name="proficiency" value={currentLanguage.proficiency} onChange={handleChange(setCurrentLanguage, currentLanguage)} className="border p-2 rounded">
                    <option value="">Proficiency</option>
                    <option>Basic</option>
                    <option>Conversational</option>
                    <option>Fluent</option>
                    <option>Native</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(languages, setLanguages, currentLanguage, () => setCurrentLanguage({ name: "", proficiency: "" }))}
                  className="mt-3 px-4 py-2 bg-lightBlue rounded"
                >
                  + Add Language
                </button>
              </section>

              {/* ================= EDUCATION ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Education</h2>
                {education.map((e, i) => (
                  <div key={i} className="p-3 bg-lightBlue rounded-xl mb-2">
                    {e.institution} • {e.degree} • {e.fieldOfStudy}
                  </div>
                ))}
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="institution" value={currentEducation.institution} onChange={handleChange(setCurrentEducation, currentEducation)} className="border p-2 rounded" placeholder="Institution" />
                  <input name="degree" value={currentEducation.degree} onChange={handleChange(setCurrentEducation, currentEducation)} className="border p-2 rounded" placeholder="Degree" />
                  <input name="fieldOfStudy" value={currentEducation.fieldOfStudy} onChange={handleChange(setCurrentEducation, currentEducation)} className="border p-2 rounded" placeholder="Field" />
                  <input name="startYear" value={currentEducation.startYear} onChange={handleChange(setCurrentEducation, currentEducation)} className="border p-2 rounded" placeholder="Start Year" />
                  <input name="endYear" value={currentEducation.endYear} onChange={handleChange(setCurrentEducation, currentEducation)} className="border p-2 rounded" placeholder="End Year" />
                </div>
                <button
                  type="button"
                  onClick={() => addItem(education, setEducation, currentEducation, () => setCurrentEducation({ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }))}
                  className="mt-3 px-4 py-2 bg-lightBlue rounded"
                >
                  + Add Education
                </button>
              </section>

              {/* ================= EXPERIENCE ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Work Experience</h2>
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={index} className="border rounded-2xl p-4 space-y-2 bg-lightBlue relative">
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full border text-gray-400 hover:text-gray-600 text-sm"
                      >
                        ×
                      </button>
                      <h3 className="font-semibold text-primary pr-8">{exp.role} at {exp.company}</h3>
                      <p className="text-sm text-gray-500">{exp.startDate} – {exp.endDate || "Present"}</p>
                      {exp.responsibilities && <p className="text-sm">{exp.responsibilities}</p>}
                      {exp.technologies && (
                        <p className="text-xs text-gray-500 bg-white border rounded-lg px-2 py-1 inline-block">
                          Tech: {exp.technologies}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="border rounded-2xl p-4 space-y-4 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input name="company" value={currentExperience.company} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3" placeholder="Company Name" />
                      <input name="role" value={currentExperience.role} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3" placeholder="Role / Position" />
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Start date</label>
                        <input type="month" name="startDate" value={currentExperience.startDate} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">End date (leave blank if current)</label>
                        <input type="month" name="endDate" value={currentExperience.endDate} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3" />
                      </div>
                    </div>
                    <textarea name="responsibilities" value={currentExperience.responsibilities} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3 min-h-24" placeholder="Key responsibilities and achievements" />
                    <input name="technologies" value={currentExperience.technologies} onChange={handleExperienceChange} className="w-full border rounded-xl px-4 py-3" placeholder="Technologies used" />
                  </div>

                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-5 py-3 rounded-xl bg-lightBlue text-primary font-medium hover:opacity-90 transition"
                  >
                    + Add {experiences.length > 0 ? "Another" : ""} Experience
                  </button>
                </div>
              </section>

              {/* ================= CERTIFICATIONS ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Certifications</h2>
                {certifications.map((c, i) => (
                  <div key={i} className="p-3 bg-lightBlue rounded-xl mb-2">
                    {c.name} • {c.issuer} • {c.issueDate}
                  </div>
                ))}
                <div className="grid md:grid-cols-3 gap-4">
                  <input name="name" value={currentCertification.name} onChange={handleChange(setCurrentCertification, currentCertification)} className="border p-2 rounded" placeholder="Name" />
                  <input name="issuer" value={currentCertification.issuer} onChange={handleChange(setCurrentCertification, currentCertification)} className="border p-2 rounded" placeholder="Issuer" />
                  <input name="issueDate" value={currentCertification.issueDate} onChange={handleChange(setCurrentCertification, currentCertification)} className="border p-2 rounded" placeholder="Date" />
                </div>
                <button
                  type="button"
                  onClick={() => addItem(certifications, setCertifications, currentCertification, () => setCurrentCertification({ name: "", issuer: "", issueDate: "" }))}
                  className="mt-3 px-4 py-2 bg-lightBlue rounded"
                >
                  + Add Certification
                </button>
              </section>

              {/* ================= PROJECTS ================= */}
              <section>
                <h2 className="text-xl font-semibold text-primary mb-4">Projects</h2>
                {projects.map((p, i) => (
                  <div key={i} className="p-3 bg-lightBlue rounded-xl mb-2">
                    {p.name} • {p.role}
                  </div>
                ))}
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="name" value={currentProject.name} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Project Name" />
                  <input name="role" value={currentProject.role} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Role" />
                  <input name="link" value={currentProject.link} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Link" />
                  <input name="startDate" value={currentProject.startDate} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Start" />
                  <input name="endDate" value={currentProject.endDate} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="End" />
                  <textarea name="description" value={currentProject.description} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Desc" />
                  <input name="technologies" value={currentProject.technologies} onChange={handleChange(setCurrentProject, currentProject)} className="border p-2 rounded" placeholder="Tech" />
                </div>
                <button
                  type="button"
                  onClick={() => addItem(projects, setProjects, currentProject, () => setCurrentProject({ name: "", description: "", role: "", link: "", startDate: "", endDate: "", technologies: "" }))}
                  className="mt-3 px-4 py-2 bg-lightBlue rounded"
                >
                  + Add Project
                </button>
              </section>
            </>
          )}

          <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:opacity-90 transition">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}