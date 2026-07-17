import ContentList from "../components/ContentList.jsx";
import { certificatesApi } from "../api";

export default function CertificatesList() {
  return (
    <ContentList
      title="Сертификаты"
      api={certificatesApi}
      basePath="/certificates"
      thumb={(c) => c.image}
      columns={[
        {
          key: "title",
          label: "Название",
          render: (c) => (
            <div>
              <div className="font-semibold text-ink">{c.title || c.id}</div>
              {c.titleUz && <div className="text-xs text-soft">{c.titleUz}</div>}
            </div>
          ),
        },
        {
          key: "file",
          label: "Документ (PDF)",
          render: (c) => (c.file ? <code className="text-xs">{c.file}</code> : "—"),
        },
      ]}
      deleteConfirm={(c) => `Удалить сертификат "${c.title || c.id}"? Это действие необратимо.`}
    />
  );
}
