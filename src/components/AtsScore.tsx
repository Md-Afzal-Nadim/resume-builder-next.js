"use client";

import { useEffect, useMemo, useState } from "react";
import { getATSScoreApi } from "@/apis/ai.api";
import { Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

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

const buildResumeText = (resume: ResumeLike) => {
  const parts: string[] = [];

  if (resume.personalInfo?.fullname) parts.push(`Name: ${resume.personalInfo.fullname}`);
  if (resume.personalInfo?.email) parts.push(`Email: ${resume.personalInfo.email}`);
  if (resume.personalInfo?.location) parts.push(`Location: ${resume.personalInfo.location}`);
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
      .map((project) => `${project.title ?? "Project"}: ${project.description ?? ""}. Tech: ${project.techStack?.join(", ") ?? ""}`)
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

const getScoreTone = (score: number) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Poor";
};

const AtsScore = ({ resume }: { resume: ResumeLike | null }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resumeText = useMemo(() => {
    if (!resume) return "";
    return buildResumeText(resume);
  }, [resume]);

  useEffect(() => {
    const fetchScore = async () => {
      if (!resume || !resumeText.trim()) {
        setAnalysis(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getATSScoreApi({ resumeText });
        const parsed = parseAtsResponse(response);

        if (parsed) {
          setAnalysis(parsed);
          return;
        }

        const fallback = response?.data?.AtsScore ?? response?.data ?? response;
        const fallbackParsed = parseAtsResponse(fallback);
        setAnalysis(fallbackParsed ?? {
          atsScore: 0,
          scoreLabel: "Needs Improvement",
          strengths: [],
          weaknesses: ["Unable to generate a detailed ATS analysis from the current backend response."],
          suggestions: ["Try a resume with more standard section headings and measurable achievements."],
          missingKeywords: [],
        });
      } catch (err) {
        console.error("ATS score error:", err);
        setError("ATS score could not be generated right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [resume, resumeText]);

  if (!resume) return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
          <h3 className="font-bold text-lg text-slate-800">ATS Score</h3>
        </div>

        {loading && <Loader2 className="h-4 w-4 animate-spin text-violet-600" />}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && analysis && (
        <>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
                {analysis.atsScore}
              </div>
              <div>
                <div className="text-sm text-slate-500">Overall match</div>
                <div className="font-semibold text-slate-800">{analysis.scoreLabel || getScoreTone(analysis.atsScore)}</div>
              </div>
            </div>
            <TrendingUp className="h-5 w-5 text-violet-600" />
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Strengths</h4>
              <ul className="space-y-1">
                {analysis.strengths.length ? analysis.strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                )) : <li>No specific strengths detected.</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Weaknesses</h4>
              <ul className="space-y-1">
                {analysis.weaknesses.length ? analysis.weaknesses.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                    <span>{item}</span>
                  </li>
                )) : <li>No major issues detected.</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-1">Suggestions</h4>
              <ul className="list-disc space-y-1 pl-5">
                {analysis.suggestions.length ? analysis.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                )) : <li>Add measurable achievements and role-specific keywords.</li>}
              </ul>
            </div>

            {analysis.missingKeywords.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <span key={index} className="rounded-full bg-violet-100 px-2 py-1 text-xs text-violet-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && !analysis && resumeText && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
          ATS score is not available for this resume yet.
        </div>
      )}
    </div>
  );
};

export default AtsScore;
