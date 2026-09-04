"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { loginApi } from "@/apis/auth.api";

type LoginFormData = {
  email: string;
  mobile: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginApi(data);
      router.push("/resume");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F3]">
      {/* Left - brand panel */}
      <div className="relative hidden flex-1 flex-col justify-between border-r border-[#E4DFD4] bg-[#1C1F26] p-14 text-[#FAF8F3] lg:flex">
        <Link href="/" className="font-serif text-xl">
          Resume<span className="text-[#C97B7B]">Builder</span>
        </Link>

        <div className="max-w-md">
          <h2 className="font-serif text-4xl leading-tight">Welcome back.</h2>
          <p className="mt-4 leading-relaxed text-[#B8B2A2]">
            Pick up where you left off — your ATS-optimized resume is saved
            and ready to keep building.
          </p>

          <div className="mt-10 flex gap-10 border-t border-white/10 pt-8 text-sm text-[#9CA3AF]">
            <div>
              <div className="font-serif text-2xl text-[#FAF8F3]">98%</div>
              ATS pass rate
            </div>
            <div>
              <div className="font-serif text-2xl text-[#FAF8F3]">3 min</div>
              Avg. build time
            </div>
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md border border-[#E4DFD4] bg-white p-8 sm:p-10">
          <div className="mb-2 flex items-center gap-2 lg:hidden">
            <Sparkles size={16} className="text-[#8B3A3A]" />
            <span className="font-serif text-lg text-[#1C1F26]">ResumeBuilder</span>
          </div>

          <h2 className="font-serif text-2xl text-[#1C1F26] sm:text-3xl">Log in</h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Access your resume dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B2A2]"
                />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  placeholder="john@example.com"
                  className="w-full border border-[#E4DFD4] bg-white py-3 pl-10 pr-4 text-sm
                             text-[#1C1F26] placeholder:text-[#B8B2A2]
                             focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-[#8B3A3A]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                Mobile number
              </label>
              <div className="flex items-stretch">
                <span className="flex items-center gap-1.5 border border-r-0 border-[#E4DFD4] bg-[#FAF8F3] px-3 text-sm text-[#6B7280]">
                  <Phone size={14} />
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                  placeholder="98765 43210"
                  className="w-full border border-[#E4DFD4] bg-white py-3 pl-3 pr-4 text-sm
                             text-[#1C1F26] placeholder:text-[#B8B2A2]
                             focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1.5 text-xs text-[#8B3A3A]">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1C1F26]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8B2A2]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="········"
                  className="w-full border border-[#E4DFD4] bg-white py-3 pl-10 pr-11 text-sm
                             text-[#1C1F26] placeholder:text-[#B8B2A2]
                             focus:border-[#8B3A3A] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B8B2A2] transition hover:text-[#1C1F26]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#8B3A3A]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 bg-[#1C1F26]
                         py-3 text-sm font-medium text-[#FAF8F3] transition
                         hover:bg-[#8B3A3A] disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Don't have an account?
            <Link
              href="/auth/register"
              className="ml-1.5 font-medium text-[#8B3A3A] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}