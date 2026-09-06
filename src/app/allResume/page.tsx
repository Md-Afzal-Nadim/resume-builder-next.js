"use client";

import { useEffect, useState } from "react";
import { getAllResumesApi } from "@/apis/resume.api";

import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
} from "lucide-react";

interface Resume {
  _id: string;
  title: string;
  summary: string;
  personalDetails?: {
    fullname?: string;
    email?: string;
    mobile?: string;
    location?: string;
    github?: string;
    linkedIn?: string;
    portfolio?: string;
  };
  workExperience: {
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  projects: {
    title?: string;
    description?: string;
    githubUrl?: string;
    liveUrl?: string;
    technologies?: string[];
  }[];
  skills: string[];
  education: {
    institution?: string;
    degree?: string;
    startDate?: string;
    endDate?: string;
  }[];
  certificates: string[];
  createdAt: string;
  updatedAt: string;
}

 const [showModal, setShowModal] = useState(false);

function formatMonthYear(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function dateRange(start?: string, end?: string) {
  const s = formatMonthYear(start);
  const e = end ? formatMonthYear(end) : "Present";
  if (!s && !e) return "";
  return `${s} — ${e}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 7) return `Updated ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Updated ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  return `Updated ${new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 font-serif text-sm text-[#8B3A3A]">{children}</h3>
  );
}

function ResumeSkeleton() {
  return (
    <div className="border border-[#E4DFD4] bg-white p-10">
      <div className="h-6 w-1/2 animate-pulse rounded bg-[#EFEBE1]" />
      <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-[#EFEBE1]" />
      <div className="mt-8 h-3 w-full animate-pulse rounded bg-[#EFEBE1]" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-[#EFEBE1]" />
      <div className="mt-8 h-3 w-1/4 animate-pulse rounded bg-[#EFEBE1]" />
      <div className="mt-3 h-16 w-full animate-pulse rounded bg-[#EFEBE1]" />
    </div>
  );
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await getAllResumesApi();
        if (response.success) {
          setResumes(response.data);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#E4DFD4] pb-6">
          <div>
            <h1 className="font-serif text-3xl text-[#1C1F26]">Your resumes</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {loading
                ? "Loading your work"
                : resumes.length === 0
                ? "Nothing saved yet"
                : `${resumes.length} resume${resumes.length > 1 ? "s" : ""} on file`}
            </p>
          </div>

          <button
            className="flex items-center gap-2 bg-[#1C1F26] px-5 py-2.5 text-sm
                       font-medium text-[#FAF8F3] transition hover:bg-[#2A2E38]"
          >
            <Plus size={16} />
            New resume
          </button>
          
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-8">
            <ResumeSkeleton />
            <ResumeSkeleton />
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <div className="border border-dashed border-[#D8D2C4] bg-white/60 px-8 py-20 text-center">
            <FileText size={36} className="mx-auto mb-4 text-[#B8B2A2]" strokeWidth={1.5} />
            <h2 className="font-serif text-xl text-[#1C1F26]">No resumes yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#6B7280]">
              Build your first resume to start applying — it takes a few minutes.
            </p>
          </div>
        )}

        {/* Full resumes, one after another */}
        {!loading && resumes.length > 0 && (
          <div className="space-y-10">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="relative border border-[#E4DFD4] bg-white p-10"
              >
                {/* Top bar: resume label + actions */}
                <div className="mb-8 flex items-center justify-between border-b border-[#E4DFD4] pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#B8B2A2]">
                      {resume.title || "Untitled resume"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#B8B2A2]">
                      {timeAgo(resume.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-[#1C1F26] hover:text-[#8B3A3A]">
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#8B3A3A]">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Resume header: name + contact */}
                <div className="mb-8">
                  <h2 className="font-serif text-3xl text-[#1C1F26]">
                    {resume.personalDetails?.fullname || "Unnamed candidate"}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#6B7280]">
                    {resume.personalDetails?.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={13} /> {resume.personalDetails.email}
                      </span>
                    )}
                    {resume.personalDetails?.mobile && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} /> {resume.personalDetails.mobile}
                      </span>
                    )}
                    {resume.personalDetails?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} /> {resume.personalDetails.location}
                      </span>
                    )}
                    {resume.personalDetails?.github && (
                      <span className="flex items-center gap-1.5">
                        <Globe size={13} /> {resume.personalDetails.github}
                      </span>
                    )}
                    {resume.personalDetails?.linkedIn && (
                      <span className="flex items-center gap-1.5">
                        <Globe size={13} /> {resume.personalDetails.linkedIn}
                      </span>
                    )}
                    {resume.personalDetails?.portfolio && (
                      <span className="flex items-center gap-1.5">
                        <Globe size={13} /> {resume.personalDetails.portfolio}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {resume.summary && (
                  <div className="mb-8">
                    <SectionLabel>Summary</SectionLabel>
                    <p className="text-sm leading-relaxed text-[#374151]">
                      {resume.summary}
                    </p>
                  </div>
                )}

                {/* Work Experience */}
                {resume.workExperience?.length > 0 && (
                  <div className="mb-8">
                    <SectionLabel>Experience</SectionLabel>
                    <div className="space-y-5">
                      {resume.workExperience.map((exp, i) => (
                        <div key={i}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <p className="text-sm font-medium text-[#1C1F26]">
                              {exp.position}
                              {exp.company ? ` · ${exp.company}` : ""}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              {dateRange(exp.startDate, exp.endDate)}
                            </p>
                          </div>
                          {exp.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {resume.projects?.length > 0 && (
                  <div className="mb-8">
                    <SectionLabel>Projects</SectionLabel>
                    <div className="space-y-5">
                      {resume.projects.map((proj, i) => (
                        <div key={i}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <p className="text-sm font-medium text-[#1C1F26]">
                              {proj.title || "Untitled project"}
                            </p>
                            <div className="flex gap-3 text-xs text-[#8B3A3A]">
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  Code
                                </a>
                              )}
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  Live
                                </a>
                              )}
                            </div>
                          </div>
                          {proj.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
                              {proj.description}
                            </p>
                          )}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {proj.technologies.map((tech, ti) => (
                                <span
                                  key={ti}
                                  className="border border-[#E4DFD4] px-2 py-0.5 text-xs text-[#4B5563]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resume.skills?.length > 0 && (
                  <div className="mb-8">
                    <SectionLabel>Skills</SectionLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="border border-[#E4DFD4] px-2 py-0.5 text-xs text-[#4B5563]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.education?.length > 0 && (
                  <div className="mb-8">
                    <SectionLabel>Education</SectionLabel>
                    <div className="space-y-3">
                      {resume.education.map((edu, i) => (
                        <div key={i} className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium text-[#1C1F26]">
                            {edu.degree}
                            {edu.institution ? ` · ${edu.institution}` : ""}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">
                            {dateRange(edu.startDate, edu.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {resume.certificates?.length > 0 && (
                  <div>
                    <SectionLabel>Certificates</SectionLabel>
                    <ul className="space-y-1 text-sm text-[#374151]">
                      {resume.certificates.map((cert, i) => (
                        <li key={i}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}