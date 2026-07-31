// Uzbek + English translations for catalog DATA (category names + per-product
// short text). Product names are brand/model and stay identical in all locales.
import type { Product, Brand, CompanyEvent } from "@/types";
import type { Client } from "@/data/clients";

export const CATEGORY_UZ: Record<string, string> = {
  "ИХЛА": "IXLA",
  "Биохимия": "Biokimyo",
  "Гемостаз": "Gemostaz",
  "КЩС": "KIShH",
  "Гематология": "Gematologiya",
  "Автоматизированная лаборатория": "Avtomatlashtirilgan laboratoriya",
  "Клинический анализ": "Klinik tahlil",
  "ВЭЖХ": "YuSSX",
  "Микробиология": "Mikrobiologiya",
  "ПЦР": "PZR",
  "Иммуногематология": "Immunogematologiya",
  "Токсикология": "Toksikologiya",
  "Аллергология": "Allergologiya",
  "Контроль качества": "Sifat nazorati dasturlari",
  "Программы контроля качества": "Sifat nazorati tizimlari",
  "Генетика": "Genetika",
  "Функциональная диагностика": "Funksional diagnostika",
  "Биодеконтаминация": "Biodekontaminatsiya",
  "Клиническая диагностика": "Klinik diagnostika",
  "Скрининг": "Skrining",
  // General directions (top level of the two-level taxonomy)
  "Медицинское оборудование": "Laboratoriya uskunalari",
  "Реагенты": "Reagentlar",
  "Расходные материалы": "Sarf materiallari va butlovchi qismlar",
};

// RU DISPLAY overrides. Keys are the INTERNAL category / general-direction
// names (used in catalog.json, URLs and filters, which must not change);
// values are what the visitor sees. Keep in sync with CATEGORY_UZ.
export const CATEGORY_RU: Record<string, string> = {
  "Контроль качества": "Программы контроля качества",
  "Программы контроля качества": "Системы контроля качества",
  "Расходные материалы": "Расходные материалы и комплектующие",
  "Медицинское оборудование": "Лабораторное оборудование",
};

export const CATEGORY_EN: Record<string, string> = {
  "ИХЛА": "CLIA",
  "Биохимия": "Biochemistry",
  "Гемостаз": "Hemostasis",
  "КЩС": "Blood Gas",
  "Гематология": "Hematology",
  "Автоматизированная лаборатория": "Automated Laboratory",
  "Клинический анализ": "Clinical Analysis",
  "ВЭЖХ": "HPLC",
  "Микробиология": "Microbiology",
  "ПЦР": "PCR",
  "Иммуногематология": "Immunohematology",
  "Токсикология": "Toxicology",
  "Аллергология": "Allergology",
  "Контроль качества": "Quality Control",
  "Программы контроля качества": "Quality Control Programs",
  "Генетика": "Genetics",
  "Функциональная диагностика": "Functional Diagnostics",
  "Биодеконтаминация": "Biodecontamination",
  "Клиническая диагностика": "Clinical Diagnostics",
  "Скрининг": "Screening",
  // General directions (top level of the two-level taxonomy)
  "Медицинское оборудование": "Medical Equipment",
  "Реагенты": "Reagents",
  "Расходные материалы": "Consumables",
};

export function categoryLabel(name: string, locale: string): string {
  if (locale === "uz") return CATEGORY_UZ[name] ?? name;
  if (locale === "en") return CATEGORY_EN[name] ?? name;
  return CATEGORY_RU[name] ?? name;
}

export function productShort(p: Product, locale: string): string {
  if (locale === "uz") return p.shortDescriptionUz ?? p.shortDescription;
  if (locale === "en") return p.shortDescriptionEn ?? p.shortDescription;
  return p.shortDescription;
}

export function productFull(p: Product, locale: string): string {
  if (locale === "uz") return p.fullDescriptionUz ?? p.fullDescription;
  if (locale === "en") return p.fullDescriptionEn ?? p.fullDescription;
  return p.fullDescription;
}

export function productDetailed(p: Product, locale: string): string | undefined {
  if (locale === "uz") return p.detailedDescriptionUz ?? p.detailedDescription;
  if (locale === "en") return p.detailedDescriptionEn ?? p.detailedDescription;
  return p.detailedDescription;
}

/**
 * Product display name. Model names (Maglumi X3, NovaSeq X) are language neutral
 * and carry no per-locale variant, so they fall through unchanged; the
 * reagent/consumable/control entries are Russian prose and do carry one.
 */
export function productName(p: Product, locale: string): string {
  if (locale === "uz") return p.nameUz ?? p.name;
  if (locale === "en") return p.nameEn ?? p.name;
  return p.name;
}

/** Client card description. All three locales are stored on every client. */
export function clientDescription(c: Client, locale: string): string | undefined {
  if (locale === "uz") return c.descriptionUz ?? c.description;
  if (locale === "en") return c.descriptionEn ?? c.description;
  return c.description;
}

