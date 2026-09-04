"use client";

import axios from "axios";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { ArrowLeft, ArrowRight, Plus, Trash2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

interface ExperienceItem {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

interface FormValues {
  experience: ExperienceItem[];
}

export default function ExperienceStep({ resumeId, onNext, onBack }: Props) {
  let router = useRouter();

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      experience: [
        {
          company: "",
          role: "",
          employmentType: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      if (data.resume.experience?.length) {
        reset({ experience: data.resume.experience });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateDescription = async (index: number) => {
    try {
      const exp = watch(`experience.${index}`);
      const { data: resumeData } = await axios.get(`/api/resume/${resumeId}`);
      const resume = resumeData.resume;

      const { data } = await axios.post("/api/ai/generate-experience", {
        jobRole: exp.role,
        experienceLevel: resume.experienceLevel,
      });

      setValue(`experience.${index}.description`, data.description);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.patch(`/api/resume/${resumeId}`, {
        experience: values.experience,
      });
      router.push(`/resume/${resumeId}/preview`);
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
            <span className="font-serif text-sm text-[#1C1F26]">Step 5 of 8</span>
            <span className="text-xs text-[#B8B2A2]">62% complete</span>
          </div>
          <div className="h-[3px] bg-[#E4DFD4]">
            <div className="h-full w-[62%] bg-[#8B3A3A]" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E4DFD4] bg-white p-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-[#E4DFD4] pb-6">
            <div>
              <h1 className="font-serif text-2xl text-[#1C1F26]">Work experience</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Showcase your professional experience.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                append({
                  company: "",
                  role: "",
                  employmentType: "",
                  startDate: "",
                  endDate: "",
                  currentlyWorking: false,
                  description: "",
                })
              }
              className="flex items-center gap-2 border border-[#8B3A3A]/40 px-4 py-2
                         text-sm font-medium text-[#8B3A3A] transition hover:bg-[#8B3A3A]/5"
            >
              <Plus size={16} />
              Add experience
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => {
              const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

              return (
                <div key={field.id} className="relative border border-[#E4DFD4] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#B8B2A2]">
                      Experience {index + 1}
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
                        Company
                      </label>
                      <input
                        {...register(`experience.${index}.company`)}
                        placeholder="Acme Inc."
                        className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                   text-[#1C1F26] placeholder:text-[#B8B2A2]
                                   focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                        Job title
                      </label>
                      <input
                        {...register(`experience.${index}.role`)}
                        placeholder="Frontend Developer"
                        className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                   text-[#1C1F26] placeholder:text-[#B8B2A2]
                                   focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                        Employment type
                      </label>
                      <select
                        {...register(`experience.${index}.employmentType`)}
                        className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                   text-[#1C1F26] focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                      >
                        <option value="">Select type</option>
                        <option>Full Time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                        <option>Freelance</option>
                      </select>
                    </div>

                    <div className="flex items-end pb-3">
                      <label className="flex items-center gap-2.5 text-sm text-[#1C1F26]">
                        <input
                          type="checkbox"
                          {...register(`experience.${index}.currentlyWorking`)}
                          className="h-4 w-4 border-[#E4DFD4] accent-[#8B3A3A]"
                        />
                        Currently working here
                      </label>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                        Start date
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.startDate`)}
                        className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                   text-[#1C1F26] focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                        End date
                      </label>
                      <input
                        type="date"
                        {...register(`experience.${index}.endDate`)}
                        disabled={currentlyWorking}
                        className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                   text-[#1C1F26] focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]
                                   disabled:bg-[#FAF8F3] disabled:text-[#B8B2A2]"
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
                      rows={6}
                      {...register(`experience.${index}.description`)}
                      placeholder="Describe your responsibilities and achievements..."
                      className="w-full border border-[#E4DFD4] bg-white p-4 text-sm
                                 leading-relaxed text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>
                </div>
              );
            })}

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