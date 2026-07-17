"use strict";
const { makeContentRouter } = require("../contentRouter");
const { CERTIFICATES_PATH } = require("../config");
const { processPhoto, savePdf } = require("../images");

// Certificates = src/data/certificates.json (About page grid).
// Schema: { id, image, title?, titleUz?, file? }
// image = preview/scan (required), file = optional full PDF document.

function str(v) {
  return typeof v === "string" ? v.trim() : "";
}

function buildRecord(body, existing) {
  const c = existing ? { ...existing } : {};
  if (typeof body.image === "string" && body.image.trim()) c.image = body.image.trim();
  const setOpt = (k) => {
    if (typeof body[k] === "string") {
      const v = body[k].trim();
      if (v) c[k] = v;
      else delete c[k];
    }
  };
  setOpt("title");
  setOpt("titleUz");
  setOpt("file");
  return c;
}

const router = makeContentRouter({
  filePath: CERTIFICATES_PATH,
  label: "certificate",
  fieldOrder: ["id", "image", "title", "titleUz", "file"],
  nameOf: (r) => r.title || r.id,
  buildRecord,
  validateCreate: (body) => {
    const errors = [];
    if (!str(body.image)) errors.push("Загрузите изображение сертификата.");
    if (!str(body.title)) errors.push("Укажите название (RU).");
    if (!str(body.titleUz)) errors.push("Укажите название (UZ).");
    return errors;
  },
  idBase: (body) => body.title,
  idFallback: "certificate",
  fileFields: { image: "single", file: "single" },
  supportsHidden: false,
  uploads: {
    image: (buffer, body) => processPhoto(buffer, body.base, "images/certificates"),
    pdf: async (buffer, body) => savePdf(buffer, body.base, "files/certificates"),
  },
});

module.exports = router;
