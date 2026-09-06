"use client";

import { useMemo, useState } from "react";
import { getATSScoreApi } from "@/apis/ai.api";
import {
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type ScoreLabel = "Poor" | "Needs Improvement" | "Good" | "Excellent";

type AtsAnalysis = {
  atsScore: number;
  scoreLabel: ScoreLabel;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
};

type ResumeLike = {
  summary?: string;
  skills?: string[];
  workExperience?: Array<{
    position?: string;
    company?: string;
    description?: string;
  }>;
  projects?: Array<{
    title?: string;
    description?: string;
    techStack?: string[];
    technologies?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institute?: string;
  }>;
  personalInfo?: {
    fullname?: string;
    email?: string;
    location?: string;
    github?: string;
    portfolio?: string;
  };
  personalDetails?: {
    fullname?: string;
    email?: string;
    location?: string;
    github?: string;
    portfolio?: string;
  };
  certifications?: string[];
};

const parseAtsResponse = (payload: any): AtsAnalysis | null => {
  if (!payload) return null;

  if (typeof payload === "string") {
    try {
      return parseAtsResponse(JSON.parse(payload));
    } catch {
      return null;
    }
  }

  const nested = payload.AtsScore ?? payload.data ?? payload.result ?? payload;

  if (nested && typeof nested === "object") {
    const source = nested.AtsScore ?? nested;

    if (source && typeof source === "object") {
      const score = Number(source.atsScore ?? source.score ?? 0);
      const label = source.scoreLabel ?? "Needs Improvement";

      return {
        atsScore: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0,
        scoreLabel: ["Poor", "Needs Improvement", "Good", "Excellent"].includes(label)
          ? label
          : "Needs Improvement",
        strengths: Array.isArray(source.strengths) ? source.strengths : [],
        weaknesses: Array.isArray(source.weaknesses) ? source.weaknesses : [],
        suggestions: Array.isArray(source.suggestions) ? source.suggestions : [],
        missingKeywords: Array.isArray(source.missingKeywords) ? source.missingKeywords : [],
      };
    }
  }

  return null;
};

// Supports both `personalInfo`/`personalDetails` and `techStack`/`technologies`
// since different parts of the app use different field names for the same data.
const buildResumeText = (resume: ResumeLike) => {
  const parts: string[] = [];
  const personal = resume.personalInfo ?? resume.personalDetails;

  if (personal?.fullname) parts.push(`Name: ${personal.fullname}`);
  if (personal?.email) parts.push(`Email: ${personal.email}`);
  if (personal?.location) parts.push(`Location: ${personal.location}`);
  if (resume.summary) parts.push(`Professional Summary: ${resume.summary}`);

  if (resume.skills?.length) {
    parts.push(`Skills: ${resume.skills.join(", ")}`);
  }

  if (resume.workExperience?.length) {
    const experience = resume.workExperience
      .map((exp) => `${exp.position ?? "Role"} at ${exp.company ?? "Company"}: ${exp.description ?? ""}`)
      .join("\n");
    parts.push(`Experience:\n${experience}`);
  }

  if (resume.projects?.length) {
    const projects = resume.projects
      .map((project) => {
        const tech = project.techStack ?? project.technologies ?? [];
        return `${project.title ?? "Project"}: ${project.description ?? ""}. Tech: ${tech.join(", ")}`;
      })
      .join("\n");
    parts.push(`Projects:\n${projects}`);
  }

  if (resume.education?.length) {
    const education = resume.education
      .map((edu) => `${edu.degree ?? "Degree"} - ${edu.institute ?? "Institute"}`)
      .join("\n");
    parts.push(`Education:\n${education}`);
  }

  if (resume.certifications?.length) {
    parts.push(`Certifications: ${resume.certifications.join(", ")}`);
  }

  return parts.join("\n\n");
};

const scoreColor = (score: number) => {
  if (score >= 70) return "#3F6B4F";
  if (score >= 50) return "#B8860B";
  return "#8B3A3A";
};

const AtsScore = ({ resume }: { resume: ResumeLike | null }) => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resumeText = useMemo(() => {
    if (!resume) return "";
    return buildResumeText(resume);
  }, [resume]);

  const checkScore = async () => {
    if (!resumeText.trim()) {
      setError("Add some resume content first — nothing to analyze yet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getATSScoreApi({ resumeText });
      const parsed = parseAtsResponse(response);

      if (parsed) {
        setAnalysis(parsed);
      } else {
        const fallback = response?.data?.AtsScore ?? response?.data ?? response;
        const fallbackParsed = parseAtsResponse(fallback);
        setAnalysis(
          fallbackParsed ?? {
            atsScore: 0,
            scoreLabel: "Needs Improvement",
            strengths: [],
            weaknesses: ["Unable to generate a detailed ATS analysis from the current backend response."],
            suggestions: ["Try a resume with more standard section headings and measurable achievements."],
            missingKeywords: [],
          }
        );
      }

      setChecked(true);
    } catch (err) {
      console.error("ATS score error:", err);
      setError("ATS score could not be generated right now.");
    } finally {
      setLoading(false);
    }
  };

  if (!resume) return null;

  return (
    <div className="border border-[#E4DFD4] p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-[#1C1F26]">
        <ShieldCheck size={15} className="text-[#8B3A3A]" />
        ATS score
      </div>

      {!checked && !loading && (
        <>
          <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
            Check how well this resume is likely to pass applicant tracking
            systems.
          </p>
          <button
            onClick={checkScore}
            className="mt-3 flex w-full items-center justify-center gap-2 bg-[#1C1F26]
                       py-2.5 text-sm font-medium text-[#FAF8F3] transition hover:bg-[#8B3A3A]"
          >
            <Sparkles size={14} />
            Check ATS score
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
          <Loader2 size={15} className="animate-spin text-[#8B3A3A]" />
          Analyzing resume...
        </div>
      )}

      {error && !loading && (
        <div className="mt-3 border border-[#8B3A3A]/30 bg-[#8B3A3A]/5 p-3 text-xs text-[#8B3A3A]">
          {error}
        </div>
      )}

      {!loading && !error && analysis && (
        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl" style={{ color: scoreColor(analysis.atsScore) }}>
              {analysis.atsScore}
            </span>
            <span className="text-sm text-[#B8B2A2]">/100</span>
            <span className="ml-auto text-xs font-medium text-[#6B7280]">
              {analysis.scoreLabel}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full bg-[#E4DFD4]">
            <div
              className="h-full"
              style={{
                width: `${analysis.atsScore}%`,
                backgroundColor: scoreColor(analysis.atsScore),
              }}
            />
          </div>

          <div className="mt-4 space-y-4 text-xs">
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="mb-1.5 font-medium text-[#1C1F26]">Strengths</h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((item, index) => (
                    <li key={index} className="flex items-start gap-1.5 text-[#6B7280]">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[#3F6B4F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.weaknesses.length > 0 && (
              <div>
                <h4 className="mb-1.5 font-medium text-[#1C1F26]">Weaknesses</h4>
                <ul className="space-y-1">
                  {analysis.weaknesses.map((item, index) => (
                    <li key={index} className="flex items-start gap-1.5 text-[#6B7280]">
                      <AlertTriangle size={12} className="mt-0.5 shrink-0 text-[#B8860B]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="mb-1.5 font-medium text-[#1C1F26]">Suggestions</h4>
                <ul className="space-y-1 text-[#6B7280]">
                  {analysis.suggestions.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.missingKeywords.length > 0 && (
              <div>
                <h4 className="mb-1.5 font-medium text-[#1C1F26]">Missing keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <span key={index} className="border border-[#E4DFD4] px-2 py-0.5 text-[#4B5563]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={checkScore}
            className="mt-4 w-full border border-[#E4DFD4] py-2 text-xs font-medium
                       text-[#1C1F26] transition hover:bg-[#FAF8F3]"
          >
            Recheck
          </button>
        </div>
      )}
    </div>
  );
};

export default AtsScore;