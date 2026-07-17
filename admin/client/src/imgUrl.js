// Turn a catalog image reference (/images/products/x.png) into a URL the admin
// backend can serve (/api/site-images/products/x.png). Adds a cache-buster so a
// re-uploaded image with the same name refreshes in the UI.
export function imgUrl(publicPath, bust) {
  if (!publicPath) return "";
  const mapped = publicPath.replace(/^\/images\//, "/api/site-images/");
  return bust ? `${mapped}?v=${bust}` : mapped;
}
