"use client";

import axios from "axios";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface Props {
  resumeId: string;
  onNext: () => void;
  onBack: () => void;
}

interface EducationForm {
  education: {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
}

export default function EducationStep({ resumeId, onNext, onBack }: Props) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<EducationForm>({
    defaultValues: {
      education: [{ institute: "", degree: "", startDate: "", endDate: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      if (data.resume?.education && data.resume.education.length > 0) {
        reset({ education: data.resume.education });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: EducationForm) => {
    try {
      await axios.patch(`/api/resume/${resumeId}`, {
        education: values.education,
      });
      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-serif text-sm text-[#1C1F26]">Step 2 of 8</span>
            <span className="text-xs text-[#B8B2A2]">25% complete</span>
          </div>
          <div className="h-[3px] bg-[#E4DFD4]">
            <div className="h-full w-[25%] bg-[#8B3A3A]" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E4DFD4] bg-white p-10">
          <div className="mb-8 flex items-center gap-4 border-b border-[#E4DFD4] pb-6">
            <div className="flex h-11 w-11 items-center justify-center border border-[#E4DFD4] text-[#8B3A3A]">
              <GraduationCap size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-[#1C1F26]">Education</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">
                Add your educational background.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative border border-[#E4DFD4] p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#B8B2A2]">
                    Education {index + 1}
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
                      Institute
                    </label>
                    <input
                      {...register(`education.${index}.institute`)}
                      placeholder="Lakshmi Narain College of Technology"
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      Degree
                    </label>
                    <input
                      {...register(`education.${index}.degree`)}
                      placeholder="B.Tech Computer Science"
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] placeholder:text-[#B8B2A2]
                                 focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
                      Start date
                    </label>
                    <input
                      type="date"
                      {...register(`education.${index}.startDate`)}
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
                      {...register(`education.${index}.endDate`)}
                      className="w-full border border-[#E4DFD4] bg-white p-3 text-sm
                                 text-[#1C1F26] focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Education */}
            <button
              type="button"
              onClick={() =>
                append({ institute: "", degree: "", startDate: "", endDate: "" })
              }
              className="flex items-center gap-2 border border-[#8B3A3A]/40 px-5 py-2.5
                         text-sm font-medium text-[#8B3A3A] transition hover:bg-[#8B3A3A]/5"
            >
              <Plus size={16} />
              Add education
            </button>

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
                type="submit"
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