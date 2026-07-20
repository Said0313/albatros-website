// Uzbek translations for catalog DATA (category names + per-product short text).
// Product names are brand/model and stay identical in both locales.
import type { Product, Brand, CompanyEvent } from "@/types";

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

export function categoryLabel(name: string, locale: string): string {
  if (locale === "uz") return CATEGORY_UZ[name] ?? name;
  return CATEGORY_RU[name] ?? name;
}

export function productShort(p: Product, locale: string): string {
  return locale === "uz" ? p.shortDescriptionUz ?? p.shortDescription : p.shortDescription;
}

export function productFull(p: Product, locale: string): string {
  return locale === "uz" ? p.fullDescriptionUz ?? p.fullDescription : p.fullDescription;
}

export function productDetailed(p: Product, locale: string): string | undefined {
  return locale === "uz" ? p.detailedDescriptionUz ?? p.detailedDescription : p.detailedDescription;
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
};

export function specLabel(label: string, locale: string): string {
  return locale === "uz" ? SPEC_LABEL_UZ[label] ?? label : label;
}

const COUNTRY_UZ: Record<string, string> = {
  "Китай · Шэньчжэнь": "Xitoy · Shenchjen", "США · Нью-Джерси": "AQSh · Nyu-Jersi",
  "Великобритания · Кримлин": "Buyuk Britaniya · Krimlin", "Испания · Барселона": "Ispaniya · Barselona",
  "США · Сан-Диего": "AQSh · San-Diego", "Китай · Гуйлинь": "Xitoy · Guylin",
  "Канада · Ванкувер": "Kanada · Vankuver", "Испания · Мадрид": "Ispaniya · Madrid",
  "Швеция · Уппсала": "Shvetsiya · Uppsala", "Китай": "Xitoy",
};

export function brandSpecialty(b: Brand, locale: string): string | undefined {
  return locale === "uz" ? b.specialtyUz ?? b.specialty : b.specialty;
}
export function brandDescription(b: Brand, locale: string): string {
  return locale === "uz" ? b.descriptionUz ?? b.description : b.description;
}
export function brandCountry(b: Brand, locale: string): string | undefined {
  if (!b.country) return undefined;
  return locale === "uz" ? COUNTRY_UZ[b.country] ?? b.country : b.country;
}
export function eventTitle(e: CompanyEvent, locale: string): string {
  return locale === "uz" ? e.titleUz ?? e.title : e.title;
}
export function eventDescription(e: CompanyEvent, locale: string): string | undefined {
  return locale === "uz" ? e.descriptionUz ?? e.description : e.description;
}

const MONTH_UZ: Record<string, string> = {
  "Январь": "Yanvar", "Февраль": "Fevral", "Март": "Mart", "Апрель": "Aprel", "Май": "May", "Июнь": "Iyun",
  "Июль": "Iyul", "Август": "Avgust", "Сентябрь": "Sentabr", "Октябрь": "Oktabr", "Ноябрь": "Noyabr", "Декабрь": "Dekabr",
};

export function eventDate(date: string, locale: string): string {
  if (locale !== "uz") return date;
  let out = date;
  for (const [ru, uz] of Object.entries(MONTH_UZ)) out = out.replace(ru, uz);
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
  "240 тестов/час": "soatiga 240 test",
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
};

export function specValue(value: string, locale: string): string {
  return locale === "uz" ? SPEC_VALUE_UZ[value] ?? value : value;
}
