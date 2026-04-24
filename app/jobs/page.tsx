"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  company: string;
  description?: string;
  deadline?: string;
  skills?: string[];
}

export default function JobsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
  console.log("API_URL:", API_URL);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // ───── FETCH JOBS ─────
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs`);
        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();

        console.log("Fetched jobs:", data);

        // handle different response shapes safely
        const jobsArray = data?.jobs || data || [];

        setJobs(jobsArray);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ───── STATES ─────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading jobs...
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No jobs available.
      </div>
    );
  }

  // ───── UI ─────
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">
        Available Positions
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md p-6 border"
          >
            <h2 className="text-xl font-bold text-primary">
              {job.title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {job.company}
            </p>

            <p className="text-gray-600 mt-4">
              {job.description || "No description available."}
            </p>

            {job.deadline && (
              <p className="text-sm text-red-500 mt-2">
                Deadline: {job.deadline}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              {(job.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-lightBlue text-primary text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <Link href={`/jobs/${job._id}`}>
              <button className="mt-6 px-5 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition">
                Check Job
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}