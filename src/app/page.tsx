"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Pencil,
  Download,
  Menu,
  X,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#templates", label: "Templates" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF8F3] text-[#1C1F26]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#E4DFD4] bg-[#FAF8F3]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="font-serif text-xl sm:text-2xl">
            Resume<span className="text-[#8B3A3A]">Builder</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#6B7280] transition hover:text-[#1C1F26]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/auth/login"
              className="text-sm text-[#6B7280] transition hover:text-[#1C1F26]"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="bg-[#1C1F26] px-5 py-2.5 text-sm font-medium text-[#FAF8F3] transition hover:bg-[#8B3A3A]"
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 text-[#1C1F26] md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="space-y-5 border-t border-[#E4DFD4] bg-[#FAF8F3] px-5 py-6 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-base text-[#374151] transition hover:text-[#1C1F26]"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#E4DFD4] pt-4">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-center text-sm text-[#6B7280]"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="bg-[#1C1F26] px-5 py-3 text-center text-sm font-medium text-[#FAF8F3]"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Copy */}
          <div>
            <h1 className="font-serif text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
              A resume that reads like you already got the job.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#6B7280] sm:text-lg">
              Fill in your experience, let AI sharpen the wording, and export
              a resume built to pass applicant tracking systems — not just
              look good on screen.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1C1F26] px-7 py-3.5 text-sm font-medium text-[#FAF8F3] transition hover:bg-[#8B3A3A]"
              >
                Create my resume
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#templates"
                className="inline-flex items-center justify-center gap-2 border border-[#E4DFD4] px-7 py-3.5 text-sm font-medium text-[#1C1F26] transition hover:bg-white"
              >
                View templates
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-10 border-t border-[#E4DFD4] pt-8">
              <div>
                <div className="font-serif text-2xl text-[#1C1F26]">50K+</div>
                <div className="mt-1 text-xs text-[#9CA3AF]">Resumes created</div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#1C1F26]">98%</div>
                <div className="mt-1 text-xs text-[#9CA3AF]">ATS pass rate</div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-serif text-2xl text-[#1C1F26]">
                  4.9
                  <Star size={14} className="fill-[#8B3A3A] text-[#8B3A3A]" />
                </div>
                <div className="mt-1 text-xs text-[#9CA3AF]">Average rating</div>
              </div>
            </div>
          </div>

          {/* Hero resume mockup */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              className="relative border border-[#E4DFD4] bg-white p-8 shadow-[0_20px_60px_-20px_rgba(28,31,38,0.25)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)",
              }}
            >
              <div
                className="absolute right-0 top-0 h-[28px] w-[28px]"
                style={{
                  background: "linear-gradient(135deg, transparent 50%, #E4DFD4 50%)",
                }}
              />
              <div className="h-4 w-2/3 bg-[#1C1F26]" />
              <div className="mt-3 h-2 w-1/2 bg-[#D8D2C4]" />

              <div className="mt-7 h-2.5 w-20 bg-[#8B3A3A]/70" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full bg-[#EFEBE1]" />
                <div className="h-2 w-5/6 bg-[#EFEBE1]" />
                <div className="h-2 w-4/6 bg-[#EFEBE1]" />
              </div>

              <div className="mt-6 h-2.5 w-24 bg-[#8B3A3A]/70" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["React", "Node.js", "SQL", "Figma"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#E4DFD4] px-2 py-0.5 text-[10px] text-[#4B5563]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* small accent badge */}
            <div className="absolute -bottom-5 -left-5 flex items-center gap-2 border border-[#E4DFD4] bg-white px-4 py-2.5 shadow-[0_8px_24px_-12px_rgba(28,31,38,0.2)]">
              <Sparkles size={14} className="text-[#8B3A3A]" />
              <span className="text-xs font-medium text-[#1C1F26]">AI-suggested wording</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-[#E4DFD4] bg-white px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-md font-serif text-3xl sm:text-4xl">
            Everything you need to get hired
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<Sparkles size={19} />}
              title="AI-powered"
              description="Smart suggestions for summaries, experience, and skills."
            />
            <Feature
              icon={<ShieldCheck size={19} />}
              title="ATS friendly"
              description="Built to get parsed correctly by hiring software."
            />
            <Feature
              icon={<Pencil size={19} />}
              title="Easy to edit"
              description="Update any section in seconds, no formatting fuss."
            />
            <Feature
              icon={<Download size={19} />}
              title="Export as PDF"
              description="Download a print-ready resume with one click."
            />
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl sm:text-4xl">
              A template for how you want to be read
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6B7280] sm:text-base">
              Pick a layout, then fill it with your own experience and skills.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <TemplateCard
              title="Professional"
              description="Clean and traditional — a safe, strong default."
            />
            <TemplateCard
              title="Modern"
              description="A little more character. Good fit for design and dev roles."
            />
            <TemplateCard
              title="ATS Resume"
              description="Stripped back for maximum parsing accuracy."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl border border-[#E4DFD4] bg-white px-6 py-14 text-center sm:px-10 sm:py-16">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Ready to build your resume?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#6B7280] sm:text-base">
            Create a professional resume in minutes and take the next step
            toward your next job.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 bg-[#1C1F26] px-8 py-3.5 text-sm font-medium text-[#FAF8F3] transition hover:bg-[#8B3A3A]"
          >
            Start building
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#E4DFD4] px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-[#9CA3AF] sm:flex-row sm:items-center">
          <p>© 2026 ResumeBuilder. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/auth/login" className="transition hover:text-[#1C1F26]">
              Log in
            </Link>
            <Link href="/auth/register" className="transition hover:text-[#1C1F26]">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Feature Component */
function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-[#E4DFD4] p-6">
      <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#E4DFD4] text-[#8B3A3A]">
        {icon}
      </div>
      <h3 className="font-serif text-lg text-[#1C1F26]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{description}</p>
    </div>
  );
}

/* Template Component */
function TemplateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group border border-[#E4DFD4] bg-white transition hover:border-[#8B3A3A]/40">
      <div className="h-64 border-b border-[#E4DFD4] bg-[#FAF8F3] p-6 sm:h-72">
        <div className="h-3.5 w-28 bg-[#1C1F26]" />
        <div className="mt-2.5 h-2 w-40 bg-[#D8D2C4]" />

        <div className="mt-7 space-y-2.5">
          <div className="h-2 w-full bg-[#E4DFD4]" />
          <div className="h-2 w-5/6 bg-[#E4DFD4]" />
          <div className="h-2 w-4/6 bg-[#E4DFD4]" />
        </div>

        <div className="mt-7 space-y-2.5">
          <div className="h-2.5 w-20 bg-[#8B3A3A]/60" />
          <div className="h-2 w-full bg-[#E4DFD4]" />
          <div className="h-2 w-5/6 bg-[#E4DFD4]" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-[#1C1F26]">{title}</h3>
        <p className="mt-1.5 text-sm text-[#6B7280]">{description}</p>
      </div>
    </div>
  );
}