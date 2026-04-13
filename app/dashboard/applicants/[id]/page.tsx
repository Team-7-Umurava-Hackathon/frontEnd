"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { applicants } from "@/lib/dummyData";
import { jobs } from "@/data/jobs";
import Link from "next/link";

const proficiencyColor: Record<string, string> = {
  Expert: "bg-green-100 text-green-700",
  Advanced: "bg-blue-100 text-primary",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Beginner: "bg-gray-100 text-gray-600",
};

const languageProficiencyColor: Record<string, string> = {
  Native: "bg-purple-100 text-purple-700",
  Fluent: "bg-green-100 text-green-700",
  Conversational: "bg-yellow-100 text-yellow-700",
  Basic: "bg-gray-100 text-gray-600",
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-500",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-gray-800 text-base border-b pb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const applicant = applicants.find((a) => a.id === id);
  const [status, setStatus] = useState(applicant?.status ?? "pending");

  if (!applicant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-lg">Applicant not found.</p>
        <Link href="/dashboard/applicants" className="mt-4 text-primary text-sm hover:underline">
          ← Back to Applicants
        </Link>
      </div>
    );
  }

  const job = jobs.find((j) => j.id === applicant.appliedJobId);
  const initials = applicant.name.split(" ").map((n) => n[0]).join("");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present";
    const [year, month] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex flex-wrap items-start gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-gray-800">{applicant.name}</h1>
              <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusStyles[status]}`}>
                {status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{applicant.headline}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {applicant.location}
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                {applicant.email}
              </span>
              {job && (
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  Applied for <span className="text-primary font-medium">{job.title}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setStatus("shortlisted")}
              disabled={status === "shortlisted"}
              className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✅ Shortlist
            </button>
            <button
              onClick={() => setStatus("rejected")}
              disabled={status === "rejected"}
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✗ Reject
            </button>
          </div>
        </div>

        {/* Bio */}
        {applicant.bio && (
          <p className="mt-4 text-sm text-gray-600 border-t pt-4">{applicant.bio}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Experience */}
          <SectionCard title="Work Experience">
            <div className="space-y-5">
              {applicant.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-lightBlue">
                  <p className="font-semibold text-gray-800 text-sm">{exp.role}</p>
                  <p className="text-sm text-primary font-medium">{exp.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{exp.responsibilities}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.technologies.split(",").map((t) => (
                      <span key={t} className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard title="Education">
            <div className="space-y-4">
              {applicant.education.map((edu, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-lightBlue">
                  <p className="font-semibold text-gray-800 text-sm">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-sm text-primary font-medium">{edu.institution}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{edu.startYear} – {edu.endYear}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Projects */}
          <SectionCard title="Projects">
            <div className="space-y-4">
              {applicant.projects.map((proj, i) => (
                <div key={i} className="p-4 rounded-xl bg-lightBlue space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{proj.name}</p>
                      <p className="text-xs text-gray-500">{proj.role}</p>
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs hover:underline shrink-0 flex items-center gap-1"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        View
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies.split(",").map((t) => (
                      <span key={t} className="text-xs bg-white text-primary px-2 py-0.5 rounded-full border">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Skills */}
          <SectionCard title="Skills">
            <div className="space-y-2">
              {applicant.skills.map((s) => (
                <div key={s.skill} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.skill}</p>
                    <p className="text-xs text-gray-400">{s.years} yr{Number(s.years) > 1 ? "s" : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${proficiencyColor[s.proficiency] ?? "bg-gray-100 text-gray-600"}`}>
                    {s.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Languages */}
          <SectionCard title="Languages">
            <div className="space-y-2">
              {applicant.languages.map((l) => (
                <div key={l.name} className="flex items-center justify-between">
                  <p className="text-sm text-gray-800">{l.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${languageProficiencyColor[l.proficiency] ?? "bg-gray-100 text-gray-600"}`}>
                    {l.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Certifications */}
          {applicant.certifications.length > 0 && (
            <SectionCard title="Certifications">
              <div className="space-y-3">
                {applicant.certifications.map((cert, i) => (
                  <div key={i} className="p-3 rounded-xl bg-lightBlue">
                    <p className="text-sm font-medium text-gray-800">{cert.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cert.issuer} · {formatDate(cert.issueDate)}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Applied Job */}
          {job && (
            <SectionCard title="Applied Position">
              <div className="space-y-2">
                <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                <p className="text-xs text-gray-500">{job.company}</p>
                <p className="text-xs text-gray-400">Deadline: {job.deadline}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.skills.map((s) => (
                    <span key={s} className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <Link href={`/dashboard/jobs/${job.id}`}>
                  <button className="w-full mt-2 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-lightBlue transition">
                    View Job & Screening
                  </button>
                </Link>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}