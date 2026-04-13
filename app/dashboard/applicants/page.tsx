"use client";

import { useState } from "react";
import { applicants } from "@/lib/dummyData";
import { jobs } from "@/data/jobs";
import { useRouter } from "next/navigation";


export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const filtered = applicants.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.headline.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Applicants</h1>
        <p className="text-sm text-gray-500 mt-1">All candidates across your job listings.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicants..." className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "shortlisted", "rejected"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition
                ${filter === s ? "bg-primary text-white" : "bg-white border text-gray-600 hover:bg-lightBlue"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-gray-500 font-medium">Candidate</th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium hidden md:table-cell">Applied For</th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium hidden lg:table-cell">Skills</th>
              <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => {
              const job = jobs.find((j) => j.id === a.appliedJobId);
              return (
                <tr
                  key={a.id}
                  onClick={() => router.push(`/dashboard/applicants/${a.id}`)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {a.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 hidden md:table-cell">{job?.title}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {a.skills.slice(0, 2).map((s) => (
                        <span key={s.skill} className="text-xs bg-lightBlue text-primary px-2 py-0.5 rounded-full">{s.skill}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${a.status === "shortlisted" ? "bg-green-100 text-green-600" :
                        a.status === "rejected" ? "bg-red-100 text-red-500" :
                        "bg-yellow-100 text-yellow-600"}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">No applicants found.</p>
        )}
      </div>
    </div>
  );
}