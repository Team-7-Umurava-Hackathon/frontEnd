"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  applicationDeadline: string;
}

interface Talent {
  _id: string;
  firstName: string;
  lastName: string;
  job: string | {
    _id: string;
    title?: string;
  };
  createdAt: string;
  structured?: boolean;
  // Add other fields as needed
}

interface Ranking {
  _id: string;
  talentId: Talent;
  jobId: Job;
  rank: number;
  matchScore: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    unstructuredCount: 0,
    pending: 0,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<{ [key: string]: number }>({});
  const [recentApplicants, setRecentApplicants] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch jobs
        const jobsRes = await fetch(`${API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!jobsRes.ok) throw new Error("Failed to fetch jobs");
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);

        // Fetch talents (applicants)
        const talentsRes = await fetch(`${API_URL}/talents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!talentsRes.ok) throw new Error("Failed to fetch talents");
        const talentsData = await talentsRes.json();
        const talents = talentsData.talents || [];

        // Count applicants by job
        const counts: { [key: string]: number } = {};
        talents.forEach((talent: Talent) => {
 const jobId =
  typeof talent.job === "string"
    ? talent.job
    : talent.job?._id;

  if (!jobId) return;

  counts[jobId] = (counts[jobId] || 0) + 1;
});
        setApplicantCounts(counts);

        // Get latest 4 applicants (sorted by creation date, newest first)
        const latest = talents
          .sort((a: Talent, b: Talent) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);

        setRecentApplicants(latest);
          
        // Calculate stats
        const totalApplicants = talents.length;
         const unstructuredCount = talents.filter((talent: Talent) => !talent.structured).length;  
        setStats({
          totalJobs: jobsData.jobs?.length || 0,
          totalApplicants,
          unstructuredCount: unstructuredCount,
          pending: totalApplicants,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const statsArray = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
      ),
      color: "bg-blue-50 text-primary",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Unstructured Resumes",
      value: stats.unstructuredCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ),
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      color: "bg-orange-50 text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Loading dashboard data...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Error loading dashboard</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <p className="text-red-500 text-sm mt-2">Make sure your backend is running at {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your recruitment pipeline.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsArray.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs + Recent Applicants */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Active Jobs */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Active Jobs</h2>
            <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.map((job) => {
                const count = applicantCounts[job._id] || 0;
                const deadline = new Date(job.applicationDeadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <Link href={`/dashboard/jobs/${job._id}`} key={job._id}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-lightBlue hover:bg-blue-100 transition cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Deadline: {deadline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{count}</p>
                        <p className="text-xs text-gray-400">applicants</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm py-4">No active jobs yet</p>
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Applicants</h2>
            <Link href="/dashboard/applicants" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentApplicants.length > 0 ? (
              recentApplicants.map((talent) => {
                const initials = `${talent.firstName?.[0] || ""}${talent.lastName?.[0] || ""}`.toUpperCase();
                const jobTitle = jobs.find(j => j._id === talent.job)?.title || "Applied Position";
                const appliedDate = new Date(talent.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={talent._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {talent.firstName} {talent.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{jobTitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">{appliedDate}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm py-4">No recent applicants yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
