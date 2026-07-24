"use client";

import { useState } from "react";

/** Groups raw digits into the Uzbek mobile pattern: 2-3-2-2 (e.g. "90 123 45 67"). */
function formatLocal(digits: string): string {
  const d = digits.slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

/**
 * Phone field with a fixed +998 country code and live "XX XXX XX XX" grouping
 * on the remaining 9 digits. The visible input only ever holds the local part
 * (so native `required` validation works on it); a hidden field carries the
 * full "+998 XX XXX XX XX" value under `name` for form submission.
 */
export function PhoneInput({ name, required }: { name: string; required?: boolean }) {
  const [local, setLocal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(e.target.value.replace(/\D/g, "").slice(0, 9));
  };

  const formatted = formatLocal(local);
  const full = `+998${formatted ? " " + formatted : ""}`;

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-bg-border bg-bg-elevated focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red">
      <span className="flex select-none items-center border-r border-bg-border px-3 text-sm text-text-secondary">
        +998
      </span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formatted}
        onChange={handleChange}
        placeholder="90 123 45 67"
        required={required}
        className="w-full bg-transparent px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      <input type="hidden" name={name} value={full} />
    </div>
  );
}
