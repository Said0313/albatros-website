"use client";

import { useState } from "react";
import { Phone, Link2, Check } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";

export function ProductActions({ name }: { name: string }) {
  const { open } = useContactModal();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <button
        onClick={() => open(name)}
        className="btn-red flex items-center gap-2 rounded-lg px-6 py-3 font-medium"
      >
        <Phone className="h-4 w-4" /> Запросить цену
      </button>
      <button
        onClick={copy}
        className="flex items-center gap-2 rounded-lg border border-bg-border px-5 py-3 text-text-secondary hover:text-text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-[#22C55E]" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Скопировано" : "Поделиться"}
      </button>
    </div>
  );
}
