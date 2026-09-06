"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface EditPdfProps {
  resumeId?: string;
  label?: string;
}

export default function EditPdf({
  resumeId,
  label = "Edit resume",
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
      disabled={!resumeId}
      className="flex w-full items-center gap-3 border border-[#E4DFD4] px-4 py-3
                 text-sm font-medium text-[#1C1F26] transition hover:bg-[#FAF8F3]
                 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Pencil size={16} className="text-[#8B3A3A]" />
      {label}
    </button>
  );
}