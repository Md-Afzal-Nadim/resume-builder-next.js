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
      className="w-full flex items-center gap-3 border px-4 py-3 rounded-xl hover:bg-slate-50 transition"
    >
      <Download size={18} />
      {label}
    </button>
  );
}
