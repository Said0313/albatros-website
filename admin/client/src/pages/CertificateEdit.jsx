import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { certificatesApi } from "../api";
import SingleFileUpload from "../components/SingleFileUpload.jsx";

const EMPTY = { image: "", title: "", titleUz: "", file: "" };

export default function CertificateEdit({ mode }) {
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
    certificatesApi
      .get(id)
      .then((d) => setForm({ ...EMPTY, ...d.item }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setError("");
    setOk("");
    const miss = [];
    if (!form.image) miss.push("изображение");
    if (!form.title.trim()) miss.push("название (RU)");
    if (!form.titleUz.trim()) miss.push("название (UZ)");
    if (miss.length) {
      setError("Заполните обязательные поля: " + miss.join(", ") + ".");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const d = await certificatesApi.create(form);
        setOk("Сертификат создан. Коммит: " + (d.commit?.commit || "—"));
        navigate(`/certificates/${d.item.id}`, { replace: true });
      } else {
        const d = await certificatesApi.update(id, form);
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
          <Link to="/certificates" className="text-sm text-soft hover:text-clinical">
            ← К списку
          </Link>
          <h1 className="text-2xl font-extrabold text-ink">
            {isNew ? "Новый сертификат" : form.title || id}
          </h1>
        </div>
        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {ok && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{ok}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Названия</h2>
          <label className="label">Название, RU *</label>
          <input className="field mb-4" value={form.title} onChange={(e) => set("title", e.target.value)} />
          <label className="label">Название, UZ *</label>
          <input className="field mb-4" value={form.titleUz} onChange={(e) => set("titleUz", e.target.value)} />
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-bold text-ink">Изображение (скан) *</h2>
          <SingleFileUpload
            value={form.image}
            onChange={(v) => set("image", v)}
            onUpload={async (file) => {
              const d = await certificatesApi.upload(file, "image", form.title || "certificate");
              return d.path;
            }}
            hint="JPG/PNG. Приводится к веб-размеру (до 1600px)."
          />
        </section>

        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-ink">Полный документ (PDF, необязательно)</h2>
          <SingleFileUpload
            value={form.file}
            onChange={(v) => set("file", v)}
            onUpload={async (file) => {
              const d = await certificatesApi.upload(file, "pdf", form.title || "certificate");
              return d.path;
            }}
            accept="application/pdf"
            preview={false}
            hint="Если загружен, карточка сертификата на сайте будет открывать этот PDF."
          />
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
