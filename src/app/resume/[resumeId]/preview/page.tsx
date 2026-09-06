"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import AtsScore from "@/components/AtsScore";
import DownloadPdf from "@/components/DownloadPdf";
import EditPdf from "@/components/EditPdf";

interface Resume {
  title: string;
  summary: string;

  personalDetails: {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedIn: string;
    portfolio: string;
  };

  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];

  skills: string[];

  projects: {
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
  }[];

  workExperience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  certifications: string[];
}

function dateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  return `${start || ""} — ${end || "Present"}`;
}

export default function ResumePreviewPage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const resumeId = Array.isArray(params.resumeId)
    ? params.resumeId[0]
    : params.resumeId;

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      setResume(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3]">
        <p className="text-sm text-[#6B7280]">Loading resume...</p>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10 print:bg-white print:p-0 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Actions sidebar — hidden when printing/downloading */}
          <div className="print:hidden lg:col-span-1">
            <div className="sticky top-6 border border-[#E4DFD4] bg-white p-6">
              <h2 className="font-serif text-lg text-[#1C1F26]">Resume actions</h2>

              <div className="mt-5 space-y-3">
                <AtsScore resume={resume} />
                <DownloadPdf />
                <EditPdf resumeId={resumeId} />
              </div>
            </div>
          </div>

          {/* Resume document — only this prints */}
          <div className="print:col-span-4 lg:col-span-3">
            <div
              id="resume-preview"
              className="border border-[#E4DFD4] bg-white p-10 print:border-0 print:p-0 print:shadow-none"
            >
              {/* Header */}
              <div className="border-b border-[#E4DFD4] pb-6">
                <h1 className="font-serif text-3xl text-[#1C1F26] sm:text-4xl">
                  {resume.personalDetails?.fullname}
                </h1>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#6B7280]">
                  {resume.personalDetails?.email && <span>{resume.personalDetails.email}</span>}
                  {resume.personalDetails?.mobile && <span>{resume.personalDetails.mobile}</span>}
                  {resume.personalDetails?.location && <span>{resume.personalDetails.location}</span>}
                </div>

                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#8B3A3A]">
                  {resume.personalDetails?.github && <span>{resume.personalDetails.github}</span>}
                  {resume.personalDetails?.linkedIn && <span>{resume.personalDetails.linkedIn}</span>}
                  {resume.personalDetails?.portfolio && <span>{resume.personalDetails.portfolio}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.summary && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Summary</h2>
                  <p className="text-sm leading-relaxed text-[#374151]">{resume.summary}</p>
                </section>
              )}

              {/* Skills */}
              {resume.skills?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-[#E4DFD4] px-2 py-0.5 text-xs text-[#4B5563]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {resume.workExperience?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Experience</h2>
                  <div className="space-y-5">
                    {resume.workExperience.map((exp, index) => (
                      <div key={index}>
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
                </section>
              )}

              {/* Projects */}
              {resume.projects?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Projects</h2>
                  <div className="space-y-5">
                    {resume.projects.map((project, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <p className="text-sm font-medium text-[#1C1F26]">{project.title}</p>
                          <div className="flex gap-3 text-xs text-[#8B3A3A]">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                Code
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                Live
                              </a>
                            )}
                          </div>
                        </div>

                        {project.description && (
                          <p className="mt-1.5 text-sm leading-relaxed text-[#6B7280]">
                            {project.description}
                          </p>
                        )}

                        {project.technologies?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
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
                </section>
              )}

              {/* Education */}
              {resume.education?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Education</h2>
                  <div className="space-y-3">
                    {resume.education.map((edu, index) => (
                      <div key={index} className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <div>
                          <p className="text-sm font-medium text-[#1C1F26]">{edu.degree}</p>
                          <p className="text-sm text-[#6B7280]">{edu.institute}</p>
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                          {dateRange(edu.startDate, edu.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {resume.certifications?.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 font-serif text-sm text-[#8B3A3A]">Certifications</h2>
                  <ul className="space-y-1 text-sm text-[#374151]">
                    {resume.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}