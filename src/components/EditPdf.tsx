"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

interface EditPdfProps {
  resumeId?: string;
  label?: string;
}

export default function EditPdf({
  resumeId,
  label = "Edit Resume",
}: EditPdfProps) {
  const router = useRouter();

  const handleEdit = () => {
    if (!resumeId) return;
    router.push(`/resume/${resumeId}`);
  };

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="w-full flex items-center gap-3 border px-4 py-3 rounded-xl hover:bg-slate-50 transition"
    >
      <Eye size={18} />
      {label}
    </button>
  );
}
