"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Talent {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  skills: { name: string }[];
  createdAt: string;
  job: {
    _id: string;
    title: string;
    company?: string;
  };
}

interface AIResult {
  _id?: string;
  candidateId: string;
  talentId?: any; 
  rank: number;
  matchScore: number;
  summary?: string;
  recommendationLevel?: string;
  gaps?: string[];
  strengths?: string[];
  finalRecommendation?: string;
}

export default function JobDetailPage() {
  const { id } = useParams();
   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobApplicants, setJobApplicants] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);

  const [dragOver, setDragOver] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [screening, setScreening] = useState(false);
  const [results, setResults] = useState<AIResult[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Talent | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<AIResult | null>(null);

  // ───────────────── FETCH APPLICANTS ─────────────────
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
     try {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    console.error("No token found");
    return;
  }

  const res = await fetch(`${API_URL}/talents/job/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  console.log("Fetched talents:", data?.talents);

  const talents = (data?.talents || []).map((t: any) => ({
    ...t,
    job: {
      _id: t.job?._id,
      title: t.job?.title || "N/A",
      company: t.job?.company || "N/A",
    },
  }));

  setJobApplicants(talents);

}  catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ───────────────── FETCH SAVED RANKINGS ─────────────────
  const fetchRankings = async () => {
    try {
    const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ranking/job/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (!res.ok) return;

      const data = await res.json();
      setResults(data?.rankings || []);
    } catch (err) {
      console.error("Ranking fetch error:", err);
    }
  };

  // load rankings on page load
  useEffect(() => {
    if (id) fetchRankings();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  if (!jobApplicants.length) {
    return <p className="text-gray-500">No applicants found for this job.</p>;
  }

  const job = jobApplicants[0]?.job;

  // ───────────────── RUN AI SCORING ─────────────────
  const runScreening = async () => {
    setScreening(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/ranking/score-candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: id,
          topN: 5,
        }),
      });

      if (!res.ok) throw new Error("Failed ranking");

      const data = await res.json();

      setResults(data?.rankings || data?.data || []);

      // refresh saved rankings
      await fetchRankings();
    } catch (err) {
      console.error(err);
    } finally {
      setScreening(false);
    }
  };

  // ───────────────── FILE UPLOAD ─────────────────
  const uploadFile = async (file: File) => {
  setUploadError("");
  setUploadSuccess("");

  const allowed = [".csv", ".xlsx", ".xls"];
  if (!allowed.some((ext) => file.name.toLowerCase().endsWith(ext))) {
    setUploadError("Only CSV or Excel files are accepted.");
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    // 👇 IMPORTANT: backend expects jobId in body
    formData.append("jobId", id as string);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_URL}/talents/upload/excel?type=xls`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Upload failed");
    }

    const data = await res.json();
    console.log("Upload response:", data);

    setUploadSuccess("Applicants uploaded successfully.");
    setSelectedFile(null); // clear selected file
    setShowUploadPanel(false);

    // 🔄 refresh applicants (use SAME endpoint you used initially)
    
    const refreshed = await fetch(`${API_URL}/talents/job/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const refreshedData = await refreshed.json();

    setJobApplicants(refreshedData?.talents || []);

  } catch (err: any) {
    console.error(err);
    setUploadError(err.message || "Upload failed.");
  } finally {
    setUploading(false);
  }
};

 const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setDragOver(false);

  const file = e.dataTransfer.files?.[0];
  if (file) {
    setSelectedFile(file); // 👈 same behavior as click
  }
};

  // Get recommendation level color
  const getRecommendationColor = (level?: string) => {
    switch (level) {
      case "Highly Recommended":
        return "bg-green-100 text-green-700";
      case "Recommended":
        return "bg-blue-100 text-blue-700";
      case "Consider":
        return "bg-yellow-100 text-yellow-700";
      case "Not Recommended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file); // 👈 store it
    setUploadError("");
    setUploadSuccess("");
  }
};

  // ───────────────── UI ─────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{job?.title}</h1>
            <p className="text-gray-500">{job?.company}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowUploadPanel((p) => !p)}
              className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
            >
              Upload CSV
            </button>

            <button
              onClick={runScreening}
              disabled={screening}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {screening ? "Scoring..." : "Run AI Ranking"}
            </button>
          </div>
        </div>
      </div>

      {/* Upload */}
      {showUploadPanel && (
  <div className="space-y-4">
    
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      className={`border-dashed border-2 p-10 text-center rounded-2xl transition cursor-pointer ${
        dragOver ? "bg-blue-50 border-primary" : "bg-gray-50 border-gray-300"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv, .xlsx, .xls"
        onChange={handleFileSelect}
      />

      {uploading ? (
        <p className="text-gray-600">Uploading...</p>
      ) : (
        <div>
          <p className="text-gray-600 font-medium">
            Drop file here or click to upload
          </p>
          <p className="text-sm text-gray-400 mt-1">
            CSV or Excel files only
          </p>
        </div>
      )}
    </div>

    {/* 👇 SHOW SELECTED FILE */}
    {selectedFile && (
      <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-3">
        <p className="text-sm text-gray-700">{selectedFile.name}</p>

        <button
          onClick={() => uploadFile(selectedFile)} // 👈 send file
          disabled={uploading}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Send"}
        </button>
      </div>
    )}
  </div>
)}

      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
          {uploadError}
        </div>
      )}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl">
          {uploadSuccess}
        </div>
      )}

      {/* ───────────────── TOP RANKED ───────────────── */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-bold mb-4 text-lg">🏆 Top Ranked Candidates</h2>

        {results.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No screening done yet. Click "Run AI Ranking" to score candidates.
          </p>
        ) : (
          results
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 10)
            .map((r) => {
              const candidateId =
                typeof r.talentId === "string"
                  ? r.talentId
                  : r.talentId?._id;

              const applicant = jobApplicants.find(
                (a) => a._id === candidateId
              );

              if (!applicant) return null;

              return (
                <div
                  key={candidateId}
                  className="flex justify-between items-center p-4 border rounded-xl mb-3 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => {
                    setSelectedRanking(r);
                    setSelectedApplicant(applicant);
                  }}
                >
                  <div>
                    <p className="font-medium">
                      #{r.rank} - {applicant.firstName} {applicant.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {applicant.headline}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-primary block text-lg">
                      {r.matchScore}/100
                    </span>
                    {r.recommendationLevel && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium mt-1 inline-block ${getRecommendationColor(
                          r.recommendationLevel
                        )}`}
                      >
                        {r.recommendationLevel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* ───────────────── ALL APPLICANTS ───────────────── */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-bold mb-4 text-lg">
          All Applicants ({jobApplicants.length})
        </h2>

        {jobApplicants.map((a) => (
          <div
            key={a._id}
            className="p-4 border rounded-xl mb-3 flex justify-between items-start hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <p className="font-medium">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-xs text-gray-400">{a.headline}</p>

              <div className="flex gap-1 mt-2">
                {a.skills.slice(0, 3).map((s) => (
                  <span
                    key={s.name}
                    className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full"
                  >
                    {s.name}
                  </span>
                ))}
                {a.skills.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    +{a.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            <Link href={`/dashboard/applicants/${a._id}`}>
              <button className="text-sm text-primary font-medium hover:underline ml-4">
                View Profile
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* ───────────────── RANKING DETAIL MODAL ───────────────── */}
      {selectedRanking && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedRanking(null);
            setSelectedApplicant(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-gray-800 text-xl">
                  Candidate Ranking Details
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedRanking(null);
                  setSelectedApplicant(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">

              {/* Candidate Info */}
              {selectedApplicant && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
                  <p className="text-2xl font-bold text-gray-800">
                    {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </p>
                  <p className="text-gray-600 mt-1">{selectedApplicant.headline}</p>
                </div>
              )}

              {/* Ranking Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-medium">Rank</p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    #{selectedRanking.rank}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs text-green-600 font-medium">Match Score</p>
                  <p className="text-3xl font-bold text-green-700 mt-1">
                    {selectedRanking.matchScore}%
                  </p>
                </div>
                <div
                  className={`${getRecommendationColor(
                    selectedRanking.recommendationLevel
                  )} border rounded-xl p-4`}
                >
                  <p className="text-xs font-medium">Recommendation</p>
                  <p className="text-sm font-bold mt-1">
                    {selectedRanking.recommendationLevel || "N/A"}
                  </p>
                </div>
              </div>

              {/* Final Recommendation */}
              {selectedRanking.finalRecommendation && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Recommendation
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedRanking.finalRecommendation}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {selectedRanking.strengths && selectedRanking.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    ✅ Strengths
                  </h3>
                  <ul className="space-y-2">
                    {selectedRanking.strengths.map((strength, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <span className="text-green-600 font-bold mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gaps */}
              {selectedRanking.gaps && selectedRanking.gaps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    ⚠️ Areas for Development
                  </h3>
                  <ul className="space-y-2">
                    {selectedRanking.gaps.map((gap, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <span className="text-amber-600 font-bold mt-0.5">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t flex gap-3 justify-between sticky bottom-0 bg-white">
              {selectedApplicant && (
                <Link
                  href={`/dashboard/applicants/${selectedApplicant._id}`}
                  onClick={() => {
                    setSelectedRanking(null);
                    setSelectedApplicant(null);
                  }}
                >
                  <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition">
                    View Full Profile
                  </button>
                </Link>
              )}
              <button
                onClick={() => {
                  setSelectedRanking(null);
                  setSelectedApplicant(null);
                }}
                className="px-5 py-2.5 border rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
