# -*- coding: utf-8 -*-
import json

uz = {
"maglumi-x3": "Maglumi X3 — SNIBE kompaniyasining ixcham stol usti immunoxemilyuminessent tahlil (IXLA) tizimi. Oʻrtacha yuklamali laboratoriyalar uchun ideal yechim, 260 parametrli panelga kirish imkonini beradi. SNIBE — 30 yillik tarixga ega jahon yetakchisi, 163 mamlakatda taqdim etilgan, 40 000 dan ortiq oʻrnatilgan analizator. Oʻzbekistonda IXLA boʻyicha №1.",
"maglumi-x6": "Maglumi X6 — oʻrta va yirik laboratoriyalar uchun SNIBE kompaniyasining unumdor IXLA tizimi. Namuna va reagentlarni kengaytirilgan yuklash uzluksiz ishlash bilan birgalikda barqaror natija sifatida yuqori oʻtkazuvchanlikni taʼminlaydi.",
"maglumi-x8": "Maglumi X8 — yirik klinik-diagnostika laboratoriyalari uchun yuqori unumdor immunoxemilyuminessent analizator. Bortda namuna va reagentlarning katta zaxirasi, shoshilinch namunalar uchun STAT-X texnologiyasi.",
"maglumi-x10": "Maglumi X10 — SNIBE Maglumi X-seriyasining flagmani. Soatiga 1000 testgacha maksimal unumdorlik, namuna va reagentlarni rekord darajada yuklash. Eng yirik laboratoriyalar va laboratoriya tarmoqlari uchun moʻljallangan. Biolumi CX trek-tizimiga birlashtirilishi mumkin.",
"reagenty-ihla": "Immunoxemilyuminessent tahlil uchun SNIBE Maglumi ikkinchi avlod reagentlarining toʻliq liniyasi: qalqonsimon bez paneli, reproduktiv gormonlar va onkomarkerlar, infeksiyalar, yurak va yalligʻlanish biomarkerlari, autoimmun va prenatal panellar. Maglumi seriyasidagi barcha analizatorlar bilan mos keladi.",
"maglumi-600": "Maglumi 600 — kichik laboratoriyalar uchun optimal oʻtkazuvchanlikka ega keng turdagi diagnostik testlarni miqdoriy tahlil qilish uchun SNIBE kompakt immunoxemilyuminessent analizatori. ABEI belgilari va magnit mikrozarrachalariga asoslangan flesh-xemilyuminessent texnologiya.",
"maglumi-800": "Maglumi 800 — yaxshi oʻtkazuvchanlikka ega keng turdagi diagnostik testlarni sifat va miqdor jihatdan tahlil qilish uchun SNIBE stol usti immunoxemilyuminessent analizatori. Kislotali va ishqorli buferlarda barqaror ABEI belgilaridagi fermentsiz flesh-xemilyuminessensiya va magnit nanozarrachalarda separatsiya.",
"maglumi-2000": "Maglumi 2000 — oʻrta va yirik laboratoriyalar uchun SNIBE yuqori unumdor immunoxemilyuminessent analizatori. Namuna va reagentlarni uzluksiz yuklash, ABEI belgilari va magnit mikrozarrachalarida flesh-xemilyuminessensiya.",
"maglumi-2000-plus": "Maglumi 2000 Plus — yirik laboratoriyalar va oqimli tadqiqotlar uchun kengaytirilgan oʻtkazuvchanlikka ega SNIBE takomillashtirilgan yuqori unumdor immunoxemilyuminessent analizatori. ABEI belgilari va magnit mikrozarrachalariga asoslangan flesh-xemilyuminessent texnologiya.",
"biossays-240-plus": "Biossays 240 Plus — elektrolit moduli bilan birlashtirilgan (2-in-1) ochiq tipdagi ixcham stol usti biokimyoviy analizator. 100+ parametrli panel: lipidlar, buyrak va jigar funksiyasi, oqsillar, revmatizm, ionlar, anemiya, diabet, kardiologiya.",
"biossays-c10": "Biossays C10 — SNIBE kompaniyasining kuchli va intellektual biokimyoviy tizimi. Biokimyo boʻyicha soatiga 2000 testgacha unumdorlik, qoʻshimcha elektrolit moduli soatiga 1000 test. Qopqoqlarni avtomatik olib tashlash uchun decapper-modulini qoʻshish imkoniyati.",
"biolumi-cx-solution": "Biolumi CX Solution — IXLA va biokimyoni yagona trek-tizimga birlashtiruvchi integratsiyalashgan platforma. Mavjud konfiguratsiyalar: X10+C10 (IXLA 1000 t/s + biokimyo 2000 t/s), X8+C10, X8+C8, X6+C8. Barcha konfiguratsiyalar 1000 t/s elektrolit modulini oʻz ichiga oladi.",
"acl-top-350-cts": "Werfen ACL TOP 350 CTS — Oʻzbekistonda avtomatik gemostaz boʻyicha №1. Birinchi natijagacha bor-yoʻgʻi 3 daqiqa, preanalitik modul probirka toʻldirilganligini, anomal aspiratsiyani, gemolizni, giperbilirubinemiya va lipemiyani baholaydi. Keng menyu: rutin gemostaz, antikoagulyant terapiya, tromboz diagnostikasi, trombofiliya, Villebrand kasalligi, AFS.",
"gem-premier-5000": "GEM Premier 5000 qon gazlari, pH, elektrolitlar, glyukoza, laktat, gematokrit, CO-oksimetriya va umumiy bilirubinni oʻlchaydi. IntraSpect texnologiyali iQM2 avtomatik sifat nazorati tizimi real vaqtda uzluksiz nazoratni taʼminlaydi. 17 oʻlchanadigan va 26 hisoblanadigan parametr.",
"gem-premier-3500": "GEM Premier 3500 — kritik holatlarni tezkor diagnostika qilish uchun analizator. pH, pCO₂, pO₂, elektrolitlar, glyukoza, laktat va gematokritni 85 soniyada oʻlchaydi. 9 oʻlchanadigan va 17 hisoblanadigan parametr.",
"dh-800": "Dymind DH-800 — AI-tahlilli 6-Diff + RET + NRBC top gematologik analizator. Lazer yorugʻlik sochilishi, flyuoressent usul va oqim sitometriyasini birlashtiradi. 46 asosiy va 163 tadqiqot parametri, 15.6\" ekran, 60 namunani avtomatik yuklash, 300 000 yozuv xotirasi.",
"dh-615": "Dymind DH-615 — AI-tahlilli 6-Diff + RET gematologik analizator, soatiga 100 testgacha. 64 parametr (35 asosiy + 29 tadqiqot), lazer-flyuoressent usul, 12.1\" ekran, 150 000 yozuv xotirasi. Red Dot Winner 2021 va iF Design Award sovrindori.",
"dh-88": "Dymind DH-88 — AI-tahlilli 6-Diff + ECHT + RET + NRBC gematologik analizator, soatiga 100 testgacha. Oʻrnatilgan ECHT moduli modifikatsiyalangan Vestergren usuli boʻyicha soatiga 80 test beradi — 25 daqiqada 30 natija, oltin standart bilan ajoyib korrelatsiyada. Namuna hajmi 20 mkl.",
"df56-vet": "Dymind DF56 Vet — AI-tahlilli 6-Diff + RET + NRBC veterinariya gematologik analizatori. 6 turdagi hayvonni qoʻllab-quvvatlaydi: mushuk, it, quyon, sigir, ot, qoʻy. Soatiga 100 testgacha unumdorlik, namuna hajmi 20 mkl.",
"df50-crp": "Dymind DF50 CRP — 5-Diff + CRP gematologik analizator, soatiga 60 testgacha. 3-Diff rejimida 20 mkl hajmda 55 namunagacha avtomatik yuklash. Oʻrnatilgan shtrix-kod skaneri, termoprinter, rus tilidagi interfeysli sensorli ekran.",
"dh-26": "Dymind DH-26 — soatiga 20 testgacha unumdorlikka ega ixcham 3-Diff gematologik analizator. Kichik laboratoriyalar va kabinetlar uchun optimal yechim.",
"cube-30-touch": "CUBE 30 Touch — eritrotsitlar choʻkish tezligini (ECHT) avtomatik aniqlovchi analizator. Modifikatsiyalangan Vestergren usuli boʻyicha 25 daqiqada 30 natija beradi, oltin standart bilan ajoyib korrelatsiyada.",
"urit-bs-8000": "URIT BS-8000 Series — avtonom modulli gematologik laboratoriya. Namunalarni tayyorlash, CBC qon tahlili, hujayra morfologiyasi (soatiga 60 slaydgacha, 33 turdagi hujayrani oldindan tasniflash), surtma tayyorlash va boʻyash, maʼlumotlarni boshqarish markazi va probirkalarni saqlash modullarini oʻz ichiga oladi.",
"urit-us-2000c": "URIT US-2000C — AI kuchaytirilgan toʻliq avtomatlashtirilgan modulli siydik tahlili stansiyasi. Siydikning kimyoviy, mikroskopik va fizik tahlilini yagona ish jarayoniga birlashtiradi.",
"urit-us-1000": "URIT US-1000 — siydikning kimyoviy tahlili uchun avtomatlashtirilgan tizim. Kundalik laboratoriya diagnostikasi uchun ishonchli yechim.",
"urit-us-1680": "URIT US-1680 — kimyoviy, fizik va mikroskopik tahlilni bir korpusda birlashtiruvchi toʻliq avtomatlashtirilgan siydik analizatori.",
"urit-bf-730": "URIT BF-730 — klinik va ilmiy amaliyot uchun oqim sitometri. Qoʻllanilishi: onkologiya, reproduktologiya, immunologiya. Immun holatni baholash (T-limfotsitlar, leykotsitlar), apoptoz, hujayra sikli, immun va genetik markerlarni aniqlash (HLA-B27), hujayra fenotipini tahlil qilish.",
"keyu-ku-f20": "KEYU KU-F20 — AI bilan avtomatik najas analizatori. 30 shaklli element va 6 tur gelmintni aniqlaydi. Yashirin qon va transferringa IXA testini oʻz ichiga oladi.",
"keyu-ku-f40": "KEYU KU-F40 — najas diagnostikasi uchun avtomatik analizator. Klinik laboratoriyalar uchun unumdor yechim.",
"sqa-io-vu": "SQA-IO + SQA-VU — avtomatlashtirilgan sperma tahlili tizimi. JSST 5- va 6-nashr standartlariga toʻliq muvofiq holda 75 soniyada natija.",
"h100-plus": "Lifotronic H100 Plus — JSST oltin standarti (ion almashinuvli YuSSX, IEC-HPLC) boʻyicha flagman glikatlangan gemoglobin analizatori. Eng yuqori tezlik, kengaytirilgan yuklash, toʻliq avtomatlashtirish va modulli kengaytiriluvchanlik. Oʻrnatilgan talassemiya test rejimi.",
"h8": "Lifotronic H8 — IEC-HPLC usulida glikatlangan gemoglobin analizatori. Talassemiyani aniq diagnostika qilish va gemoglobinning patologik variantlarini aniqlashni taʼminlaydi.",
"h9": "Lifotronic H9 — yuqori samarali suyuqlik xromatografiyasi usulidan foydalanadigan yangi avlod glikatlangan gemoglobin analizatori.",
"gh-900-plus": "Lifotronic GH-900 Plus — diabetni kundalik diagnostika qilish uchun glikatlangan gemoglobin analizatori.",
"bd-phoenix-m50": "BD Phoenix M50 — mikroorganizmlarni fenotipik identifikatsiya qilish va ularning antibiotiklarga chidamliligini (AST) aniqlash uchun ishonchli va tezkor tizim. Antibiotik rezistentligiga qarshi kurashda asosiy vosita.",
"bd-bactec-fx40": "BD BACTEC FX 40 — klinik qon namunalarida bakteriya va zamburugʻlarni tezkor aniqlash tizimi. BACTEC oziq muhitlari: Standard/10 Aerobic, Plus Anaerobic, Peds Plus, Myco/F Lytic. Oʻz mikrobiologiya laboratoriyasiga ega boʻlmagan laboratoriyalar, reanimatsiya boʻlimlari va tibbiyot muassasalari uchun mos.",
"condalab-media": "Condalab — 1960 yilda Madrid (Ispaniya) shahrida tashkil etilgan oziq muhitlari ishlab chiqaruvchisi. 130 mamlakatga eksport. ISO, Yevropa farmakopeyasi, FDA, APHA, USP, AOAC standartlariga muvofiqlik.",
"molecision-r8": "Molecision R8 — SNIBE kompaniyasining toʻliq avtomatlashtirilgan yuqori unumdor PZR-«laboratoriyasi». Nuklein kislotalarni ajratib olish, reaksiyani qoʻyish va aniqlashni yagona ish jarayonida birlashtiradi.",
"molecision-s6": "Molecision S6 — nuklein kislotalarning yuqori aniqlikdagi miqdoriy tahlili uchun SNIBE toʻliq integratsiyalashgan raqamli PZR-tizimi.",
"molecision-mp-32": "Molecision MP-32 — bir vaqtning oʻzida 32 tagacha namuna uchun nuklein kislotalarni avtomatik tozalash tizimi. Dekontaminatsiya uchun UB-lampa va HEPA-filtr har bir ishdan keyin sterillikni taʼminlaydi.",
"molecision-mp-96": "Molecision MP-96 — bir vaqtning oʻzida 96 tagacha namuna uchun nuklein kislotalarni avtomatik tozalash boʻyicha yuqori unumdor tizim.",
"blozer-200": "BLOZER 200 — gel-kartali agglyutinatsiyaga (oltin standart) asoslangan toʻliq avtomatik immunogematologik analizator. Soatiga 96 gel-karta, 144 namuna. Qoʻllanilishi: akusherlik, transfuziologiya, jarrohlik, gematologiya, reanimatsiya va neonatologiya.",
"blozer-72": "BLOZER 72 — gel-kartali agglyutinatsiyaga asoslangan ixcham avtomatik immunogematologik analizator. Oʻrtacha yuklamali laboratoriyalar uchun optimal.",
"evidence-multistat": "Randox Evidence Multistat — toʻliq avtomatlashtirilgan biochip immunoflyuoressent analizator. Biochip texnologiyasi (BAT) — 7×7 mikromatritsa, 44 birlikgacha. 500+ modda va metabolitni aniqlaydi. Qoʻllanilishi: allergiya, autoimmun va yalligʻlanish kasalliklari, giyohvandlik va bogʻliqlik keltiruvchi dorilar.",
"phadia-200": "Phadia 200 — molekulyar allergodiagnostika uchun toʻliq avtomatlashtirilgan immunoflyuoressent analizator, allergologiyada oltin standart sifatida tanilgan.",
"riqas": "Randox RIQAS — sifatni tashqi baholashning (STB) eng yirik xalqaro sxemasi. 140 mamlakatdan 85 000 dan ortiq laboratoriya. 1991 yilda tashkil etilgan.",
"acusera": "Randox ACUSERA — uchinchi tomon mustaqil ichki sifat nazorati (ISN). Belgilangan qiymatli nazorat materiallarining keng assortimenti.",
"qcmd": "QCMD — yuqumli kasalliklarni molekulyar tekshirish uchun tashqi sifat baholash. PZR-diagnostikasining ishonchliligini taʼminlaydi.",
"qnostics": "Qnostics — yuqumli kasalliklarni aniqlash uchun molekulyar nazorat vositalari. 500 dan ortiq virusli, bakterial va zamburugʻ nishonlar.",
"miseq-i100": "Illumina MiSeq i100 Series — genomik tadqiqotlar mavjudligida yangi standartlarni oʻrnatuvchi eng sodda va tezkor stol usti yangi avlod sekvenatsiya (NGS) tizimi. Illumina — 1998 yilda San-Diegoda tashkil etilgan, 160 mamlakatda taqdim etilgan NGS kashshofi.",
"nextseq-550": "Illumina NextSeq 550 — bir qurilmada ham NGS, ham mikrochip (array) tadqiqotlarini qoʻllab-quvvatlaydigan yuqori va oʻrta unumdorlikdagi sekvenator.",
"nextseq-1000-2000": "Illumina NextSeq 1000 & 2000 genomik maʼlumotlarni tezlashtirilgan qayta ishlash uchun XLEAP-SBS kimyosi va oʻrnatilgan DRAGEN ikkinchi darajali tahlilidan foydalanadi.",
"novaseq-6000": "Illumina NovaSeq 6000 — aniq tadqiqot vazifalari uchun oqim kyuvetasi turi va oʻqish uzunligini tanlash imkoniyatiga ega kuchli sozlanuvchan sekvenator.",
"novaseq-x": "Illumina NovaSeq X / X Plus — yuqori oʻtkazuvchanlik va soddalashtirilgan logistika va barqarorlik uchun liofillangan reagentlarga ega flagman sekvenatsiya tizimi.",
"clarius-c3-hd3": "Koʻp maqsadli konveks simsiz skaner. Abdominal tekshiruvlar, oʻpka, akusherlik, chuqur tuzilmalar. Konveks datchik ~2–6 MGts. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-l7-hd3": "Chiziqli simsiz skaner. Qon tomirlari, tayanch-harakat apparati (MSK), yuza tuzilmalar, nervlar. ~4–13 MGts. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-l15-hd3": "Yuqori chastotali chiziqli skaner. Yuza va mayda tuzilmalar, MSK, intraoperatsion tekshiruvlar. ~5–15 MGts. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-l20-hd3": "Oʻta yuqori chastotali chiziqli skaner (20 MGtsgacha). Yuza anatomiyasi, dermatologiya, estetik tibbiyot, qon tomirlari, mayda detallar. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-pa-hd3": "Fazali panjarali skaner. Kardiologiya, oʻpka, shoshilinch va intensiv yordam, chuqur tuzilmalar. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-ec7-hd3": "Ichi boʻshliqli (endokavitar) skaner. Akusherlik-ginekologiya, EKU, urologiya, kichik chanoq aʼzolari. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"clarius-pal-hd3": "Ikki matritsali skaner (fazali + chiziqli, 1–15 MGts), universal «butun tana». Kardiologiya, oʻpka, abdominal va yuza tekshiruvlar bitta datchik bilan. Shoshilinch va intensiv yordam. Smartfon yoki planshetga (iOS/Android) ulanish, AI funksiyalari, bulutli saqlash va ~60 daqiqalik akkumulyatorli simsiz qoʻl skaneri.",
"satlars-t8": "SATLARS T8 — Oʻzbekistonda birinchi marta taqdim etilgan modulli avtomatlashtirilgan laboratoriya liniyasi. iF Design Award 2025 sovrindori. Modullar: yuklagich (soatiga 1000 namuna), sentrifugalash (soatiga 550 namuna), kirish/chiqish (soatiga 1000 namuna), qopqoqlarni olish (soatiga 1000 namuna), ikki tomonlama 4-kanalli transport tizimi, muhrlash (soatiga 1000 namuna), sovutish moduli (15 360 namuna), muhrni olish (soatiga 500 namuna). 60 288 namunagacha saqlash, 4 tagacha sovutish modulini birlashtirish. Maglumi X6/X8/X10, Biossays C8/C10, Molecision R8 bilan moslashuvchan.",
}

path = "src/data/catalog.json"
d = json.load(open(path, encoding="utf-8"))
missing = []
for p in d:
    if p["slug"] in uz:
        p["fullDescriptionUz"] = uz[p["slug"]]
    else:
        missing.append(p["slug"])
json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("added fullDescriptionUz to", sum(1 for p in d if "fullDescriptionUz" in p), "products")
print("missing:", missing)
