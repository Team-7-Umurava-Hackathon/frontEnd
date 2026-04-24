"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Talent {
  _id: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: string;
  skills: Array<{ name: string; level: string }>;
  job: Job;
  createdAt: string;
}

interface Job {
  _id: string;
  title: string;
}

export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [talents, setTalents] = useState<Talent[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch talents
        const talentsRes = await fetch(`${API_URL}/talents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!talentsRes.ok) throw new Error("Failed to fetch talents");
        const talentsData = await talentsRes.json();
        setTalents(talentsData.talents || []);

        // Fetch jobs
        const jobsRes = await fetch(`${API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);

        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  // Filter talents
  const filtered = talents.filter((talent) => {
    const matchSearch =
      `${talent.firstName} ${talent.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      talent.headline.toLowerCase().includes(search.toLowerCase());

    // For now, filter is just showing all since we don't have status field
    // This would need to be updated when you add status to Talent model
    return matchSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <p className="text-red-500 text-sm mt-2">Make sure your backend is running at {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
        <p className="text-sm text-gray-500 mt-1">All candidates across your job listings. ({talents.length} total)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Status filter - disabled for now since Talent model doesn't have status */}
        {/* <div className="flex gap-2">
          {["all", "pending", "shortlisted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition
                ${filter === s ? "bg-primary text-white" : "bg-white border text-gray-600 hover:bg-lightBlue"}`}
            >
              {s}
            </button>
          ))}
        </div> */}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-gray-500 font-medium">
                Candidate
              </th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium hidden md:table-cell">
                Applied For
              </th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium hidden lg:table-cell">
                Skills
              </th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium">
                Applied Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((talent) => {
              console.log("Rendering talent:", talent);
              const job = jobs.find((j) => j._id === talent.job._id);
              const appliedDate = new Date(talent.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );
              const initials = `${talent.firstName[0]}${talent.lastName[0]}`.toUpperCase();

              return (
                <tr
                  key={talent._id}
                  onClick={() => router.push(`/dashboard/applicants/${talent._id}`)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {talent.firstName} {talent.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{talent.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                    {talent.job.title || "N/A"}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {talent.skills.slice(0, 2).map((s) => (
                        <span
                          key={s.name}
                          className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full"
                        >
                          {s.name}
                        </span>
                      ))}
                      {talent.skills.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          +{talent.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="text-xs">{appliedDate}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            {talents.length === 0
              ? "No applicants yet. They will appear here when talents are added."
              : "No applicants found matching your search."}
          </p>
        )}
      </div>
    </div>
  );
}