// Uzbek translations for the recurring product spec LABELS (values are mostly
// numeric/units and stay as-is; a few Russian value words are left for owner review).
export const SPEC_LABEL_UZ: Record<string, string> = {
  "AI": "AI", "Автоматизация": "Avtomatlashtirish", "Аккумулятор": "Akkumulyator",
  "Анализ": "Tahlil", "Биохимия": "Biokimyo", "Вещества": "Moddalar",
  "Виды животных": "Hayvon turlari", "Время анализа": "Tahlil vaqti",
  "Время до первого анализа": "Birinchi tahlilgacha vaqt", "Габариты": "Oʻlchamlari",
  "Габариты / вес": "Oʻlchamlari / vazni", "Гельминты": "Gelmintlar", "Гибкость": "Moslashuvchanlik",
  "Деконтаминация": "Dekontaminatsiya", "Диагностика": "Diagnostika", "Дифференцировка": "Differensiatsiya",
  "Единиц": "Birliklar", "Загрузчик": "Yuklagich", "ИХА": "IXA", "Измеряемые параметры": "Oʻlchanadigan parametrlar",
  "Интеграция": "Integratsiya", "Интерфейс": "Interfeys", "Исследование": "Tadqiqot", "Класс": "Sinf",
  "Классификация": "Tasniflash", "Контроль качества": "Sifat nazorati", "Конфигурация X10+C10": "X10+C10 konfiguratsiyasi",
  "Конфигурация X6+C8": "X6+C8 konfiguratsiyasi", "Конфигурация X8+C10": "X8+C10 konfiguratsiyasi",
  "Корпус": "Korpus", "Кюветы": "Kyuvetalar", "Лаборатории": "Laboratoriyalar", "Маркеры": "Markerlar",
  "Масса": "Massa", "Метод": "Usul", "Мишени": "Nishonlar", "Морфология": "Morfologiya", "Награда": "Mukofot",
  "Награды": "Mukofotlar", "Назначение": "Vazifasi", "Образцов на борту": "Bortdagi namunalar",
  "Образцы": "Namunalar", "Образцы (3-Diff)": "Namunalar (3-Diff)", "Объём образца": "Namuna hajmi",
  "Основана": "Tashkil etilgan", "Панели": "Panellar", "Параметров": "Parametrlar", "Параметры": "Parametrlar",
  "Первый результат": "Birinchi natija", "Платформа": "Platforma", "Подключение": "Ulanish",
  "Поколение": "Avlod", "Применение": "Qoʻllanilishi", "Применения": "Qoʻllanilishi", "Производитель": "Ishlab chiqaruvchi",
  "Производительность": "Unumdorlik", "Пропускная способность": "Oʻtkazuvchanlik", "Размеры": "Oʻlchamlari",
  "Расчётные параметры": "Hisoblanadigan parametrlar", "Расширяемость": "Kengaytiriluvchanlik",
  "Реагентов на борту": "Bortdagi reagentlar", "Реагенты": "Reagentlar", "Реагенты на борту": "Bortdagi reagentlar",
  "Результаты": "Natijalar", "СОЭ": "ECHT", "Сегмент": "Segment", "Скорость": "Tezlik", "Совместимость": "Moslik",
  "Среды": "Muhitlar", "Стабильность калибровки": "Kalibrlash barqarorligi", "Стандарты": "Standartlar",
  "Статус": "Holat", "Сторона": "Tomon", "Страны": "Mamlakatlar", "Талассемия": "Talassemiya",
  "Технологии": "Texnologiyalar", "Технология": "Texnologiya", "Тип": "Turi", "Тип датчика": "Datchik turi",
  "Фильтр": "Filtr", "Формат": "Format", "Формённые элементы": "Shaklli elementlar", "Функции": "Funksiyalar",
  "Химия": "Kimyo", "Холодильные модули": "Sovutish modullari", "Хранение": "Saqlash", "Частота": "Chastota",
  "Экран": "Ekran", "Экспорт": "Eksport", "Электролитный модуль": "Elektrolit moduli", "Электролиты": "Elektrolitlar",
  "Позиции для образцов": "Namuna pozitsiyalari",
  "Типы образцов": "Namuna turlari",
  "Реагентные отсеки": "Reagent boʻlmalari",
  "Температура реагентов": "Reagentlar harorati",
  "Реакционные кюветы": "Reaksiya kyuvetalari",
  "Температура реакции": "Reaksiya harorati",
  "Объём реакции": "Reaksiya hajmi",
  "Длины волн": "Toʻlqin uzunliklari",
  "Источник света": "Yorugʻlik manbai",
  "Штрих-коды": "Shtrix-kodlar",
  "Опциональные модули": "Ixtiyoriy modullar",
  "Измерений в секунду": "Sekundiga oʻlchashlar",
  "Точечных измерений": "Nuqtaviy oʻlchashlar",
  "Время результата": "Natija vaqti",
  "Результат": "Natija",
  "Датчик": "Datchik",
  "Чувствительность": "Sezgirlik",
  "Специфичность": "Oʻziga xoslik",
  "Клинические исследования": "Klinik tadqiqotlar",
  "Регуляторные одобрения": "Tartibga soluvchi ruxsatlar",
};

