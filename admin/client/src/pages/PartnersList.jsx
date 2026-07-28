import ContentList from "../components/ContentList.jsx";
import { partnersApi } from "../api";

export default function PartnersList() {
  return (
    <ContentList
      title="Партнёры"
      api={partnersApi}
      basePath="/partners"
      thumb={(p) => p.logo}
      searchPlaceholder="Поиск по названию, стране, специализации..."
      searchText={(p) => `${p.name || ""} ${p.id || ""} ${p.specialty || ""} ${p.country || ""}`}
      columns={[
        {
          key: "name",
          label: "Название",
          render: (p) => (
            <div>
              <div className="font-semibold text-ink">{p.name}</div>
              <div className="text-xs text-soft">{p.id}</div>
            </div>
          ),
        },
        { key: "specialty", label: "Специализация", render: (p) => p.specialty || "—" },
        { key: "country", label: "Страна", render: (p) => p.country || "—" },
      ]}
    />
  );
}
