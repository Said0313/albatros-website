import { useState } from "react";

/**
 * Shared live-search used by every admin list section (products, partners,
 * clients, certificates, events, audit log). One implementation so the boxes
 * look and behave identically everywhere.
 *
 * `useSearch(items, toText)` owns the query state and returns the filtered
 * list. Matching is case insensitive and works for Cyrillic (String
 * .toLowerCase covers Russian), and is a partial match anywhere in the text,
 * not just a prefix. `toText(item)` returns all searchable fields joined into
 * one string, so a Latin name (Maglumi X3) and the Russian text around it are
 * both matched by their own script; there is no cross-script transliteration.
 */
export function useSearch(items, toText) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((it) => (toText(it) || "").toLowerCase().includes(q))
    : items;
  return { query, setQuery, filtered };
}

/**
 * Search input styled to match the panel's existing toolbars (.field). Renders
 * a clear button once there is text and a "Найдено: N" count while filtering.
 * Extra per-section filters (category / author / type selects) can be passed as
 * children so they sit in the same toolbar row.
 */
export default function SearchBox({ query, setQuery, count, placeholder, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative w-full max-w-xs">
        <input
          className="field pr-8"
          placeholder={placeholder || "Поиск..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск"
        />
        {query && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-soft hover:text-ink"
          >
            ×
          </button>
        )}
      </div>
      {children}
      {query.trim() !== "" && (
        <span className="text-sm text-soft">Найдено: {count}</span>
      )}
    </div>
  );
}
