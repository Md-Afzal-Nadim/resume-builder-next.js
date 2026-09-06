"use client";

import { Download } from "lucide-react";

interface DownloadPdfProps {
  label?: string;
}

export default function DownloadPdf({ label = "Download PDF" }: DownloadPdfProps) {
  const handleDownload = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex w-full items-center gap-3 border border-[#E4DFD4] px-4 py-3
                 text-sm font-medium text-[#1C1F26] transition hover:bg-[#FAF8F3]"
    >
      <Download size={16} className="text-[#8B3A3A]" />
      {label}
    </button>
  );
}