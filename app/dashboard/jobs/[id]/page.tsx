"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { jobs } from "@/data/jobs";
import { applicants as allApplicants, Applicant, dummyScreeningResults, AIResult } from "@/lib/dummyData";
import Link from "next/link";

export default function JobDetailPage() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);
  const jobApplicants = allApplicants.filter((a) => a.appliedJobId === id);

  // Upload state
  const [dragOver, setDragOver] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Screening state
  const [screening, setScreening] = useState(false);
  const [screened, setScreened] = useState(false);
  const [results, setResults] = useState<AIResult[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [screeningError, setScreeningError] = useState("");

  if (!job) return <p className="text-gray-500">Job not found.</p>;

  // ── FILE UPLOAD → BACKEND ─────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploadError("");
    setUploadSuccess("");

    const allowed = [".csv", ".xlsx", ".xls"];
    if (!allowed.some((ext) => file.name.endsWith(ext))) {
      setUploadError("Only CSV or Excel files are accepted.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobId", id as string);

      const res = await fetch("/api/applicants/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setUploadSuccess(`✅ ${data.count ?? "All"} applicants uploaded successfully.`);
      setShowUploadPanel(false);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  // ── AI SCREENING (dummy) ──────────────────────────────────
  const runScreening = () => {
    setScreening(true);
    setScreeningError("");
    setResults([]);
    setScreened(false);

    // Simulate API delay
    setTimeout(() => {
      const jobResults = dummyScreeningResults[id as string];

      if (!jobResults || jobResults.length === 0) {
        setScreeningError("No screening data available for this job.");
        setScreening(false);
        return;
      }

      setResults(jobResults.sort((a, b) => a.rank - b.rank));
      setScreened(true);
      setScreening(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">

      {/* Job Header */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company} · Deadline: {job.deadline}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => { setShowUploadPanel((p) => !p); setUploadError(""); setUploadSuccess(""); }}
              className="px-5 py-3 rounded-xl border border-primary text-primary font-medium hover:bg-lightBlue transition flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload CSV / Excel
            </button>
            <button
              onClick={runScreening}
              disabled={screening || jobApplicants.length === 0}
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center gap-2"
            >
              {screening ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Screening...
                </>
              ) : screened ? "🔄 Re-run Screening" : "✨ Run AI Screening"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {job.skills.map((s) => (
            <span key={s} className="text-xs bg-lightBlue text-primary px-3 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Upload Applicants</h2>
          <div className="bg-lightBlue rounded-xl px-4 py-3 text-xs text-primary space-y-1">
            <p className="font-semibold">Accepted formats: CSV, Excel (.xlsx, .xls)</p>
            <p className="mt-1">Required columns: <span className="font-medium">name, email</span></p>
            <p>Optional: location, headline, skills, experience, education</p>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition
              ${dragOver ? "border-primary bg-lightBlue" : "border-gray-200 hover:border-primary hover:bg-lightBlue"}`}
          >
            <svg className="mx-auto mb-3 text-gray-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {uploading ? (
              <p className="text-sm text-primary font-medium animate-pulse">Uploading...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 font-medium">Drag & drop your file here</p>
                <p className="text-xs text-gray-400 mt-1">or click to browse · CSV, XLSX, XLS</p>
              </>
            )}
            <input id="fileInput" type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
          </div>
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{uploadError}</div>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{uploadSuccess}</div>
      )}

      {screeningError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{screeningError}</div>
      )}

      {/* Screening loading animation */}
      {screening && (
        <div className="bg-white border rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-lightBlue border-t-primary animate-spin" />
          <div className="text-center">
            <p className="font-semibold text-gray-800">AI is screening candidates...</p>
            <p className="text-sm text-gray-400 mt-1">Analyzing skills, experience, and fit for the role</p>
          </div>
        </div>
      )}

      {/* AI Results */}
      {results.length > 0 && (
        <div className="bg-white border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-lg">🏆 AI Shortlist</h2>
            <span className="text-xs text-gray-400">{results.length} candidates ranked</span>
          </div>
          <div className="space-y-3">
            {results.map((r) => {
              const applicant = jobApplicants.find((a) => a.id === r.id);
              if (!applicant) return null;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedApplicant(applicant)}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary hover:bg-lightBlue transition cursor-pointer"
                >
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                    ${r.rank === 1 ? "bg-yellow-100 text-yellow-600" :
                      r.rank === 2 ? "bg-gray-100 text-gray-500" :
                      r.rank === 3 ? "bg-orange-100 text-orange-500" :
                      "bg-lightBlue text-primary"}`}>
                    {r.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {applicant.name.split(" ").map((n) => n[0]).join("")}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{applicant.name}</p>
                    <p className="text-xs text-gray-400 truncate">{applicant.headline}</p>
                    {/* Score bar */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            r.score >= 80 ? "bg-green-500" :
                            r.score >= 60 ? "bg-yellow-400" : "bg-red-400"
                          }`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold shrink-0 ${
                        r.score >= 80 ? "text-green-600" :
                        r.score >= 60 ? "text-yellow-500" : "text-red-500"
                      }`}>
                        {r.score}/100
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg className="text-gray-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reasoning Modal */}
      {selectedApplicant && (() => {
        const result = results.find((r) => r.id === selectedApplicant.id);
        return (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApplicant(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {selectedApplicant.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedApplicant.name}</p>
                    <p className="text-xs text-gray-400">{selectedApplicant.headline}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>

              {result && (
                <div className="px-6 py-5 space-y-4">
                  {/* Score */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Match Score</p>
                      <p className={`text-3xl font-bold ${
                        result.score >= 80 ? "text-green-600" :
                        result.score >= 60 ? "text-yellow-500" : "text-red-500"
                      }`}>
                        {result.score}<span className="text-base text-gray-400 font-normal">/100</span>
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            result.score >= 80 ? "bg-green-500" :
                            result.score >= 60 ? "bg-yellow-400" : "bg-red-400"
                          }`}
                          style={{ width: `${result.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Rank #{result.rank} overall</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-1">
                    <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                      ✅ Strengths
                    </p>
                    <p className="text-sm text-green-800 leading-relaxed">{result.strengths}</p>
                  </div>

                  {/* Gaps */}
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">
                    <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
                      ⚠️ Gaps / Risks
                    </p>
                    <p className="text-sm text-red-700 leading-relaxed">{result.gaps}</p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-1">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1">
                      💡 Final Recommendation
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">{result.recommendation}</p>
                  </div>

                  {/* View full profile */}
                  <Link href={`/dashboard/applicants/${selectedApplicant.id}`}>
                    <button className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-lightBlue transition mt-2">
                      View Full Profile →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* All Applicants */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">All Applicants ({jobApplicants.length})</h2>
        <div className="space-y-3">
          {jobApplicants.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border group">
              <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                {a.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{a.name}</p>
                <p className="text-xs text-gray-400">{a.headline}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {a.skills.slice(0, 3).map((s) => (
                    <span key={s.skill} className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full">
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Show AI score badge if screened */}
                {screened && (() => {
                  const r = results.find((res) => res.id === a.id);
                  return r ? (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      r.score >= 80 ? "bg-green-100 text-green-600" :
                      r.score >= 60 ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-500"
                    }`}>
                      {r.score}/100
                    </span>
                  ) : null;
                })()}
                <span className={`text-xs px-2 py-1 rounded-full font-medium
                  ${a.status === "shortlisted" ? "bg-green-100 text-green-600" :
                    a.status === "rejected" ? "bg-red-100 text-red-500" :
                    "bg-yellow-100 text-yellow-600"}`}>
                  {a.status}
                </span>
                <Link href={`/dashboard/applicants/${a.id}`}>
                  <button className="text-xs text-primary border border-primary px-2 py-1 rounded-lg hover:bg-lightBlue transition opacity-0 group-hover:opacity-100">
                    View
                  </button>
                </Link>
              </div>
            </div>
          ))}
          {jobApplicants.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No applicants yet. Upload a file to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}