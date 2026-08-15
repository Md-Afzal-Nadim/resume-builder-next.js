"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Trash2,
  Briefcase,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";

import {
  createResumeApi,
  deleteResumeApi,
  getAllResumesApi,
} from "@/apis/resume.api";

interface Resume {
  _id: string;
  title: string;
  jobTitle: string;
  experienceLevel: string;
}

const experienceLevels = ["Fresher", "Junior", "Mid-Level", "Senior"];

export default function ResumePage() {
  const router = useRouter();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    jobTitle: "",
    experienceLevel: "Fresher",
  });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getAllResumesApi();
      setResumes(data.resumes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    if (!formData.title.trim() || !formData.jobTitle.trim()) return;

    try {
      setCreating(true);

      const response = await createResumeApi({
        title: formData.title,
        jobTitle: formData.jobTitle,
        experienceLevel: formData.experienceLevel,
      });

      const resumeId = response.data._id;
      router.push(`/resume/${resumeId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    try {
      setDeletingId(resumeId);
      await deleteResumeApi(resumeId);
      setResumes((prev) => prev.filter((r) => r._id !== resumeId));
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Sparkles size={20} className="text-violet-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                My Resumes
              </h1>
              <p className="text-slate-400 mt-1 text-sm sm:text-base">
                Create ATS-friendly resumes using AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg shadow-violet-900/30 transition"
          >
            <Plus size={18} />
            Create Resume
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 animate-pulse"
              >
                <div className="h-5 w-2/3 bg-white/10 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded mt-4" />
                <div className="h-6 w-20 bg-white/10 rounded-full mt-4" />
                <div className="h-11 w-full bg-white/10 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-10 sm:p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <FileText size={32} className="text-violet-300" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mt-6 text-white">
              No resume yet
            </h2>

            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Create your first AI-powered resume in minutes.
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-violet-900/30 transition inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Resume
            </button>
          </div>
        )}

        {/* Resume Grid */}
        {!loading && resumes.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 hover:bg-white/[0.09] hover:border-violet-400/30 transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h2 className="font-bold text-lg sm:text-xl text-white truncate">
                      {resume.title}
                    </h2>

                    <div className="flex items-center gap-2 text-slate-400 mt-2 text-sm">
                      <Briefcase size={15} className="shrink-0" />
                      <span className="truncate">{resume.jobTitle}</span>
                    </div>

                    <span className="inline-block mt-4 bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30 px-3 py-1 rounded-full text-xs font-medium">
                      {resume.experienceLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    disabled={deletingId === resume._id}
                    className="shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-2 transition disabled:opacity-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <button
                  onClick={() => router.push(`/resume/${resume._id}`)}
                  className="mt-6 w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  Continue Building
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4 z-50"
          onClick={() => !creating && setShowModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <Sparkles size={17} className="text-violet-300" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Create Resume
                </h2>
              </div>

              <button
                onClick={() => !creating && setShowModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-6">
              Give your resume a title and target role to get started.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Resume Title
                </label>
                <input
                  placeholder="e.g. Frontend Developer Resume"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Job Title
                </label>
                <input
                  placeholder="e.g. React Developer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-medium text-slate-300">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceLevel: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-white/5 border border-white/10 text-white p-3 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition [&>option]:bg-slate-900"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="px-5 py-3 border border-white/10 text-slate-300 rounded-xl font-medium hover:bg-white/5 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateResume}
                disabled={creating || !formData.title.trim() || !formData.jobTitle.trim()}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create Resume"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}