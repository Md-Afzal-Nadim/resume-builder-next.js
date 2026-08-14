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
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      {/* Left - brand panel */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-14 text-white z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <Sparkles size={18} className="text-violet-300" />
          </div>
          <span className="font-semibold tracking-tight text-lg">
            AI Resume Builder
          </span>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Welcome back.
          </h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Pick up where you left off — your ATS-optimized resume is
            saved and ready to keep building.
          </p>

          <div className="mt-10 flex gap-8 text-sm text-slate-400">
            <div>
              <div className="text-2xl font-bold text-white">98%</div>
              ATS pass rate
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3 min</div>
              avg. build time
            </div>
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Log in
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Access your resume dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-300">
                Mobile number
              </label>
              <div className="relative flex items-stretch">
                <span className="flex items-center gap-1.5 rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 text-sm text-slate-400">
                  <Phone size={15} />
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
                  className="w-full pl-3 pr-4 py-3 rounded-r-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />
              </div>
              {errors.mobile && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
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
                  placeholder="********"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-violet-900/30 mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?
            <Link
              href="/auth/register"
              className="ml-1.5 text-violet-400 font-semibold hover:text-violet-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}