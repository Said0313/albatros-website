"use strict";
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PORT, CLIENT_ORIGIN, SITE_ROOT, CATALOG_PATH } = require("./config");

const authRoutes = require("./routes/auth.routes");
const { router: metaRoutes } = require("./routes/meta.routes");
const productRoutes = require("./routes/products.routes");

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

app.use("/api/auth", authRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/products", productRoutes);

app.use((req, res) => res.status(404).json({ error: "Не найдено." }));

app.listen(PORT, () => {
  console.log(`[admin] backend on http://localhost:${PORT}`);
  console.log(`[admin] site root: ${SITE_ROOT}`);
});
