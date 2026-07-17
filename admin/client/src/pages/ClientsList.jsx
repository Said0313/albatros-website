import ContentList from "../components/ContentList.jsx";
import { clientsApi } from "../api";

export default function ClientsList() {
  return (
    <ContentList
      title="Клиенты"
      api={clientsApi}
      basePath="/clients"
      thumb={(c) => c.logo}
      columns={[
        {
          key: "name",
          label: "Название",
          render: (c) => (
            <div>
              <div className="font-semibold text-ink">{c.name}</div>
              <div className="text-xs text-soft">{c.id}</div>
            </div>
          ),
        },
        {
          key: "description",
          label: "Описание",
          render: (c) =>
            c.description ? (
              <span className="text-soft">{c.description.slice(0, 80)}...</span>
            ) : (
              "—"
            ),
        },
      ]}
    />
  );
}
