import { useEffect, useRef, useState } from "react";
import { api } from "../api";

// "Черновик UZ" helper for a bilingual field pair. Renders the button (placed
// next to the UZ field's label) and a "черновик, проверьте" badge that stays
// until the admin edits the drafted text. `source` is the RU text, `value` the
// current UZ value, `onChange` writes the draft into the UZ field.
export default function DraftUz({ source, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const draftText = useRef("");

  // The badge disappears as soon as the user modifies the drafted text.
  useEffect(() => {
    if (isDraft && value !== draftText.current) setIsDraft(false);
  }, [value, isDraft]);

  const generate = async () => {
    setNote("");
    if (!source || !source.trim()) {
      setNote("Сначала заполните поле RU.");
      return;
    }
    setBusy(true);
    try {
      const d = await api.translateDraft(source);
      if (d.configured === false) {
        setNote(d.error || "Перевод не настроен.");
        return;
      }
      draftText.current = d.text;
      onChange(d.text);
      setIsDraft(true);
    } catch (e) {
      setNote(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded border border-line bg-white px-2 py-0.5 text-[11px] font-semibold text-clinical hover:bg-panel disabled:opacity-50"
        onClick={generate}
        disabled={busy}
        title="Сгенерировать черновик перевода из поля RU. Черновик нужно проверить перед сохранением."
      >
        {busy ? "Перевод..." : "Черновик UZ"}
      </button>
      {isDraft && (
        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
          черновик, проверьте
        </span>
      )}
      {note && <span className="text-[11px] text-red-600">{note}</span>}
    </span>
  );
}
