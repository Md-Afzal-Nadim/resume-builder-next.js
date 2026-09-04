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
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-[#E4DFD4] pb-6 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1F26] sm:text-4xl">
              My resumes
            </h1>
            <p className="mt-1 text-sm text-[#6B7280] sm:text-base">
              Create ATS-friendly resumes using AI.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 bg-[#1C1F26]
                       px-6 py-3 text-sm font-medium text-[#FAF8F3] transition
                       hover:bg-[#8B3A3A] sm:w-auto"
          >
            <Plus size={17} />
            Create resume
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[#E4DFD4] bg-white p-6">
                <div className="h-5 w-2/3 animate-pulse bg-[#EFEBE1]" />
                <div className="mt-4 h-4 w-1/2 animate-pulse bg-[#EFEBE1]" />
                <div className="mt-4 h-6 w-20 animate-pulse bg-[#EFEBE1]" />
                <div className="mt-6 h-11 w-full animate-pulse bg-[#EFEBE1]" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <div className="border border-dashed border-[#D8D2C4] bg-white/60 px-8 py-16 text-center sm:py-20">
            <FileText size={36} className="mx-auto text-[#B8B2A2]" strokeWidth={1.5} />
            <h2 className="mt-6 font-serif text-xl text-[#1C1F26] sm:text-2xl">
              No resume yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#6B7280] sm:text-base">
              Create your first AI-powered resume in minutes.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 bg-[#1C1F26] px-6 py-3
                         text-sm font-medium text-[#FAF8F3] transition hover:bg-[#8B3A3A]"
            >
              <Plus size={17} />
              Create resume
            </button>
          </div>
        )}

        {/* Resume Grid */}
        {!loading && resumes.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="group border border-[#E4DFD4] bg-white p-6 transition
                           hover:border-[#8B3A3A]/40 hover:shadow-[0_8px_24px_-12px_rgba(28,31,38,0.15)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-serif text-lg text-[#1C1F26] sm:text-xl">
                      {resume.title}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
                      <Briefcase size={14} className="shrink-0" />
                      <span className="truncate">{resume.jobTitle}</span>
                    </div>

                    <span className="mt-4 inline-block border border-[#E4DFD4] px-2.5 py-0.5 text-xs text-[#8B3A3A]">
                      {resume.experienceLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    disabled={deletingId === resume._id}
                    className="shrink-0 p-2 text-[#9CA3AF] transition hover:text-[#8B3A3A] disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  onClick={() => router.push(`/resume/${resume._id}`)}
                  className="mt-6 flex w-full items-center justify-center gap-2 border border-[#E4DFD4]
                             py-2.5 text-sm font-medium text-[#1C1F26] transition hover:bg-[#FAF8F3]"
                >
                  Continue building
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1F26]/50 px-4 backdrop-blur-sm"
          onClick={() => !creating && setShowModal(false)}
        >
          <div
            className="w-full max-w-lg border border-[#E4DFD4] bg-white p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles size={17} className="text-[#8B3A3A]" />
                <h2 className="font-serif text-xl text-[#1C1F26] sm:text-2xl">
                  Create resume
                </h2>
              </div>

              <button
                onClick={() => !creating && setShowModal(false)}
                className="p-1.5 text-[#9CA3AF] transition hover:text-[#1C1F26]"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mb-6 text-sm text-[#6B7280]">
              Give your resume a title and target role to get started.
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                  Resume title
                </label>
                <input
                  placeholder="e.g. Frontend Developer Resume"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                             text-[#1C1F26] placeholder:text-[#B8B2A2]
                             focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                  Job title
                </label>
                <input
                  placeholder="e.g. React Developer"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                             text-[#1C1F26] placeholder:text-[#B8B2A2]
                             focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                  Experience level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceLevel: e.target.value })
                  }
                  className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                             text-[#1C1F26] focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                onClick={() => setShowModal(false)}
                disabled={creating}
                className="border border-[#E4DFD4] px-5 py-2.5 text-sm font-medium
                           text-[#1C1F26] transition hover:bg-[#FAF8F3] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateResume}
                disabled={creating || !formData.title.trim() || !formData.jobTitle.trim()}
                className="bg-[#1C1F26] px-5 py-2.5 text-sm font-medium text-[#FAF8F3]
                           transition hover:bg-[#8B3A3A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create resume"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}