export const SPEC_LABEL_EN: Record<string, string> = {
  "AI": "AI", "Автоматизация": "Automation", "Аккумулятор": "Battery",
  "Анализ": "Analysis", "Биохимия": "Biochemistry", "Вещества": "Substances",
  "Виды животных": "Animal species", "Время анализа": "Analysis time",
  "Время до первого анализа": "Time to first result", "Габариты": "Dimensions",
  "Габариты / вес": "Dimensions / weight", "Гельминты": "Helminths", "Гибкость": "Flexibility",
  "Деконтаминация": "Decontamination", "Диагностика": "Diagnostics", "Дифференцировка": "Differentiation",
  "Единиц": "Units", "Загрузчик": "Loader", "ИХА": "Immunochromatography", "Измеряемые параметры": "Measured parameters",
  "Интеграция": "Integration", "Интерфейс": "Interface", "Исследование": "Study", "Класс": "Class",
  "Классификация": "Classification", "Контроль качества": "Quality control", "Конфигурация X10+C10": "X10+C10 configuration",
  "Конфигурация X6+C8": "X6+C8 configuration", "Конфигурация X8+C10": "X8+C10 configuration",
  "Корпус": "Housing", "Кюветы": "Cuvettes", "Лаборатории": "Laboratories", "Маркеры": "Markers",
  "Масса": "Weight", "Метод": "Method", "Мишени": "Targets", "Морфология": "Morphology", "Награда": "Award",
  "Награды": "Awards", "Назначение": "Purpose", "Образцов на борту": "Samples on board",
  "Образцы": "Samples", "Образцы (3-Diff)": "Samples (3-Diff)", "Объём образца": "Sample volume",
  "Основана": "Founded", "Панели": "Panels", "Параметров": "Parameters", "Параметры": "Parameters",
  "Первый результат": "First result", "Платформа": "Platform", "Подключение": "Connectivity",
  "Поколение": "Generation", "Применение": "Application", "Применения": "Applications", "Производитель": "Manufacturer",
  "Производительность": "Throughput", "Пропускная способность": "Throughput capacity", "Размеры": "Dimensions",
  "Расчётные параметры": "Calculated parameters", "Расширяемость": "Expandability",
  "Реагентов на борту": "Reagents on board", "Реагенты": "Reagents", "Реагенты на борту": "Reagents on board",
  "Результаты": "Results", "СОЭ": "ESR", "Сегмент": "Segment", "Скорость": "Speed", "Совместимость": "Compatibility",
  "Среды": "Media", "Стабильность калибровки": "Calibration stability", "Стандарты": "Standards",
  "Статус": "Status", "Сторона": "Party", "Страны": "Countries", "Талассемия": "Thalassemia",
  "Технологии": "Technologies", "Технология": "Technology", "Тип": "Type", "Тип датчика": "Probe type",
  "Фильтр": "Filter", "Формат": "Format", "Формённые элементы": "Formed elements", "Функции": "Functions",
  "Химия": "Chemistry", "Холодильные модули": "Refrigeration modules", "Хранение": "Storage", "Частота": "Frequency",
  "Экран": "Screen", "Экспорт": "Export", "Электролитный модуль": "Electrolyte module", "Электролиты": "Electrolytes",
  "Позиции для образцов": "Sample positions",
  "Типы образцов": "Sample types",
  "Реагентные отсеки": "Reagent compartments",
  "Температура реагентов": "Reagent temperature",
  "Реакционные кюветы": "Reaction cuvettes",
  "Температура реакции": "Reaction temperature",
  "Объём реакции": "Reaction volume",
  "Длины волн": "Wavelengths",
  "Источник света": "Light source",
  "Штрих-коды": "Barcodes",
  "Опциональные модули": "Optional modules",
  "Измерений в секунду": "Measurements per second",
  "Точечных измерений": "Point measurements",
  "Время результата": "Time to result",
  "Результат": "Result",
  "Датчик": "Sensor",
  "Чувствительность": "Sensitivity",
  "Специфичность": "Specificity",
  "Клинические исследования": "Clinical studies",
  "Регуляторные одобрения": "Regulatory approvals",
};

export function specLabel(label: string, locale: string): string {
  if (locale === "uz") return SPEC_LABEL_UZ[label] ?? label;
  if (locale === "en") return SPEC_LABEL_EN[label] ?? label;
  return label;
}

const COUNTRY_UZ: Record<string, string> = {
  "Китай · Шэньчжэнь": "Xitoy · Shenchjen", "США · Нью-Джерси": "AQSh · Nyu-Jersi",
  "Великобритания · Кримлин": "Buyuk Britaniya · Krimlin", "Испания · Барселона": "Ispaniya · Barselona",
  "США · Сан-Диего": "AQSh · San-Diego", "Китай · Гуйлинь": "Xitoy · Guylin",
  "Канада · Ванкувер": "Kanada · Vankuver", "Испания · Мадрид": "Ispaniya · Madrid",
  "Швеция · Уппсала": "Shvetsiya · Uppsala", "Китай": "Xitoy",
  "Австралия": "Avstraliya",
};

const COUNTRY_EN: Record<string, string> = {
  "Китай · Шэньчжэнь": "China · Shenzhen", "США · Нью-Джерси": "USA · New Jersey",
  "Великобритания · Кримлин": "UK · Crumlin", "Испания · Барселона": "Spain · Barcelona",
  "США · Сан-Диего": "USA · San Diego", "Китай · Гуйлинь": "China · Guilin",
  "Канада · Ванкувер": "Canada · Vancouver", "Испания · Мадрид": "Spain · Madrid",
  "Швеция · Уппсала": "Sweden · Uppsala", "Китай": "China",
  "Австралия": "Australia",
};

