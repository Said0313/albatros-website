import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { imgUrl } from "../imgUrl";
import BrandCombobox from "../components/BrandCombobox.jsx";
import DraftUz from "../components/DraftUz.jsx";
import PublishStatus from "../components/PublishStatus.jsx";

const EMPTY = {
  name: "",
  slug: "",
  category: "",
  generalDirection: "equipment",
  brand: "",
  priority: "",
  hidden: false,
  featured: false,
  isNew: false,
  shortDescription: "",
  shortDescriptionUz: "",
  shortDescriptionEn: "",
  fullDescription: "",
  fullDescriptionUz: "",
  fullDescriptionEn: "",
  videoUrl: "",
  detailedDescription: "",
  detailedDescriptionUz: "",
  specifications: [],
  analytes: [],
  images: [],
};

export default function ProductEdit({ mode }) {
  const isNew = mode === "new";
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [meta, setMeta] = useState({ categories: [], brands: [], generalDirections: [] });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [commit, setCommit] = useState(null);
  const [catalogBrands, setCatalogBrands] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    api.meta().then(setMeta).catch((e) => setError(e.message));
  }, []);

  // Brand suggestions: unique catalog brands merged with brands.json names.
  useEffect(() => {
    api
      .listProducts()
      .then((d) => setCatalogBrands(d.products.map((p) => p.brand).filter(Boolean)))
      .catch(() => {});
  }, []);

  const brandOptions = useMemo(() => {
    const merged = new Set(
      [...(meta.brands || []).map((b) => b.name), ...catalogBrands].filter(Boolean)
    );
    return Array.from(merged).sort((a, b) => a.localeCompare(b));
  }, [meta.brands, catalogBrands]);

  useEffect(() => {
    if (isNew) return;
    api
      .getProduct(slug)
      .then((d) => {
        const p = d.product;
        setForm({
          ...EMPTY,
          ...p,
          generalDirection: p.generalDirection || "equipment",
          priority: p.priority ?? "",
          hidden: !!p.hidden,
          featured: !!p.featured,
          isNew: !!p.isNew,
          specifications: p.specifications || [],
          analytes: p.analytes || [],
          images: p.images || [],
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── images ──
  const doUpload = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    setError("");
    try {
      const base = form.slug || form.name || "product";
      for (const file of files) {
        const d = await api.uploadImage(file, base);
        setForm((f) => ({ ...f, images: [...f.images, d.path] }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (i, dir) => {
    setForm((f) => {
      const imgs = [...f.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return f;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...f, images: imgs };
    });
  };

  const removeImage = (i) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  };

  // ── specifications ──
  const addSpec = () => set("specifications", [...form.specifications, { label: "", value: "" }]);
  const setSpec = (i, key, val) =>
    set(
      "specifications",
      form.specifications.map((s, idx) => (idx === i ? { ...s, [key]: val } : s))
    );
  const removeSpec = (i) =>
    set("specifications", form.specifications.filter((_, idx) => idx !== i));

  // ── analytes (related items) ──
  const addAnalyte = () => set("analytes", [...form.analytes, ""]);
  const setAnalyte = (i, val) =>
    set("analytes", form.analytes.map((a, idx) => (idx === i ? val : a)));
  const removeAnalyte = (i) =>
    set("analytes", form.analytes.filter((_, idx) => idx !== i));
  const moveAnalyte = (i, dir) => {
    setForm((f) => {
      const items = [...f.analytes];
      const j = i + dir;
      if (j < 0 || j >= items.length) return f;
      [items[i], items[j]] = [items[j], items[i]];
      return { ...f, analytes: items };
    });
  };

  // ── save ──
  const payload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim(),
    category: form.category,
    generalDirection: form.generalDirection,
    brand: form.brand.trim(),
    priority: form.priority === "" ? "" : Number(form.priority),
    hidden: !!form.hidden,
    featured: !!form.featured,
    isNew: !!form.isNew,
    shortDescription: form.shortDescription,
    shortDescriptionUz: form.shortDescriptionUz,
    shortDescriptionEn: form.shortDescriptionEn,
    fullDescription: form.fullDescription,
    fullDescriptionUz: form.fullDescriptionUz,
    fullDescriptionEn: form.fullDescriptionEn,
    videoUrl: form.videoUrl.trim(),
    detailedDescription: form.detailedDescription,
    detailedDescriptionUz: form.detailedDescriptionUz,
    specifications: form.specifications.filter((s) => s.label.trim() !== ""),
    analytes: form.analytes.map((a) => a.trim()).filter(Boolean),
    images: form.images,
  });

  const clientValidate = () => {
    const miss = [];
    if (!form.name.trim()) miss.push("название");
    if (!form.category) miss.push("категория");
    if (!form.generalDirection) miss.push("общее направление");
    if (!form.shortDescription.trim()) miss.push("краткое описание (RU)");
    if (!form.shortDescriptionUz.trim()) miss.push("краткое описание (UZ)");
    if (!form.images.length) miss.push("хотя бы одно фото");
    return miss;
  };

  const save = async () => {
    setError("");
    setCommit(null);
    const miss = clientValidate();
    if (miss.length) {
      setError("Заполните обязательные поля: " + miss.join(", ") + ".");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const d = await api.createProduct(payload());
        setCommit(d.commit);
        navigate(`/products/${d.product.slug}`, { replace: true });
      } else {
        const d = await api.updateProduct(slug, payload());
        setForm((f) => ({ ...f, images: d.product.images || f.images }));
        setCommit(d.commit);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-soft">Загрузка...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" className="text-sm text-soft hover:text-clinical">
            ← К списку
          </Link>
          <h1 className="text-2xl font-extrabold text-ink">
            {isNew ? "Новый продукт" : form.name}
          </h1>
        </div>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <PublishStatus commit={commit} action={isNew ? "Продукт создан" : "Сохранено"} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic */}
        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Основное</h2>

          <label className="label">Название (RU/UZ, бренд или модель) *</label>
          <input className="field mb-1" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <p className="mb-4 text-xs text-soft">
            Названия это бренд/модель и одинаковы на обоих языках.
          </p>

          <label className="label">Slug (адрес страницы)</label>
          <input
            className="field mb-1"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            disabled={!isNew}
            placeholder={isNew ? "например maglumi-x9 (можно оставить пустым)" : ""}
          />
          {!isNew && <p className="mb-4 text-xs text-soft">Slug нельзя менять у существующего продукта.</p>}
          {isNew && <p className="mb-4 text-xs text-soft">Пусто = сформируется из названия.</p>}

          <label className="label">Категория *</label>
          <select className="field mb-4" value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">— выберите —</option>
            {meta.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="label">Общее направление *</label>
          <select
            className="field mb-4"
            value={form.generalDirection}
            onChange={(e) => set("generalDirection", e.target.value)}
          >
            {meta.generalDirections.map((d) => (
              <option key={d.key} value={d.key}>
                {d.name}
              </option>
            ))}
          </select>

          <label className="label">Бренд</label>
          <BrandCombobox
            className="mb-4"
            value={form.brand}
            onChange={(v) => set("brand", v)}
            options={brandOptions}
            placeholder="Выберите из списка или введите свой"
          />

          <label className="label">Приоритет (порядок сортировки)</label>
          <input
            type="number"
            className="field mb-4"
            value={form.priority}
            onChange={(e) => set("priority", e.target.value)}
            placeholder="пусто = в конец списка"
          />

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line accent-clinical"
                checked={form.hidden}
                onChange={(e) => set("hidden", e.target.checked)}
              />
              Скрыт
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line accent-clinical"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Рекомендуемый
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line accent-clinical"
                checked={form.isNew}
                onChange={(e) => set("isNew", e.target.checked)}
              />
              Новинка
            </label>
          </div>
        </section>

        {/* Images */}
        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Фото *</h2>
          <div
            className="mb-4 rounded-lg border-2 border-dashed border-line p-6 text-center text-sm text-soft"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              doUpload(Array.from(e.dataTransfer.files));
            }}
          >
            Перетащите изображения сюда или{" "}
            <button className="font-semibold text-clinical underline" onClick={() => fileRef.current?.click()}>
              выберите файлы
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                doUpload(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
            <div className="mt-2 text-xs">
              Каждое фото приводится к белому холсту 1000×1000. {uploading && "Загрузка..."}
            </div>
          </div>

          <div className="space-y-2">
            {form.images.map((img, i) => (
              <div key={img + i} className="flex items-center gap-3 rounded-lg border border-line p-2">
                <img src={imgUrl(img)} alt="" className="h-14 w-14 rounded object-contain" />
                <code className="flex-1 truncate text-xs text-soft">{img}</code>
                <button className="btn-ghost" onClick={() => moveImage(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === form.images.length - 1}
                >
                  ↓
                </button>
                <button className="btn-danger" onClick={() => removeImage(i)}>
                  Удалить
                </button>
              </div>
            ))}
            {form.images.length === 0 && <p className="text-sm text-soft">Фото пока нет.</p>}
          </div>
        </section>

        {/* Descriptions */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-ink">Описания</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="label">Краткое описание, RU *</label>
              <textarea
                className="field mb-4 h-24"
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Краткое описание, UZ *</label>
                <DraftUz
                  source={form.shortDescription}
                  value={form.shortDescriptionUz}
                  onChange={(v) => set("shortDescriptionUz", v)}
                />
              </div>
              <textarea
                className="field mb-4 h-24"
                value={form.shortDescriptionUz}
                onChange={(e) => set("shortDescriptionUz", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Краткое описание, EN</label>
                <DraftUz
                  lang="en"
                  source={form.shortDescription}
                  value={form.shortDescriptionEn}
                  onChange={(v) => set("shortDescriptionEn", v)}
                />
              </div>
              <textarea
                className="field mb-4 h-24"
                value={form.shortDescriptionEn}
                onChange={(e) => set("shortDescriptionEn", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Полное описание, RU</label>
              <textarea
                className="field h-40"
                value={form.fullDescription}
                onChange={(e) => set("fullDescription", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Полное описание, UZ</label>
                <DraftUz
                  source={form.fullDescription}
                  value={form.fullDescriptionUz}
                  onChange={(v) => set("fullDescriptionUz", v)}
                />
              </div>
              <textarea
                className="field h-40"
                value={form.fullDescriptionUz}
                onChange={(e) => set("fullDescriptionUz", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Полное описание, EN</label>
                <DraftUz
                  lang="en"
                  source={form.fullDescription}
                  value={form.fullDescriptionEn}
                  onChange={(v) => set("fullDescriptionEn", v)}
                />
              </div>
              <textarea
                className="field h-40"
                value={form.fullDescriptionEn}
                onChange={(e) => set("fullDescriptionEn", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Video + detailed description */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-ink">Видео и подробное описание</h2>

          <label className="label">Ссылка на видео YouTube</label>
          <input
            className="field mb-1"
            value={form.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="mb-4 text-xs text-soft">
            Пусто = видео не показывается. Поддерживаются ссылки watch, youtu.be, embed, shorts.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Подробное описание / характеристики, RU</label>
              <textarea
                className="field h-56"
                value={form.detailedDescription}
                onChange={(e) => set("detailedDescription", e.target.value)}
                placeholder="Особенности, загрузка реагентов/образцов, технические характеристики, габариты, вес. Каждый пункт с новой строки."
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Подробное описание / характеристики, UZ</label>
                <DraftUz
                  source={form.detailedDescription}
                  value={form.detailedDescriptionUz}
                  onChange={(v) => set("detailedDescriptionUz", v)}
                />
              </div>
              <textarea
                className="field h-56"
                value={form.detailedDescriptionUz}
                onChange={(e) => set("detailedDescriptionUz", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Характеристики</h2>
            <button className="btn-ghost" onClick={addSpec}>
              + Добавить строку
            </button>
          </div>
          <div className="space-y-2">
            {form.specifications.map((s, i) => (
              <div key={i} className="flex gap-3">
                <input
                  className="field"
                  placeholder="Параметр"
                  value={s.label}
                  onChange={(e) => setSpec(i, "label", e.target.value)}
                />
                <input
                  className="field"
                  placeholder="Значение"
                  value={s.value}
                  onChange={(e) => setSpec(i, "value", e.target.value)}
                />
                <button className="btn-danger" onClick={() => removeSpec(i)}>
                  ✕
                </button>
              </div>
            ))}
            {form.specifications.length === 0 && (
              <p className="text-sm text-soft">Характеристик пока нет.</p>
            )}
          </div>
        </section>

        {/* Related items (analytes) */}
        {form.generalDirection !== "equipment" && (
          <section className="card p-5 lg:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-bold text-ink">Похожие позиции</h2>
              <button className="btn-ghost" onClick={addAnalyte}>
                + Добавить позицию
              </button>
            </div>
            <p className="mb-4 text-xs text-soft">
              Отображается в виде плашек внизу карточки товара в каталоге (реагенты,
              расходники, контроли/калибраторы). По умолчанию показываются первые 5, дальше
              кнопка «показать все». Порядок важен — сначала самое важное.
            </p>
            <div className="space-y-2">
              {form.analytes.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-line p-2">
                  <input
                    className="field flex-1"
                    placeholder="Название позиции"
                    value={a}
                    onChange={(e) => setAnalyte(i, e.target.value)}
                  />
                  <button className="btn-ghost" onClick={() => moveAnalyte(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => moveAnalyte(i, 1)}
                    disabled={i === form.analytes.length - 1}
                  >
                    ↓
                  </button>
                  <button className="btn-danger" onClick={() => removeAnalyte(i)}>
                    Удалить
                  </button>
                </div>
              ))}
              {form.analytes.length === 0 && (
                <p className="text-sm text-soft">Похожих позиций пока нет.</p>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
