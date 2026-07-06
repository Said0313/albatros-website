"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("form");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-bg-border bg-bg-card py-16 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/15">
          <Check className="h-8 w-8 text-[#22C55E]" />
        </div>
        <p className="text-text-primary">{t("success")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-bg-border bg-bg-card p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input name="name" placeholder={t("name")} required />
        <Input name="phone" type="tel" placeholder={t("phone")} required />
      </div>
      <Input name="company" placeholder={t("company")} />
      <textarea
        name="comment"
        rows={4}
        placeholder={t("comment")}
        className="w-full rounded-lg border border-bg-border bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
      />
      <label className="flex items-start gap-2 text-xs text-text-secondary">
        <input type="checkbox" required className="mt-0.5 accent-brand-red" />
        {t("consent")}
      </label>
      {error && <p className="text-sm text-brand-red">{t("error")}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-red flex w-full items-center justify-center gap-2 rounded-lg py-3.5 font-medium"
      >
        <Send className="h-4 w-4" /> {loading ? t("sending") : t("submit")}
      </button>
    </form>
  );
}

function Input({
  name,
  placeholder,
  type = "text",
  required,
}: {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-lg border border-bg-border bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
    />
  );
}
