import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clientsApi } from "../api";
import SingleFileUpload from "../components/SingleFileUpload.jsx";
import DraftUz from "../components/DraftUz.jsx";

const EMPTY = {
  name: "",
  logo: "",
  link: "",
  description: "",
  descriptionUz: "",
  hidden: false,
};

export default function ClientEdit({ mode }) {
  const isNew = mode === "new";
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (isNew) return;
    clientsApi
      .get(id)
      .then((d) => setForm({ ...EMPTY, ...d.item, hidden: !!d.item.hidden }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError("");
    setOk("");
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
        const d = await clientsApi.create(form);
        setOk("Клиент создан. Коммит: " + (d.commit?.commit || "—"));
        navigate(`/clients/${d.item.id}`, { replace: true });
      } else {
        const d = await clientsApi.update(id, form);
        setOk("Сохранено. Коммит: " + (d.commit?.commit || d.commit?.reason || "—"));
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
          <Link to="/clients" className="text-sm text-soft hover:text-clinical">
            ← К списку
          </Link>
          <h1 className="text-2xl font-extrabold text-ink">{isNew ? "Новый клиент" : form.name}</h1>
        </div>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {ok && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{ok}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Основное</h2>

          <label className="label">Название *</label>
          <input className="field mb-4" value={form.name} onChange={(e) => set("name", e.target.value)} />

          <label className="label">Ссылка (сайт клиента)</label>
          <input
            className="field mb-1"
            value={form.link}
            onChange={(e) => set("link", e.target.value)}
            placeholder="https://..."
          />
          <p className="mb-4 text-xs text-soft">Пока не отображается на сайте, сохраняется в данных.</p>

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
              const d = await clientsApi.upload(file, "logo", form.name || "client");
              return d.path;
            }}
            hint="PNG/JPG. Поля обрезаются, прозрачность сохраняется, размер ограничивается для веба."
          />
        </section>

        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-ink">Описания</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Описание, RU</label>
              <textarea
                className="field h-36"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="label mb-0">Описание, UZ</label>
                <DraftUz
                  source={form.description}
                  value={form.descriptionUz}
                  onChange={(v) => set("descriptionUz", v)}
                />
              </div>
              <textarea
                className="field h-36"
                value={form.descriptionUz}
                onChange={(e) => set("descriptionUz", e.target.value)}
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