export function brandSpecialty(b: Brand, locale: string): string | undefined {
  if (locale === "uz") return b.specialtyUz ?? b.specialty;
  if (locale === "en") return b.specialtyEn ?? b.specialty;
  return b.specialty;
}
export function brandDescription(b: Brand, locale: string): string {
  if (locale === "uz") return b.descriptionUz ?? b.description;
  if (locale === "en") return b.descriptionEn ?? b.description;
  return b.description;
}
export function brandCountry(b: Brand, locale: string): string | undefined {
  if (!b.country) return undefined;
  if (locale === "uz") return COUNTRY_UZ[b.country] ?? b.country;
  if (locale === "en") return COUNTRY_EN[b.country] ?? b.country;
  return b.country;
}
export function eventTitle(e: CompanyEvent, locale: string): string {
  if (locale === "uz") return e.titleUz ?? e.title;
  if (locale === "en") return e.titleEn ?? e.title;
  return e.title;
}
export function eventDescription(e: CompanyEvent, locale: string): string | undefined {
  if (locale === "uz") return e.descriptionUz ?? e.description;
  if (locale === "en") return e.descriptionEn ?? e.description;
  return e.description;
}

const MONTH_UZ: Record<string, string> = {
  "Январь": "Yanvar", "Февраль": "Fevral", "Март": "Mart", "Апрель": "Aprel", "Май": "May", "Июнь": "Iyun",
  "Июль": "Iyul", "Август": "Avgust", "Сентябрь": "Sentabr", "Октябрь": "Oktabr", "Ноябрь": "Noyabr", "Декабрь": "Dekabr",
};

const MONTH_EN: Record<string, string> = {
  "Январь": "January", "Февраль": "February", "Март": "March", "Апрель": "April", "Май": "May", "Июнь": "June",
  "Июль": "July", "Август": "August", "Сентябрь": "September", "Октябрь": "October", "Ноябрь": "November", "Декабрь": "December",
};

export function eventDate(date: string, locale: string): string {
  if (locale !== "uz" && locale !== "en") return date;
  const dict = locale === "uz" ? MONTH_UZ : MONTH_EN;
  let out = date;
  for (const [ru, translated] of Object.entries(dict)) out = out.replace(ru, translated);
  return out;
}

