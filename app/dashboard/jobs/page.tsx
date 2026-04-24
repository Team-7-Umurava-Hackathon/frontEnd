"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Job = {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  skills: string[];
  requirements: string[];
  experience: string;
  applicationDeadline: string;
};

const EMPTY_JOB: Omit<Job, "_id"> = {
  title: "",
  company: "",
  description: "",
  location: "",
  skills: [],
  requirements: [],
  experience: "",
  applicationDeadline: "",
};

type ModalMode = "add" | "edit" | null;

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState(EMPTY_JOB);
  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
        setError("");
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobs();
    }
  }, [token]);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  // ── MODAL HELPERS ─────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_JOB);
    setSkillInput("");
    setRequirementInput("");
    setEditingJob(null);
    setModalMode("add");
  };

  const openEdit = (job: Job) => {
    setForm({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      skills: [...job.skills],
      requirements: [...job.requirements],
      experience: job.experience,
      applicationDeadline: job.applicationDeadline,
    });
    setSkillInput("");
    setRequirementInput("");
    setEditingJob(job);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingJob(null);
  };

  // ── TAGS (skills / requirements) ──────────────────────────
  const addTag = (field: "skills" | "requirements", value: string) => {
    const trimmed = value.trim();
    if (!trimmed || form[field].includes(trimmed)) return;
    setForm((p) => ({ ...p, [field]: [...p[field], trimmed] }));
  };

  const removeTag = (field: "skills" | "requirements", value: string) => {
    setForm((p) => ({ ...p, [field]: p[field].filter((v) => v !== value) }));
  };

  // ── SAVE ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim() || !form.applicationDeadline.trim()) return;

    setSaving(true);
    try {
      // Prepare payload - only send fields the API expects
      const payload = {
        title: form.title,
        company: form.company,
        description: form.description,
        location: form.location,
        experience: form.experience,
        skills: form.skills,
        applicationDeadline: form.applicationDeadline,
        requirements: form.requirements,
      };

      if (modalMode === "add") {
        const res = await fetch(`${API_URL}/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create job");
        const data = await res.json();
        setJobs((p) => [data.job, ...p]);
      } else if (modalMode === "edit" && editingJob) {
        const res = await fetch(`${API_URL}/jobs/${editingJob._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update job");
        const data = await res.json();
        setJobs((p) =>
          p.map((j) => (j._id === editingJob._id ? data.job : j))
        );
      }
      closeModal();
    } catch (err) {
      console.error("Error saving job:", err);
      alert(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((p) => p.filter((j) => j._id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      alert(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <p className="text-red-500 text-sm mt-2">Make sure your backend is running at {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your open positions.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs..."
          className="w-full pl-9 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((job) => {
          const deadline = new Date(job.applicationDeadline).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div key={job._id} className="bg-white border rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                  {/* Edit */}
                  <button
                    onClick={() => openEdit(job)}
                    className="p-1.5 rounded-lg hover:bg-lightBlue text-gray-400 hover:text-primary transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => setDeleteId(job._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600">{job.description.substring(0, 100)}...</p>

              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((s) => (
                  <span key={s} className="text-xs bg-lightBlue text-primary px-3 py-1 rounded-full">{s}</span>
                ))}
                {job.skills.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">+{job.skills.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <span>📅 {deadline}</span>
                <Link href={`/dashboard/jobs/${job._id}`}>
                  <button className="text-primary hover:underline font-medium">
                    View Applicants
                  </button>
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <p className="text-sm">No jobs found. {jobs.length === 0 ? "Add your first position." : "Try a different search."}</p>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ─────────────────────────────── */}
      {modalMode && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-800">
                {modalMode === "add" ? "Add New Job" : "Edit Job"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">

              <div>
                <label className="text-xs text-gray-500 block mb-1">Job Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Company</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                  placeholder="Company name"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detailed job description..."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Remote, Kigali, New York"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Experience Required</label>
                  <input
                    value={form.experience}
                    onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))}
                    placeholder="e.g. 2+ years"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Deadline *</label>
                  <input
                    type="date"
                    value={form.applicationDeadline}
                    onChange={(e) => setForm((p) => ({ ...p, applicationDeadline: e.target.value }))}
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Skills</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("skills", skillInput);
                        setSkillInput("");
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => { addTag("skills", skillInput); setSkillInput(""); }}
                    className="px-4 py-2 rounded-xl bg-lightBlue text-primary text-sm font-medium hover:opacity-80 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1 text-xs bg-lightBlue text-primary px-3 py-1 rounded-full">
                      {s}
                      <button onClick={() => removeTag("skills", s)} className="hover:text-red-500 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Requirements</label>
                <div className="flex gap-2">
                  <input
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("requirements", requirementInput);
                        setRequirementInput("");
                      }
                    }}
                    placeholder="Type a requirement and press Enter"
                    className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => { addTag("requirements", requirementInput); setRequirementInput(""); }}
                    className="px-4 py-2 rounded-xl bg-lightBlue text-primary text-sm font-medium hover:opacity-80 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.requirements.map((r) => (
                    <span key={r} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {r}
                      <button onClick={() => removeTag("requirements", r)} className="hover:text-red-500 ml-1">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim() || !form.applicationDeadline.trim() || saving}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : (modalMode === "add" ? "Create Job" : "Save Changes")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ─────────────────────────── */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800">Delete Job?</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will permanently remove the job and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
