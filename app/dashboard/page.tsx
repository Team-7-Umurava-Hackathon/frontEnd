"use client";

import { applicants } from "@/lib/dummyData";
import { jobs } from "@/data/jobs";
import Link from "next/link";

const stats = [
  {
    label: "Total Jobs",
    value: jobs.length,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    color: "bg-blue-50 text-primary",
  },
  {
    label: "Total Applicants",
    value: applicants.length,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Shortlisted",
    value: applicants.filter((a) => a.status === "shortlisted").length,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    label: "Pending Review",
    value: applicants.filter((a) => a.status === "pending").length,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    color: "bg-orange-50 text-orange-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your recruitment pipeline.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
            {jobs.map((job) => {
              const count = applicants.filter((a) => a.appliedJobId === job.id).length;
              return (
                <Link href={`/dashboard/jobs/${job.id}`} key={job.id}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-lightBlue hover:bg-blue-100 transition cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Deadline: {job.deadline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{count}</p>
                      <p className="text-xs text-gray-400">applicants</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Applicants</h2>
            <Link href="/dashboard/applicants" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {applicants.slice(0, 4).map((a) => {
              const job = jobs.find((j) => j.id === a.appliedJobId);
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {a.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
                    <p className="text-xs text-gray-400 truncate">{job?.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                    ${a.status === "shortlisted" ? "bg-green-100 text-green-600" :
                      a.status === "rejected" ? "bg-red-100 text-red-500" :
                      "bg-yellow-100 text-yellow-600"}`}>
                    {a.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}