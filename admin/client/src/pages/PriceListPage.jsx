import { useEffect, useRef, useState } from "react";
import { api } from "../api";

function fmtSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " МБ";
  return Math.round(bytes / 1024) + " КБ";
}

export default function PriceListPage() {
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const fileRef = useRef(null);

  const load = () => {
    api.priceListInfo().then(setInfo).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const handle = async (file) => {
    if (!file) return;
    setError("");
    setOk("");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Нужен PDF-файл.");
      return;
    }
    setBusy(true);
    try {
      const d = await api.priceListUpload(file);
      setOk("Прайс-лист заменён. Коммит: " + (d.commit?.commit || "—"));
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-extrabold text-ink">Прайс-лист</h1>
      <p className="mb-6 text-sm text-soft">
        Файл, который скачивается по кнопке «Скачать прайс-лист» на сайте (/price-list.pdf).
        Замена файла сохраняет тот же адрес, все кнопки продолжают работать.
      </p>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {ok && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{ok}</div>}

      <div className="card p-5">
        <h2 className="mb-3 font-bold text-ink">Текущий файл</h2>
        {info?.exists ? (
          <div className="mb-5 text-sm text-soft">
            Размер: <span className="font-semibold text-ink">{fmtSize(info.size)}</span>
            {" · "}Обновлён:{" "}
            <span className="font-semibold text-ink">
              {info.modified ? new Date(info.modified).toLocaleString("ru-RU") : "—"}
            </span>
          </div>
        ) : (
          <div className="mb-5 text-sm text-soft">Файл ещё не загружен.</div>
        )}

        <div
          className="rounded-lg border-2 border-dashed border-line p-8 text-center text-sm text-soft"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handle(e.dataTransfer.files[0]);
          }}
        >
          Перетащите новый PDF сюда или{" "}
          <button
            type="button"
            className="font-semibold text-clinical underline"
            onClick={() => fileRef.current?.click()}
          >
            выберите файл
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              handle(e.target.files[0]);
              e.target.value = "";
            }}
          />
          {busy && <div className="mt-2 text-xs">Загрузка...</div>}
        </div>
      </div>
    </div>
  );
}
