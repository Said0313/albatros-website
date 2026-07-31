import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { partnersApi } from "../api";
import SingleFileUpload from "../components/SingleFileUpload.jsx";
import DraftUz from "../components/DraftUz.jsx";
import PublishStatus from "../components/PublishStatus.jsx";

const EMPTY = {
  name: "",
  logo: "",
  url: "",
  founded: "",
  country: "",
  specialty: "",
  specialtyUz: "",
  specialtyEn: "",
  description: "",
  descriptionUz: "",
  descriptionEn: "",
  hidden: false,
};

export default function PartnerEdit({ mode }) {
  const isNew = mode === "new";
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [commit, setCommit] = useState(null);

  useEffect(() => {
    if (isNew) return;
    partnersApi
      .get(id)
      .then((d) => setForm({ ...EMPTY, ...d.item, hidden: !!d.item.hidden }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError("");
    setCommit(null);
    const miss = [];
    if (!form.name.trim()) miss.push("название");
    if (!form.logo) miss.push("логотип");
    if (miss.length) {
      setError("Заполните обязательные поля: " + miss.join(", ") + ".");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const d = await partnersApi.create(form);
        setCommit(d.commit);
        navigate(`/partners/${d.item.id}`, { replace: true });
      } else {
        const d = await partnersApi.update(id, form);
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
          <Link to="/partners" className="text-sm text-soft hover:text-clinical">
            ← К списку
          </Link>
          <h1 className="text-2xl font-extrabold text-ink">{isNew ? "Новый партнёр" : form.name}</h1>
        </div>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <PublishStatus commit={commit} action={isNew ? "Партнёр создан" : "Сохранено"} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Основное</h2>

          <label className="label">Название *</label>
          <input className="field mb-4" value={form.name} onChange={(e) => set("name", e.target.value)} />

          <label className="label">Сайт (ссылка)</label>
          <input
            className="field mb-4"
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://..."
          />

          <label className="label">Год основания</label>
          <input
            className="field mb-4"
            value={form.founded}
            onChange={(e) => set("founded", e.target.value)}
            placeholder="например 1995"
          />

          <label className="label">Страна</label>
          <input
            className="field mb-4"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder="например Китай · Шэньчжэнь"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-line accent-clinical"
              checked={form.hidden}
              onChange={(e) => set("hidden", e.target.checked)}
            />
            Скрыт (сайт начнёт учитывать этот флаг в следующей фазе)
          </label>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Логотип *</h2>
          <SingleFileUpload
            value={form.logo}
            onChange={(v) => set("logo", v)}
            onUpload={async (file) => {
              const d = await partnersApi.upload(file, "logo", form.name || "partner");
              return d.path;
            }}
            hint="PNG/JPG. Поля обрезаются, прозрачность сохраняется, размер ограничивается для веба."
          />
        </section>

        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-ink">Описания</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="label">Специализация (краткое), RU</label>
              <input
                className="field mb-4"
                value={form.specialty}
                onChange={(e) => set("specialty", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Специализация (краткое), UZ</label>
                <DraftUz
                  source={form.specialty}
                  value={form.specialtyUz}
                  onChange={(v) => set("specialtyUz", v)}
                />
              </div>
              <input
                className="field mb-4"
                value={form.specialtyUz}
                onChange={(e) => set("specialtyUz", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Специализация (краткое), EN</label>
                <DraftUz
                  lang="en"
                  source={form.specialty}
                  value={form.specialtyEn}
                  onChange={(v) => set("specialtyEn", v)}
                />
              </div>
              <input
                className="field mb-4"
                value={form.specialtyEn}
                onChange={(e) => set("specialtyEn", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Описание (полное), RU</label>
              <textarea
                className="field h-32"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Описание (полное), UZ</label>
                <DraftUz
                  source={form.description}
                  value={form.descriptionUz}
                  onChange={(v) => set("descriptionUz", v)}
                />
              </div>
              <textarea
                className="field h-32"
                value={form.descriptionUz}
                onChange={(e) => set("descriptionUz", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Описание (полное), EN</label>
                <DraftUz
                  lang="en"
                  source={form.description}
                  value={form.descriptionEn}
                  onChange={(v) => set("descriptionEn", v)}
                />
              </div>
              <textarea
                className="field h-32"
                value={form.descriptionEn}
                onChange={(e) => set("descriptionEn", e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
