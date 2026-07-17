import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { imgUrl } from "../imgUrl";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [busySlug, setBusySlug] = useState("");

  const load = () => {
    setLoading(true);
    api
      .listProducts()
      .then((d) => setProducts(d.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.brand || "").toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle)
      );
    });
  }, [products, q, category]);

  const toggleHide = async (p) => {
    setBusySlug(p.slug);
    try {
      await api.setVisibility(p.slug, !p.hidden);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusySlug("");
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Удалить продукт "${p.name}"? Это действие необратимо.`)) return;
    setBusySlug(p.slug);
    try {
      await api.deleteProduct(p.slug);
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusySlug("");
    }
  };

  if (loading) return <div className="text-soft">Загрузка каталога...</div>;
  if (error) return <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Продукты</h1>
          <p className="text-sm text-soft">Всего: {products.length}</p>
        </div>
        <Link to="/products/new" className="btn-primary">
          + Добавить продукт
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="field max-w-xs"
          placeholder="Поиск по названию, бренду, slug..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="field max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-panel text-left text-xs uppercase tracking-wide text-soft">
            <tr>
              <th className="px-4 py-3">Фото</th>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Бренд</th>
              <th className="px-4 py-3">Приоритет</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-t border-line">
                <td className="px-4 py-2">
                  {p.images && p.images[0] ? (
                    <img
                      src={imgUrl(p.images[0])}
                      alt={p.name}
                      className="h-12 w-12 rounded border border-line object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-line text-xs text-soft">
                      нет
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 font-semibold text-ink">
                  <Link to={`/products/${p.slug}`} className="hover:text-clinical">
                    {p.name}
                  </Link>
                  <div className="text-xs font-normal text-soft">{p.slug}</div>
                </td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.brand}</td>
                <td className="px-4 py-2">{p.priority ?? "—"}</td>
                <td className="px-4 py-2">
                  {p.hidden ? (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Скрыт
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Опубликован
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link to={`/products/${p.slug}`} className="btn-ghost">
                      Изменить
                    </Link>
                    <button
                      className="btn-ghost"
                      disabled={busySlug === p.slug}
                      onClick={() => toggleHide(p)}
                    >
                      {p.hidden ? "Показать" : "Скрыть"}
                    </button>
                    <button
                      className="btn-danger"
                      disabled={busySlug === p.slug}
                      onClick={() => remove(p)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-soft">
                  Ничего не найдено.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
