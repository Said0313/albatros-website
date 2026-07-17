// Fixed event type set (mirrors admin/server/src/routes/events.routes.js).
export const EVENT_TYPE_RU = {
  seminar: "Семинар",
  conference: "Конференция",
  congress: "Конгресс",
  symposium: "Симпозиум",
  exhibition: "Выставка",
  installation: "Инсталляция",
  registration: "Регистрация",
  other: "Другое",
};

export const RU_MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export function wordCount(text) {
  const t = (text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}
