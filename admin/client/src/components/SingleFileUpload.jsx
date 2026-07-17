import { useRef, useState } from "react";
import { imgUrl } from "../imgUrl";

// Single-file upload zone (logo, certificate image, PDF). Shows the current
// value (image preview or file path), uploads via the provided handler which
// must return the new public path, and reports it through onChange.
export default function SingleFileUpload({
  value,
  onChange,
  onUpload, // async (file) => publicPath
  accept = "image/*",
  hint,
  preview = true,
}) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const path = await onUpload(file);
      onChange(path);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        className="rounded-lg border-2 border-dashed border-line p-4 text-center text-sm text-soft"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handle(e.dataTransfer.files[0]);
        }}
      >
        {value ? (
          preview ? (
            <img
              src={imgUrl(value)}
              alt=""
              className="mx-auto mb-2 max-h-24 w-auto rounded border border-line bg-white object-contain p-2"
            />
          ) : (
            <code className="mb-2 block truncate text-xs text-ink">{value}</code>
          )
        ) : (
          <p className="mb-1">Файл не выбран.</p>
        )}
        Перетащите файл сюда или{" "}
        <button
          type="button"
          className="font-semibold text-clinical underline"
          onClick={() => fileRef.current?.click()}
        >
          выберите
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            handle(e.target.files[0]);
            e.target.value = "";
          }}
        />
        {hint && <div className="mt-1 text-xs">{hint}</div>}
        {busy && <div className="mt-1 text-xs">Загрузка...</div>}
        {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
      </div>
      {value && (
        <button
          type="button"
          className="mt-2 text-xs text-red-600 underline"
          onClick={() => onChange("")}
        >
          Убрать файл
        </button>
      )}
    </div>
  );
}
