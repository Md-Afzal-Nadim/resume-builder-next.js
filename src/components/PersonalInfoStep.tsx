"use client";

import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  GitBranch,
  ArrowRight,
} from "lucide-react";

interface Props {
  resumeId: string | null;
  onNext: () => void;
}

interface PersonalInfoForm {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  linkedIn: string;
  github: string;
  portfolio: string;
}

export default function PersonalInfoStep({ resumeId, onNext }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PersonalInfoForm>();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`/api/resume/${resumeId}`);
      reset(data.data?.personalDetails || {});
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (values: PersonalInfoForm) => {
    try {
      await axios.patch(`/api/resume/${resumeId}`, {
        personalDetails: values,
      });
      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-serif text-sm text-[#1C1F26]">Step 1 of 8</span>
            <span className="text-xs text-[#B8B2A2]">12% complete</span>
          </div>
          <div className="h-[3px] bg-[#E4DFD4]">
            <div className="h-full w-[12%] bg-[#8B3A3A]" />
          </div>
        </div>

        {/* Card */}
        <div className="border border-[#E4DFD4] bg-white p-10">
          <div className="mb-8 border-b border-[#E4DFD4] pb-6">
            <h1 className="font-serif text-2xl text-[#1C1F26]">
              Personal information
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              Tell recruiters how they can reach you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              icon={<User size={17} />}
              placeholder="John Doe"
              label="Full name"
              register={register("fullname")}
            />

            <InputField
              icon={<Mail size={17} />}
              placeholder="john@example.com"
              label="Email"
              register={register("email")}
            />

            <InputField
              icon={<Phone size={17} />}
              placeholder="+91 9876543210"
              label="Phone number"
              register={register("mobile")}
            />

            <InputField
              icon={<MapPin size={17} />}
              placeholder="Bhopal, India"
              label="Location"
              register={register("location")}
            />

            <InputField
              icon={<Link size={17} />}
              placeholder="https://linkedin.com/in/..."
              label="LinkedIn"
              register={register("linkedIn")}
            />

            <InputField
              icon={<GitBranch size={17} />}
              placeholder="https://github.com/..."
              label="GitHub"
              register={register("github")}
            />

            <InputField
              icon={<Globe size={17} />}
              placeholder="https://portfolio.com"
              label="Portfolio"
              register={register("portfolio")}
            />

            <div className="flex justify-end border-t border-[#E4DFD4] pt-6">
              <button
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-[#1C1F26] px-6 py-2.5
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

function InputField({ label, placeholder, icon, register }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#1C1F26]">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B2A2]">
          {icon}
        </div>

        <input
          {...register}
          placeholder={placeholder}
          className="w-full border border-[#E4DFD4] bg-white py-3 pl-12 pr-4
                     text-sm text-[#1C1F26] placeholder:text-[#B8B2A2]
                     focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
        />
      </div>
    </div>
  );
}