// Uzbek translations for the recurring product spec VALUES (units/numbers stay as-is).
export const SPEC_VALUE_UZ: Record<string, string> = {
  "10 000 тестов": "10 000 test",
  "100+100 позиций": "100+100 pozitsiya",
  "1000 проб/час": "soatiga 1000 namuna",
  "1000 т/ч": "soatiga 1000 ta",
  "1000 тестов/час": "soatiga 1000 test",
  "102×72×56 см · 73 кг": "102×72×56 sm · 73 kg",
  "112 позиций": "112 pozitsiya",
  "127 кг": "127 kg",
  "130 стран": "130 mamlakat",
  "148×94×155 см": "148×94×155 sm",
  "17 минут": "17 daqiqa",
  "180 тестов/час": "soatiga 180 test",
  "192.5×123×154 см": "192.5×123×154 sm",
  "192×118×150 см": "192×118×150 sm",
  "1960, Мадрид": "1960, Madrid",
  "1–15 МГц": "1–15 MGts",
  "2-е поколение реагентов": "2-avlod reagentlari",
  "20 мкл": "20 mkl",
  "20 позиций": "20 pozitsiya",
  "240 тестов/час": "240 test/soat",
  "3 минуты": "3 daqiqa",
  "30 за 25 минут": "25 daqiqada 30 ta",
  "30 позиций": "30 pozitsiya",
  "300 позиций": "300 pozitsiya",
  "33 типа клеток": "33 turdagi hujayra",
  "42 позиции": "42 pozitsiya",
  "45+ позиций": "45+ pozitsiya",
  "450 + 1600 т/ч": "450 + 1600 t/s",
  "450 кг": "450 kg",
  "46 основных / 163 исследовательских": "46 asosiy / 163 tadqiqot",
  "50 позиций": "50 pozitsiya",
  "500+ вирусных, бактериальных, грибковых": "500+ virusli, bakterial, zamburugʻ",
  "6 видов": "6 tur",
  "6-Diff + СОЭ + RET + NRBC": "6-Diff + ECHT + RET + NRBC",
  "600 + 2000 т/ч": "600 + 2000 t/s",
  "655×868×867 мм / 115 кг": "655×868×867 mm / 115 kg",
  "670 кг": "670 kg",
  "690 кг": "690 kg",
  "72 позиции": "72 pozitsiya",
  "75 секунд": "75 soniya",
  "80 тестов/час, метод Вестергрена": "soatiga 80 test, Vestergren usuli",
  "85 секунд": "85 soniya",
  "9 наборов": "9 toʻplam",
  "90×75×78 см": "90×75×78 sm",
  "96 карт/час": "soatiga 96 karta",
  "HLA-B27, фенотип клеток": "HLA-B27, hujayra fenotipi",
  "HbA1c / диабет": "HbA1c / diabet",
  "IEC-HPLC (золотой стандарт ВОЗ)": "IEC-HPLC (JSST oltin standarti)",
  "pH, pCO₂, pO₂, Na+, K+, Ca++, Cl-, Glu, Lac, Hct, CO-окси, tBili": "pH, pCO₂, pO₂, Na+, K+, Ca++, Cl-, Glu, Lac, Hct, CO-oksi, tBili",
  "~1–5 МГц": "~1–5 MGts",
  "~2–6 МГц": "~2–6 MGts",
  "~3–10 МГц": "~3–10 MGts",
  "~4–13 МГц": "~4–13 MGts",
  "~5–15 МГц": "~5–15 MGts",
  "~60 минут": "~60 daqiqa",
  "ВОЗ 5-е и 6-е издания": "JSST 5- va 6-nashr",
  "ВОК молекулярная": "Molekulyar STB",
  "Внутриполостной (эндокавитарный)": "Ichi boʻshliqli (endokavitar)",
  "Гормоны, онкомаркеры, инфекции, аутоиммунные": "Gormonlar, onkomarkerlar, infeksiyalar, autoimmun",
  "Двухматричный (фазированный + линейный)": "Ikki matritsali (fazali + chiziqli)",
  "ИИ, облачное хранение": "AI, bulutli saqlash",
  "ИХЛА 1000 + Биохимия 2000 т/ч": "IXLA 1000 + Biokimyo 2000 t/s",
  "Конвексный": "Konveks",
  "Крупные лаборатории": "Yirik laboratoriyalar",
  "Линейный": "Chiziqli",
  "Линейный (высокочастотный)": "Chiziqli (yuqori chastotali)",
  "Линейный (сверхвысокочастотный)": "Chiziqli (oʻta yuqori chastotali)",
  "Небольшие лаборатории": "Kichik laboratoriyalar",
  "Смартфон / планшет (iOS, Android)": "Smartfon / planshet (iOS, Android)",
  "Средние и крупные лаборатории": "Oʻrta va yirik laboratoriyalar",
  "УФ-лампа": "UB-lampa",
  "Фазированная решётка": "Fazali panjara",
  "Флэш-ХЛ (ABEI), магнитные микрочастицы": "Flesh-XL (ABEI), magnit mikrozarrachalar",
  "автоматизированная ПЦР": "avtomatlashtirilgan PZR",
  "автоматический": "avtomatik",
  "автоматический СОЭ": "avtomatik ECHT",
  "автоматический анализатор кала": "avtomatik najas analizatori",
  "автоматический анализатор мочи": "avtomatik siydik analizatori",
  "аллергия, токсикология, аутоиммунные": "allergiya, toksikologiya, autoimmun",
  "биочип (BAT) 7×7": "biochip (BAT) 7×7",
  "внешняя оценка качества": "tashqi sifat baholash",
  "внутренний контроль (ВКК)": "ichki nazorat (ISN)",
  "встроенный DRAGEN": "oʻrnatilgan DRAGEN",
  "встроенный режим": "oʻrnatilgan rejim",
  "высокая": "yuqori",
  "высокая / средняя": "yuqori / oʻrta",
  "высокая производительность": "yuqori unumdorlik",
  "гель-картная агглютинация": "gel-kartali agglyutinatsiya",
  "гемокультуры": "qon kulturalari",
  "да": "ha",
  "до 100 тестов/час": "soatiga 100 testgacha",
  "до 1000 тестов/час": "soatiga 1000 testgacha",
  "до 110 тестов/час": "soatiga 110 testgacha",
  "до 120 тестов/час": "soatiga 120 testgacha",
  "до 180 тестов/час": "soatiga 180 testgacha",
  "до 20 МГц": "20 MGtsgacha",
  "до 20 тестов/час": "soatiga 20 testgacha",
  "до 200 тестов/час": "soatiga 200 testgacha",
  "до 2000 тестов/час": "soatiga 2000 testgacha",
  "до 280 тестов/час": "soatiga 280 testgacha",
  "до 32": "32 tagacha",
  "до 4": "4 tagacha",
  "до 4 недель": "4 haftagacha",
  "до 40 со штрих-кодом": "shtrix-kodli 40 tagacha",
  "до 44": "44 tagacha",
  "до 450 тестов/час": "soatiga 450 testgacha",
  "до 55": "55 tagacha",
  "до 60 288 образцов": "60 288 namunagacha",
  "до 60 слайдов/час": "soatiga 60 slaydgacha",
  "до 60 тестов/час": "soatiga 60 testgacha",
  "до 600 тестов/час": "soatiga 600 testgacha",
  "до 96": "96 tagacha",
  "единый": "yagona",
  "золотой стандарт": "oltin standart",
  "идентификация + AST": "identifikatsiya + AST",
  "иммунофлуоресцентный": "immunoflyuoressent",
  "инфекционные заболевания": "yuqumli kasalliklar",
  "исключительная": "yuqori",
  "компактный автоматический": "ixcham avtomatik",
  "компактный настольный": "ixcham stol usti",
  "лиофилизированные": "liofillangan",
  "модифицированный Вестергрен": "modifikatsiyalangan Vestergren",
  "модульная": "modulli",
  "модульная лаборатория": "modulli laboratoriya",
  "модульная станция": "modulli stansiya",
  "молекулярная аллергодиагностика": "molekulyar allergodiagnostika",
  "молекулярный контроль": "molekulyar nazorat",
  "настольный секвенатор NGS": "stol usti NGS sekvenatori",
  "независимая третья": "mustaqil uchinchi tomon",
  "новое": "yangi",
  "онкология, иммунология, репродуктология": "onkologiya, immunologiya, reproduktologiya",
  "очистка нуклеиновых кислот": "nuklein kislotalarni tozalash",
  "полная": "toʻliq",
  "полностью автоматический": "toʻliq avtomatik",
  "проточный цитометр": "oqim sitometri",
  "русский язык": "rus tili",
  "скрытая кровь + трансферрин": "yashirin qon + transferrin",
  "талассемия, варианты Hb": "talassemiya, Hb variantlari",
  "тип кюветы и длина считывания": "kyuveta turi va oʻqish uzunligi",
  "фенотипический": "fenotipik",
  "химический": "kimyoviy",
  "химический + микроскопический + физический": "kimyoviy + mikroskopik + fizik",
  "химический + физический + микроскопический": "kimyoviy + fizik + mikroskopik",
  "цифровая ПЦР": "raqamli PZR",
  "1600 тестов/час (один модуль); до 6400 тестов/час (четыре модуля)": "1600 test/soat (bitta modul); 6400 test/soatgacha (toʻrtta modul)",
  "Сыворотка, плазма, моча, СМЖ": "Zardob, plazma, siydik, orqa miya suyuqligi",
  "1,5 - 25 мкл (шаг 0,1 мкл)": "1,5 - 25 mkl (qadam 0,1 mkl)",
  "72 позиции для R1 и 72 для R2": "R1 uchun 72 pozitsiya va R2 uchun 72",
  "Работа 8-12°C, хранение 2-8°C": "Ish 8-12°C, saqlash 2-8°C",
  "362 (постоянные кварцевые)": "362 (doimiy kvarsli)",
  "10 минут; 22 минуты": "10 daqiqa; 22 daqiqa",
  "80 - 250 мкл": "80 - 250 mkl",
  "13 фиксированных (340-800 нм)": "13 ta qatʼiy (340-800 nm)",
  "Галогенная лампа 12 В, 100 Вт": "Galogen lampa 12 V, 100 Vt",
  "133×118×135 см, 560 кг (биохимический модуль)": "133×118×135 sm, 560 kg (biokimyo moduli)",
  "ISE (300 тестов/час), декаппер (по заказу)": "ISE (300 test/soat), dekapper (buyurtma asosida)",
  "58,5 × 53,3 × 63,5 см (В×Ш×Г)": "58,5 × 53,3 × 63,5 sm (B×E×Ch)",
  "158,8 × 93,3 × 86,4 см (В×Ш×Г)": "158,8 × 93,3 × 86,4 sm (B×E×Ch)",
  "Оптический (4 светодиода, 3 длины волны) + электрический (импедансная спектроскопия)": "Optik (4 svetodiod, 3 toʻlqin uzunligi) + elektr (impedans spektroskopiyasi)",
  "~20 на поверхности шейки матки": "~20 ta bachadon boʻyni yuzasida",
  "~10 минут": "~10 daqiqa",
  "«Норма» или «Аномалия» (ИИ-алгоритм)": "«Norma» yoki «Anomaliya» (SI algoritmi)",
  "Одноразовый (SUS)": "Bir martalik (SUS)",
  "42 000+ пациенток": "42 000+ bemor ayol",
  "CE, MHRA, NMPA, SFDA, TGA, Росздравнадзор": "CE, MHRA, NMPA, SFDA, TGA, Roszdravnadzor",
  "TruScreen Group Ltd (Австралия)": "TruScreen Group Ltd (Avstraliya)",
};

