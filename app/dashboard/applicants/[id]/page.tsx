"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

function SectionCard({ title, children }: any) {
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

  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await fetch(`${API_URL}/talents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setTalent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTalent();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!talent) {
    return (
      <div className="p-6 text-center">
        <p>Applicant not found</p>
      </div>
    );
  }

  const initials = `${talent.firstName[0]}${talent.lastName[0]}`;
  console.log(talent);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "Present") return "Present";
    const [year, month] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      "en-US",
      { month: "short", year: "numeric" }
    );
  };
  const downloadUrl = `${talent.resumeFile}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Back */}
      <button onClick={() => router.back()} className="text-sm text-gray-500">
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex gap-5">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center">
            {initials}
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold">
              {talent.firstName} {talent.lastName}
            </h1>
            <p className="text-gray-500">{talent.headline}</p>

            <div className="mt-2 text-sm text-gray-500 space-y-1">
              <p>{talent.location}</p>
              <p>{talent.email}</p>
              <p>
                Applied for{" "}
                <span className="text-primary font-medium">
                  {talent.job?.title}
                </span>
              </p>
            </div>
            <div className="mt-4 border-t pt-4 space-y-2">
  {/* STRUCTURE STATUS */}
  {talent.structured ? (
    <p className="text-green-600 font-medium text-sm">
      Structured CV
    </p>
  ) : (
    <div className="space-y-1">
      <p className="text-red-600 font-medium text-sm">
        Unstructured CV
      </p>

      {/* CV LINK */}
      {talent.resumeFile && (
        <a
         href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm underline hover:opacity-80"
        >
          View CV
        </a>
      )}
    </div>
  )}
</div>
          </div>
        </div>

        {talent.bio && (
          <p className="mt-4 text-gray-600 border-t pt-4">{talent.bio}</p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* EXPERIENCE */}
          <SectionCard title="Work Experience">
            {talent.experience?.map((exp: any, i: number) => (
              <div key={i}>
                <p className="font-semibold">{exp.role}</p>
                <p className="text-primary">{exp.company}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                </p>
                <p className="text-sm text-gray-600">{exp.description}</p>

                <div className="flex gap-1 mt-2">
                  {exp.technologies?.map((t: string) => (
                    <span key={t} className="text-xs bg-lightBlue px-2 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SectionCard>

          {/* EDUCATION */}
          <SectionCard title="Education">
            {talent.education?.map((edu: any, i: number) => (
              <div key={i}>
                <p>
                  {edu.degree} in {edu.fieldOfStudy}
                </p>
                <p className="text-primary">{edu.institution}</p>
                <p className="text-xs text-gray-400">
                  {edu.startYear} – {edu.endYear}
                </p>
              </div>
            ))}
          </SectionCard>

          {/* PROJECTS */}
          <SectionCard title="Projects">
            {talent.projects?.map((proj: any, i: number) => (
              <div key={i}>
                <p className="font-semibold">{proj.name}</p>
                <p className="text-sm">{proj.description}</p>

                <div className="flex gap-1 mt-2">
                  {proj.technologies?.map((t: string) => (
                    <span key={t} className="text-xs bg-lightBlue px-2 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* SKILLS */}
          <SectionCard title="Skills">
            {talent.skills?.map((s: any) => (
              <div key={s.name} className="flex justify-between">
                <div>
                  <p>{s.name}</p>
                  <p className="text-xs text-gray-400">
                    {s.yearsOfExperience} yrs
                  </p>
                </div>
                <span
                  className={`text-xs px-2 rounded ${proficiencyColor[s.level]}`}
                >
                  {s.level}
                </span>
              </div>
            ))}
          </SectionCard>

          {/* LANGUAGES */}
          <SectionCard title="Languages">
            {talent.languages?.map((l: any) => (
              <div key={l.name} className="flex justify-between">
                <p>{l.name}</p>
                <span
                  className={`text-xs px-2 rounded ${languageProficiencyColor[l.proficiency]}`}
                >
                  {l.proficiency}
                </span>
              </div>
            ))}
          </SectionCard>

          {/* CERTIFICATIONS */}
          {talent.certifications?.length > 0 && (
            <SectionCard title="Certifications">
              {talent.certifications.map((c: any, i: number) => (
                <p key={i}>
                  {c.name} - {c.issuer}
                </p>
              ))}
            </SectionCard>
          )}

          {/* JOB */}
          {talent.job && (
            <SectionCard title="Applied Position">
              <p className="font-medium">{talent.job.title}</p>
              <p className="text-sm text-gray-500">{talent.job.company}</p>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}