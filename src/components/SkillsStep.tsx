"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, X } from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsStep({ resumeId, onNext, onBack }: Props) {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}/`);
      setSkills(data.resume.skills || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (skills.includes(skillInput.trim())) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const generateSkills = async () => {
    try {
      setAiLoading(true);

      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);
      const resume = resumeData.resume;

      const { data } = await axios.post("/api/ai/generate-skills", {
        jobTitle: "web-developer",
        experienceLevel: "mid-level",
      });

      const generatedSkills = data.data.skills;

      setSkills(
        Array.isArray(generatedSkills)
          ? generatedSkills
          : generatedSkills.split(",").map((skill: string) => skill.trim())
      );
    } catch (error) {
      console.log(error);
    } finally {
      setAiLoading(false);
    }
  };

  const saveSkills = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/resume/${resumeId}`, { skills });
      onNext();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-serif text-sm text-[#1C1F26]">Step 3 of 8</span>
            <span className="text-xs text-[#B8B2A2]">37% complete</span>
          </div>
          <div className="h-[3px] bg-[#E4DFD4]">
            <div className="h-full w-[37%] bg-[#8B3A3A]" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E4DFD4] bg-white p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#E4DFD4] pb-6">
            <div>
              <h1 className="font-serif text-2xl text-[#1C1F26]">Skills</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Add skills relevant to your role.
              </p>
            </div>

            <button
              onClick={generateSkills}
              disabled={aiLoading}
              className="flex items-center gap-2 border border-[#8B3A3A]/40 px-4 py-2
                         text-sm font-medium text-[#8B3A3A] transition
                         hover:bg-[#8B3A3A]/5 disabled:opacity-60"
            >
              <Sparkles size={15} />
              {aiLoading ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. React, Node.js"
              className="flex-1 border border-[#E4DFD4] bg-white px-4 py-2.5 text-sm
                         text-[#1C1F26] placeholder:text-[#B8B2A2]
                         focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
            <button
              onClick={addSkill}
              type="button"
              className="bg-[#1C1F26] px-5 py-2.5 text-sm font-medium text-[#FAF8F3]
                         transition hover:bg-[#8B3A3A]"
            >
              Add
            </button>
          </div>

          {/* Skills */}
          <div className="mt-6">
            {skills.length === 0 ? (
              <p className="text-sm text-[#B8B2A2]">
                No skills added yet — type one above or generate with AI.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 border border-[#E4DFD4] px-3 py-1.5
                               text-sm text-[#374151]"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-[#B8B2A2] hover:text-[#8B3A3A]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-10 flex justify-between border-t border-[#E4DFD4] pt-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 border border-[#E4DFD4] px-5 py-2.5
                         text-sm font-medium text-[#1C1F26] transition hover:bg-[#FAF8F3]"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <button
              onClick={saveSkills}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1C1F26] px-6 py-2.5
                         text-sm font-medium text-[#FAF8F3] transition
                         hover:bg-[#8B3A3A] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}