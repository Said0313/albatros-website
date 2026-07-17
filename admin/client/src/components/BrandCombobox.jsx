import { useEffect, useRef, useState } from "react";

// A combobox styled to match the form's <select className="field"> controls:
// same box (via `.field`) plus a chevron on the right. It shows a filterable
// suggestion list AND lets the user type a brand that is not in the list. When
// the typed value has no match, an explicit "add brand" row writes that value
// straight into the field. No brand registry: a new brand is just the typed
// string; it reappears in suggestions next time because the list is rebuilt
// from catalog brands.
export default function BrandCombobox({ value, onChange, options, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);

  // Close when clicking outside the widget.
  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const q = (value || "").trim().toLowerCase();
  const filtered = options.filter((o) => o.toLowerCase().includes(q));
  const exact = options.some((o) => o.toLowerCase() === q);
  const showAdd = q.length > 0 && !exact;
  const addIndex = showAdd ? filtered.length : -1;
  const total = filtered.length + (showAdd ? 1 : 0);

  const choose = (val) => {
    onChange(val);
    setOpen(false);
    setHighlight(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && highlight >= 0) {
        e.preventDefault();
        if (highlight === addIndex) choose((value || "").trim());
        else choose(filtered[highlight]);
      } else {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={"relative " + className}>
      <input
        className="field pr-9"
        value={value}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-soft">
        ▾
      </span>

      {open && total > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-line bg-white py-1 text-sm shadow-lg">
          {filtered.map((o, i) => (
            <li
              key={o}
              className={
                "cursor-pointer px-3 py-2 " + (i === highlight ? "bg-panel" : "hover:bg-panel")
              }
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(o)}
            >
              {o}
            </li>
          ))}
          {showAdd && (
            <li
              className={
                "cursor-pointer px-3 py-2 font-semibold text-clinical " +
                (addIndex === highlight ? "bg-panel" : "hover:bg-panel")
              }
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setHighlight(addIndex)}
              onClick={() => choose((value || "").trim())}
            >
              ➕ Добавить бренд: &quot;{(value || "").trim()}&quot;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
