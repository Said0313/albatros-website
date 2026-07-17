import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const TYPE_RU = {
  product: "Продукт",
  partner: "Партнёр",
  client: "Клиент",
  certificate: "Сертификат",
  event: "Мероприятие",
  "price-list": "Прайс-лист",
  other: "Другое",
};

const VERB_RU = {
  add: "добавление",
  update: "изменение",
  delete: "удаление",
  hide: "скрытие",
  show: "показ",
  reorder: "изменение порядка",
  replace: "замена",
  revert: "откат",
  other: "изменение",
};

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function Details({ hash }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.auditDetails(hash).then(setData).catch((e) => setError(e.message));
  }, [hash]);
  if (error) return <div className="p-4 text-sm text-red-700">{error}</div>;
  if (!data) return <div className="p-4 text-sm text-soft">Загрузка деталей...</div>;
  return (
    <div className="space-y-3 p-4">
      <div>
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-soft">
          Изменённые файлы
        </div>
        <ul className="space-y-0.5">
          {data.files.map((f) => (
            <li key={f.path} className="font-mono text-xs text-ink">
              {f.path}{" "}
              <span className="text-emerald-600">+{f.insertions}</span>{" "}
              <span className="text-red-600">-{f.deletions}</span>
            </li>
          ))}
        </ul>
      </div>
      {data.diff && data.diff.trim() && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-soft">
            Изменения в данных
          </div>
          <pre className="max-h-80 overflow-auto rounded-lg bg-panel p-3 text-[11px] leading-relaxed text-ink">
            {data.diff}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function AuditLog() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState("");
  const [busy, setBusy] = useState("");

  const load = () => {
    setLoading(true);
    api
      .auditList()
      .then((d) => setCommits(d.commits))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const authors = useMemo(() => Array.from(new Set(commits.map((c) => c.author))).sort(), [commits]);
  const types = useMemo(
    () => Array.from(new Set(commits.map((c) => c.type))).filter((t) => TYPE_RU[t]),
    [commits]
  );

  const filtered = commits
    .filter((c) => (author ? c.author === author : true))
    .filter((c) => (type ? c.type === type : true));

  const revert = async (c) => {
    const okConfirm = window.confirm(
      `Откатить изменение "${VERB_RU[c.verb] || c.verb}: ${c.target}" (автор: ${c.author})?\n\n` +
        "Будет создан НОВЫЙ коммит, отменяющий это изменение. История не переписывается, " +
        "сам факт отката тоже попадёт в журнал."
    );
    if (!okConfirm) return;
    setBusy(c.hash);
    setError("");
    setOk("");
    try {
      const d = await api.auditRevert(c.hash);
      setOk(`Изменение откачено. Новый коммит: ${d.revertCommit}`);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy("");
    }
  };

  if (loading) return <div className="text-soft">Загрузка истории...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">История изменений</h1>
        <p className="text-sm text-soft">
          Все изменения контента через панель. Откат создаёт новую запись-отмену, ничего не удаляя.
        </p>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {ok && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{ok}</div>}

      <div className="mb-4 flex flex-wrap gap-3">
        <select className="field max-w-xs" value={author} onChange={(e) => setAuthor(e.target.value)}>
          <option value="">Все авторы</option>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select className="field max-w-xs" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Все разделы</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {TYPE_RU[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel text-left text-xs uppercase tracking-wide text-soft">
            <tr>
              <th className="px-4 py-3">Когда</th>
              <th className="px-4 py-3">Кто</th>
              <th className="px-4 py-3">Раздел</th>
              <th className="px-4 py-3">Что изменено</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <>
                <tr key={c.hash} className="border-t border-line">
                  <td className="whitespace-nowrap px-4 py-2 text-soft">{fmtDate(c.date)}</td>
                  <td className="px-4 py-2 font-medium text-ink">{c.author}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-panel px-2 py-0.5 text-xs font-semibold text-clinical">
                      {TYPE_RU[c.type] || c.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {c.isRevert && (
                      <span className="mr-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                        откат
                      </span>
                    )}
                    <span className="text-ink">
                      {VERB_RU[c.verb] || c.verb}: {c.target}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn-ghost"
                        onClick={() => setOpen(open === c.hash ? "" : c.hash)}
                      >
                        {open === c.hash ? "Скрыть" : "Детали"}
                      </button>
                      <button
                        className="btn-danger"
                        disabled={busy === c.hash}
                        onClick={() => revert(c)}
                      >
                        {busy === c.hash ? "Откат..." : "Откатить"}
                      </button>
                    </div>
                  </td>
                </tr>
                {open === c.hash && (
                  <tr key={c.hash + "-details"} className="border-t border-line bg-white">
                    <td colSpan={5}>
                      <Details hash={c.hash} />
                    </td>
                  </tr>
                )}
              </>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-soft">
                  Изменений пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