export const SPEC_VALUE_EN: Record<string, string> = {
  "10 000 тестов": "10,000 tests",
  "100+100 позиций": "100+100 positions",
  "1000 проб/час": "1000 samples/hour",
  "1000 т/ч": "1000/hour",
  "1000 тестов/час": "1000 tests/hour",
  "102×72×56 см · 73 кг": "102×72×56 cm · 73 kg",
  "112 позиций": "112 positions",
  "127 кг": "127 kg",
  "130 стран": "130 countries",
  "148×94×155 см": "148×94×155 cm",
  "17 минут": "17 minutes",
  "180 тестов/час": "180 tests/hour",
  "192.5×123×154 см": "192.5×123×154 cm",
  "192×118×150 см": "192×118×150 cm",
  "1960, Мадрид": "1960, Madrid",
  "1–15 МГц": "1–15 MHz",
  "2-е поколение реагентов": "2nd-generation reagents",
  "20 мкл": "20 µL",
  "20 позиций": "20 positions",
  "240 тестов/час": "240 tests/hour",
  "3 минуты": "3 minutes",
  "30 за 25 минут": "30 in 25 minutes",
  "30 позиций": "30 positions",
  "300 позиций": "300 positions",
  "33 типа клеток": "33 cell types",
  "42 позиции": "42 positions",
  "45+ позиций": "45+ positions",
  "450 + 1600 т/ч": "450 + 1600/hour",
  "450 кг": "450 kg",
  "46 основных / 163 исследовательских": "46 basic / 163 research",
  "50 позиций": "50 positions",
  "500+ вирусных, бактериальных, грибковых": "500+ viral, bacterial, fungal",
  "6 видов": "6 species",
  "6-Diff + СОЭ + RET + NRBC": "6-Diff + ESR + RET + NRBC",
  "600 + 2000 т/ч": "600 + 2000/hour",
  "655×868×867 мм / 115 кг": "655×868×867 mm / 115 kg",
  "670 кг": "670 kg",
  "690 кг": "690 kg",
  "72 позиции": "72 positions",
  "75 секунд": "75 seconds",
  "80 тестов/час, метод Вестергрена": "80 tests/hour, Westergren method",
  "85 секунд": "85 seconds",
  "9 наборов": "9 kits",
  "90×75×78 см": "90×75×78 cm",
  "96 карт/час": "96 cards/hour",
  "HLA-B27, фенотип клеток": "HLA-B27, cell phenotype",
  "HbA1c / диабет": "HbA1c / diabetes",
  "IEC-HPLC (золотой стандарт ВОЗ)": "IEC-HPLC (WHO gold standard)",
  "pH, pCO₂, pO₂, Na+, K+, Ca++, Cl-, Glu, Lac, Hct, CO-окси, tBili": "pH, pCO₂, pO₂, Na+, K+, Ca++, Cl-, Glu, Lac, Hct, CO-oximetry, tBili",
  "~1–5 МГц": "~1–5 MHz",
  "~2–6 МГц": "~2–6 MHz",
  "~3–10 МГц": "~3–10 MHz",
  "~4–13 МГц": "~4–13 MHz",
  "~5–15 МГц": "~5–15 MHz",
  "~60 минут": "~60 minutes",
  "ВОЗ 5-е и 6-е издания": "WHO 5th and 6th editions",
  "ВОК молекулярная": "Molecular EQA",
  "Внутриполостной (эндокавитарный)": "Intracavitary (endocavitary)",
  "Гормоны, онкомаркеры, инфекции, аутоиммунные": "Hormones, tumor markers, infections, autoimmune",
  "Двухматричный (фазированный + линейный)": "Dual-array (phased + linear)",
  "ИИ, облачное хранение": "AI, cloud storage",
  "ИХЛА 1000 + Биохимия 2000 т/ч": "CLIA 1000 + Biochemistry 2000/hour",
  "Конвексный": "Convex",
  "Крупные лаборатории": "Large laboratories",
  "Линейный": "Linear",
  "Линейный (высокочастотный)": "Linear (high-frequency)",
  "Линейный (сверхвысокочастотный)": "Linear (ultra-high-frequency)",
  "Небольшие лаборатории": "Small laboratories",
  "Смартфон / планшет (iOS, Android)": "Smartphone / tablet (iOS, Android)",
  "Средние и крупные лаборатории": "Medium and large laboratories",
  "УФ-лампа": "UV lamp",
  "Фазированная решётка": "Phased array",
  "Флэш-ХЛ (ABEI), магнитные микрочастицы": "Flash-CL (ABEI), magnetic microparticles",
  "автоматизированная ПЦР": "automated PCR",
  "автоматический": "automatic",
  "автоматический СОЭ": "automatic ESR",
  "автоматический анализатор кала": "automatic stool analyzer",
  "автоматический анализатор мочи": "automatic urine analyzer",
  "аллергия, токсикология, аутоиммунные": "allergy, toxicology, autoimmune",
  "биочип (BAT) 7×7": "biochip (BAT) 7×7",
  "внешняя оценка качества": "external quality assessment",
  "внутренний контроль (ВКК)": "internal quality control (IQC)",
  "встроенный DRAGEN": "built-in DRAGEN",
  "встроенный режим": "built-in mode",
  "высокая": "high",
  "высокая / средняя": "high / medium",
  "высокая производительность": "high throughput",
  "гель-картная агглютинация": "gel card agglutination",
  "гемокультуры": "blood cultures",
  "да": "yes",
  "до 100 тестов/час": "up to 100 tests/hour",
  "до 1000 тестов/час": "up to 1000 tests/hour",
  "до 110 тестов/час": "up to 110 tests/hour",
  "до 120 тестов/час": "up to 120 tests/hour",
  "до 180 тестов/час": "up to 180 tests/hour",
  "до 20 МГц": "up to 20 MHz",
  "до 20 тестов/час": "up to 20 tests/hour",
  "до 200 тестов/час": "up to 200 tests/hour",
  "до 2000 тестов/час": "up to 2000 tests/hour",
  "до 280 тестов/час": "up to 280 tests/hour",
  "до 32": "up to 32",
  "до 4": "up to 4",
  "до 4 недель": "up to 4 weeks",
  "до 40 со штрих-кодом": "up to 40 with barcode",
  "до 44": "up to 44",
  "до 450 тестов/час": "up to 450 tests/hour",
  "до 55": "up to 55",
  "до 60 288 образцов": "up to 60,288 samples",
  "до 60 слайдов/час": "up to 60 slides/hour",
  "до 60 тестов/час": "up to 60 tests/hour",
  "до 600 тестов/час": "up to 600 tests/hour",
  "до 96": "up to 96",
  "единый": "unified",
  "золотой стандарт": "gold standard",
  "идентификация + AST": "identification + AST",
  "иммунофлуоресцентный": "immunofluorescent",
  "инфекционные заболевания": "infectious diseases",
  "исключительная": "exceptional",
  "компактный автоматический": "compact automatic",
  "компактный настольный": "compact benchtop",
  "лиофилизированные": "lyophilized",
  "модифицированный Вестергрен": "modified Westergren",
  "модульная": "modular",
  "модульная лаборатория": "modular laboratory",
  "модульная станция": "modular station",
  "молекулярная аллергодиагностика": "molecular allergy diagnostics",
  "молекулярный контроль": "molecular control",
  "настольный секвенатор NGS": "benchtop NGS sequencer",
  "независимая третья": "independent third-party",
  "новое": "new",
  "онкология, иммунология, репродуктология": "oncology, immunology, reproductive medicine",
  "очистка нуклеиновых кислот": "nucleic acid purification",
  "полная": "full",
  "полностью автоматический": "fully automatic",
  "проточный цитометр": "flow cytometer",
  "русский язык": "Russian language",
  "скрытая кровь + трансферрин": "occult blood + transferrin",
  "талассемия, варианты Hb": "thalassemia, Hb variants",
  "тип кюветы и длина считывания": "flow cell type and read length",
  "фенотипический": "phenotypic",
  "химический": "chemical",
  "химический + микроскопический + физический": "chemical + microscopic + physical",
  "химический + физический + микроскопический": "chemical + physical + microscopic",
  "цифровая ПЦР": "digital PCR",
  "1600 тестов/час (один модуль); до 6400 тестов/час (четыре модуля)": "1,600 tests/hour (one module); up to 6,400 tests/hour (four modules)",
  "Сыворотка, плазма, моча, СМЖ": "Serum, plasma, urine, CSF",
  "1,5 - 25 мкл (шаг 0,1 мкл)": "1.5 - 25 µl (0.1 µl steps)",
  "72 позиции для R1 и 72 для R2": "72 positions for R1 and 72 for R2",
  "Работа 8-12°C, хранение 2-8°C": "Operation 8-12°C, storage 2-8°C",
  "362 (постоянные кварцевые)": "362 (permanent quartz)",
  "10 минут; 22 минуты": "10 minutes; 22 minutes",
  "80 - 250 мкл": "80 - 250 µl",
  "13 фиксированных (340-800 нм)": "13 fixed (340-800 nm)",
  "Галогенная лампа 12 В, 100 Вт": "Halogen lamp 12 V, 100 W",
  "133×118×135 см, 560 кг (биохимический модуль)": "133×118×135 cm, 560 kg (biochemistry module)",
  "ISE (300 тестов/час), декаппер (по заказу)": "ISE (300 tests/hour), decapper (to order)",
  "58,5 × 53,3 × 63,5 см (В×Ш×Г)": "58.5 × 53.3 × 63.5 cm (H×W×D)",
  "158,8 × 93,3 × 86,4 см (В×Ш×Г)": "158.8 × 93.3 × 86.4 cm (H×W×D)",
  "Оптический (4 светодиода, 3 длины волны) + электрический (импедансная спектроскопия)": "Optical (4 LEDs, 3 wavelengths) + electrical (impedance spectroscopy)",
  "~20 на поверхности шейки матки": "~20 on the cervical surface",
  "~10 минут": "~10 minutes",
  "«Норма» или «Аномалия» (ИИ-алгоритм)": "'Normal' or 'Abnormal' (AI algorithm)",
  "Одноразовый (SUS)": "Single-use (SUS)",
  "42 000+ пациенток": "42,000+ patients",
  "CE, MHRA, NMPA, SFDA, TGA, Росздравнадзор": "CE, MHRA, NMPA, SFDA, TGA, Roszdravnadzor",
  "TruScreen Group Ltd (Австралия)": "TruScreen Group Ltd (Australia)",
};

