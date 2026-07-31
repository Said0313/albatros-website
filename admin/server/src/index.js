"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PORT, CLIENT_ORIGIN, SITE_ROOT, CATALOG_PATH } = require("./config");

const authRoutes = require("./routes/auth.routes");
const { router: metaRoutes } = require("./routes/meta.routes");
const productRoutes = require("./routes/products.routes");
const partnerRoutes = require("./routes/partners.routes");
const clientRoutes = require("./routes/clients.routes");
const certificateRoutes = require("./routes/certificates.routes");
const { router: eventRoutes } = require("./routes/events.routes");
const pricelistRoutes = require("./routes/pricelist.routes");
const auditRoutes = require("./routes/audit.routes");
const translateRoutes = require("./routes/translate.routes");
const publishRoutes = require("./routes/publish.routes");
const { checkGitIdentity } = require("./git");

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, siteRoot: SITE_ROOT, catalog: CATALOG_PATH });
});

// Serve the site's public images (read-only) so the admin UI can render product
// thumbnails without the public site running. Path mirrors catalog references:
// a JSON value of /images/products/x.png is shown at /api/site-images/products/x.png
app.use("/api/site-images", express.static(path.join(SITE_ROOT, "public", "images")));
// Same read-only bridge for non-image public files (certificate PDFs etc).
app.use("/api/site-files", express.static(path.join(SITE_ROOT, "public", "files")));

app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/products", productRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/pricelist", pricelistRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/translate-draft", translateRoutes);
app.use("/api/publish", publishRoutes);

// JSON 404 for unmatched /api/* routes must come before the static/SPA
// fallback below, so unknown API calls never resolve to index.html.
app.use("/api", (req, res) => res.status(404).json({ error: "Не найдено." }));

// In production the built admin UI (admin/client/dist) is served by this
// same process. Locally the UI runs separately via the Vite dev server on
// 5173, and dist/ typically doesn't exist yet — that's fine, we just stay
// API-only and warn.
const CLIENT_DIST = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(path.join(CLIENT_DIST, "index.html"))) {
  app.use(express.static(CLIENT_DIST));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
} else {
  console.warn(
    `[admin] client build not found at ${CLIENT_DIST} — serving API only. ` +
      `Run "npm run build" in admin/client to enable serving the UI, or use the Vite dev server for local development.`
  );
}

app.listen(PORT, () => {
  console.log(`[admin] backend on http://localhost:${PORT}`);
  console.log(`[admin] site root: ${SITE_ROOT}`);
});

checkGitIdentity();
