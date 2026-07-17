import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { imgUrl } from "../imgUrl";

// Generic list page for Phase 2 content types. Renders a table with thumbnail,
// custom columns, optional reorder arrows (writes the full new order), hide
// toggle, edit link and delete. `api` is a resource() from api.js.
export default function ContentList({
  title,
  api,
  basePath,
  columns, // [{key, label, render(item)}]
  thumb, // (item) => image public path or null
  canHide = true,
  canReorder = true,
  deleteConfirm = (item) => `Удалить "${item.name || item.title || item.id}"? Это действие необратимо.`,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = () => {
    setLoading(true);
    api
      .list()
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const move = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((x) => x.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setBusyId(items[i].id);
    try {
      await api.reorder(ids);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId("");
    }
  };

  const toggleHide = async (item) => {
    setBusyId(item.id);
    try {
      await api.setVisibility(item.id, !item.hidden);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(deleteConfirm(item))) return;
    setBusyId(item.id);
    try {
      await api.remove(item.id);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <div className="text-soft">Загрузка...</div>;
  if (error) return <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          <p className="text-sm text-soft">Всего: {items.length}</p>
        </div>
        <Link to={`${basePath}/new`} className="btn-primary">
          + Добавить
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel text-left text-xs uppercase tracking-wide text-soft">
            <tr>
              {thumb && <th className="px-4 py-3">Фото</th>}
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
              {canHide && <th className="px-4 py-3">Статус</th>}
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-t border-line">
                {thumb && (
                  <td className="px-4 py-2">
                    {thumb(item) ? (
                      <img
                        src={imgUrl(thumb(item))}
                        alt=""
                        className="h-12 w-16 rounded border border-line bg-white object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded border border-line text-xs text-soft">
                        нет
                      </div>
                    )}
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-2">
                    {c.render(item)}
                  </td>
                ))}
                {canHide && (
                  <td className="px-4 py-2">
                    {item.hidden ? (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Скрыт
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Опубликован
                      </span>
                    )}
                  </td>
                )}
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    {canReorder && (
                      <>
                        <button
                          className="btn-ghost"
                          disabled={i === 0 || busyId === item.id}
                          onClick={() => move(i, -1)}
                        >
                          ↑
                        </button>
                        <button
                          className="btn-ghost"
                          disabled={i === items.length - 1 || busyId === item.id}
                          onClick={() => move(i, 1)}
                        >
                          ↓
                        </button>
                      </>
                    )}
                    <Link to={`${basePath}/${item.id}`} className="btn-ghost">
                      Изменить
                    </Link>
                    {canHide && (
                      <button
                        className="btn-ghost"
                        disabled={busyId === item.id}
                        onClick={() => toggleHide(item)}
                      >
                        {item.hidden ? "Показать" : "Скрыть"}
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      disabled={busyId === item.id}
                      onClick={() => remove(item)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={99} className="px-4 py-8 text-center text-soft">
                  Пока пусто. Нажмите «Добавить».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
