// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, User, LogOut } from "lucide-react";


const HIDDEN_ROUTES = ["/", "/auth/login", "/auth/register"];


const links = [
  { href: "/allResume", label: "Resumes" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();


  if (HIDDEN_ROUTES.includes(pathname)) {
    return null;
  }


  return (
       <header className="print:hidden sticky top-0 z-40 border-b border-[#E4DFD4] bg-[#FAF8F3]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/resume" className="font-serif text-xl text-[#1C1F26]">
          Resume<span className="text-[#8B3A3A]">Builder</span>
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${
                  active
                    ? "font-medium text-[#1C1F26]"
                    : "text-[#6B7280] hover:text-[#1C1F26]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button className="flex items-center gap-1.5 text-sm text-[#6B7280] transition hover:text-[#8B3A3A]">
            <LogOut size={15} />
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}