export function specValue(value: string, locale: string): string {
  if (locale === "uz") return SPEC_VALUE_UZ[value] ?? value;
  if (locale === "en") return SPEC_VALUE_EN[value] ?? value;
  return value;
}

// The analyte/item chips on the reagent cards are mostly language neutral
// (TSH, CA-125); these are the few Russian ones.
const ANALYTE_UZ: Record<string, string> = {
  "Пробирки": "Probirkalar",
  "Starter 1+2 (2x230 мл)": "Starter 1+2 (2x230 ml)",
  "Кюветы Reaction Modules": "Reaction Modules kyuvetalari",
  "Промывочный концентрат": "Yuvish konsentrati",
  "Оптический контроль": "Optik nazorat",
  "Раствор для очистки труб": "Quvurlarni tozalash eritmasi",
  "Starter 1+2 для X3": "X3 uchun Starter 1+2",
  "Starter 1+2 (2x1.5 л)": "Starter 1+2 (2x1.5 l)",
  "Кюветы Reaction Cup": "Reaction Cup kyuvetalari",
  "Наконечники": "Uchliklar",
  "Щелочная промывка": "Ishqoriy yuvish",
  "Кислотная промывка": "Kislotali yuvish",
  "ISE очистка": "ISE tozalash",
  "ISE набор": "ISE toʻplami",
  "Галогеновая лампа": "Galogen lampa",
  "Кюветы": "Kyuvetalar",
};

const ANALYTE_EN: Record<string, string> = {
  "Пробирки": "Tubes",
  "Starter 1+2 (2x230 мл)": "Starter 1+2 (2x230 ml)",
  "Кюветы Reaction Modules": "Reaction Modules cuvettes",
  "Промывочный концентрат": "Wash concentrate",
  "Оптический контроль": "Optical control",
  "Раствор для очистки труб": "Tubing cleaning solution",
  "Starter 1+2 для X3": "Starter 1+2 for X3",
  "Starter 1+2 (2x1.5 л)": "Starter 1+2 (2x1.5 l)",
  "Кюветы Reaction Cup": "Reaction Cup cuvettes",
  "Наконечники": "Tips",
  "Щелочная промывка": "Alkaline wash",
  "Кислотная промывка": "Acid wash",
  "ISE очистка": "ISE cleaning",
  "ISE набор": "ISE kit",
  "Галогеновая лампа": "Halogen lamp",
  "Кюветы": "Cuvettes",
};

export function analyteLabel(a: string, locale: string): string {
  if (locale === "uz") return ANALYTE_UZ[a] ?? a;
  if (locale === "en") return ANALYTE_EN[a] ?? a;
  return a;
}
