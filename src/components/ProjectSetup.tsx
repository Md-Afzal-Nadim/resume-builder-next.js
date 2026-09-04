"use client";

import axios from "axios";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from "lucide-react";

interface Props {
  resumeId: any;
  onNext: () => void;
  onBack: () => void;
}

interface Project {
  title: string;
  techStack: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
}

interface FormValues {
  projects: Project[];
}

export default function ProjectsStep({ resumeId, onNext, onBack }: Props) {
  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      projects: [
        { title: "", techStack: "", description: "", githubUrl: "", liveUrl: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);

      if (data.data?.projects?.length) {
        reset({
          projects: data.data.projects.map((project: any) => ({
            ...project,
            techStack: Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : "",
          })),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateDescription = async (index: number) => {
    try {
      const { data } = await axios.post(
        "/api/ai/generate-project-description",
        {
          jobTitle: "web developer",
          experienceLevel: "mid-level",
          techStack: ["html", "css", "react", "nodejs"],
        }
      );

      setValue(`projects.${index}.description`, data.data.projectDescription);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const formattedProjects = values.projects.map((project) => ({
        title: project.title,
        description: project.description,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        technologies: project.techStack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      }));

      await axios.patch(`/api/resume/${resumeId}`, {
        projects: formattedProjects,
      });

      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-serif text-sm text-[#1C1F26]">Step 4 of 8</span>
            <span className="text-xs text-[#B8B2A2]">50% complete</span>
          </div>
          <div className="h-[3px] bg-[#E4DFD4]">
            <div className="h-full w-[50%] bg-[#8B3A3A]" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E4DFD4] bg-white p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#E4DFD4] pb-6">
            <div>
              <h1 className="font-serif text-2xl text-[#1C1F26]">Projects</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Showcase your best work.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                append({
                  title: "",
                  techStack: "",
                  description: "",
                  githubUrl: "",
                  liveUrl: "",
                })
              }
              className="flex items-center gap-2 border border-[#8B3A3A]/40 px-4 py-2
                         text-sm font-medium text-[#8B3A3A] transition hover:bg-[#8B3A3A]/5"
            >
              <Plus size={16} />
              Add project
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="relative border border-[#E4DFD4] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#B8B2A2]">
                    Project {index + 1}
                  </span>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-[#9CA3AF] hover:text-[#8B3A3A]"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      Project title
                    </label>
                    <input
                      {...register(`projects.${index}.title`)}
                      placeholder="AI Resume Builder"
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      Tech stack
                    </label>
                    <input
                      {...register(`projects.${index}.techStack`)}
                      placeholder="React, Next.js, MongoDB"
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      GitHub URL
                    </label>
                    <input
                      {...register(`projects.${index}.githubUrl`)}
                      placeholder="https://github.com/..."
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      Live URL
                    </label>
                    <input
                      {...register(`projects.${index}.liveUrl`)}
                      placeholder="https://..."
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-[#1C1F26]">
                      Description
                    </label>
                    <button
                      type="button"
                      onClick={() => generateDescription(index)}
                      className="flex items-center gap-1.5 border border-[#8B3A3A]/40 px-3 py-1.5
                                 text-xs font-medium text-[#8B3A3A] transition hover:bg-[#8B3A3A]/5"
                    >
                      <Sparkles size={13} />
                      Generate with AI
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    {...register(`projects.${index}.description`)}
                    placeholder="What did you build, and what impact did it have?"
                    className="w-full border border-[#E4DFD4] bg-white p-4 text-sm
                               leading-relaxed text-[#1C1F26] placeholder:text-[#B8B2A2]
                               focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                  />
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex justify-between border-t border-[#E4DFD4] pt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 border border-[#E4DFD4] px-5 py-2.5
                           text-sm font-medium text-[#1C1F26] transition hover:bg-[#FAF8F3]"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#1C1F26] px-6 py-2.5
                           text-sm font-medium text-[#FAF8F3] transition
                           hover:bg-[#8B3A3A] disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}