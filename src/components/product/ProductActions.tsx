"use client";

import { useState } from "react";
import { Phone, Link2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContactModal } from "@/components/ui/ContactModal";

export function ProductActions({ name }: { name: string }) {
  const { open } = useContactModal();
  const tc = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3 max-sm:flex-col">
      <button
        onClick={() => open(name)}
        className="btn-red flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium max-sm:w-full"
      >
        <Phone className="h-4 w-4" /> {tc("requestPrice")}
      </button>
      <button
        onClick={copy}
        className="flex items-center justify-center gap-2 rounded-lg border border-bg-border px-5 py-3 text-text-secondary hover:text-text-primary max-sm:w-full"
      >
        {copied ? <Check className="h-4 w-4 text-[#22C55E]" /> : <Link2 className="h-4 w-4" />}
        {copied ? tc("copied") : tc("share")}
      </button>
    </div>
  );
}
