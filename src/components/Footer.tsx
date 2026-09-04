// components/Footer.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const DASHBOARD_ROUTES = ["/resume", "/profile"];

export default function Footer() {
  const pathname = usePathname();

  const isDashboardRoute = DASHBOARD_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isDashboardRoute) {
    return null;
  }

  return (
    <footer className="border-t border-[#E4DFD4] bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          {/* Brand + description */}
          <div>
            <Link href="/resume" className="font-serif text-xl text-[#1C1F26]">
              Resume<span className="text-[#8B3A3A]">Builder</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6B7280]">
              AI-powered resumes that get you past the filters and in front
              of a real person — write once, let AI sharpen the wording, and
              export a version built to pass ATS software.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <Sparkles size={13} className="text-[#8B3A3A]" />
              98% ATS pass rate across resumes built here
            </div>
          </div>

          {/* Product links */}
          <div>
            <p className="font-serif text-sm text-[#1C1F26]">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B7280]">
              <li>
                <Link href="/resume" className="transition hover:text-[#1C1F26]">
                  My resumes
                </Link>
              </li>
              <li>
                <Link href="/resume" className="transition hover:text-[#1C1F26]">
                  Create new resume
                </Link>
              </li>
              <li>
                <Link href="/profile" className="transition hover:text-[#1C1F26]">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <p className="font-serif text-sm text-[#1C1F26]">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6B7280]">
              <li>
                <Link href="/profile" className="transition hover:text-[#1C1F26]">
                  Account settings
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="transition hover:text-[#1C1F26]">
                  Switch account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E4DFD4] pt-6 text-xs text-[#9CA3AF]">
          © 2026 ResumeBuilder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}