import ContentList from "../components/ContentList.jsx";
import { eventsApi } from "../api";
import { EVENT_TYPE_RU } from "./eventTypes.js";

export default function EventsList() {
  return (
    <ContentList
      title="Мероприятия"
      api={eventsApi}
      basePath="/events"
      thumb={(e) => (e.images && e.images[0]) || null}
      searchPlaceholder="Поиск по названию, дате, типу..."
      searchText={(e) => `${e.title || ""} ${e.id || ""} ${e.date || ""} ${EVENT_TYPE_RU[e.type] || e.type || ""}`}
      columns={[
        {
          key: "title",
          label: "Название",
          render: (e) => (
            <div className="max-w-md">
              <div className="font-semibold text-ink">{e.title}</div>
              <div className="text-xs text-soft">{e.date}</div>
            </div>
          ),
        },
        {
          key: "type",
          label: "Тип",
          render: (e) => (e.type ? EVENT_TYPE_RU[e.type] || e.type : "—"),
        },
        {
          key: "photos",
          label: "Фото",
          render: (e) => (e.images ? e.images.length : 0),
        },
        {
          key: "priority",
          label: "Приоритет",
          render: (e) => e.priority ?? "—",
        },
      ]}
      deleteConfirm={(e) => `Удалить мероприятие "${e.title}"? Это действие необратимо.`}
    />
  );
}
