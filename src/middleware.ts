import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { legacyProductRedirects } from "./lib/legacyRedirects";

const intl = createMiddleware(routing);

// Canonical host is https://albatros.uz (what every canonical/OG/sitemap URL
// already says). The site also answers on www.albatros.uz, which without a
// redirect is duplicate content for search engines: 301 www to the bare host,
// preserving path and query. Only the exact production www host is touched,
// so localhost and preview hosts behave as before. A server-level 301 on
// Hostinger is still recommended as the outer layer; this is the in-app
// guarantee in case that config is missing.
export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host === "www.albatros.uz") {
    const { pathname, search } = req.nextUrl;
    // Explicit target: always https, no stray port, path and query preserved.
    return NextResponse.redirect(new URL(pathname + search, "https://albatros.uz"), 301);
  }

  // Old albatros.uz slugs (still indexed/linked from before the rebuild) are
  // free-form CMS output - random suffixes, percent-encoded Cyrillic, "+" and
  // "™"/"®" characters - which next.config redirects() can't match literally
  // via path-to-regexp. Decoding the pathname and doing a plain lookup sidesteps
  // that entirely. Checked pre-intl so it also catches bare (unprefixed) paths.
  const decodedPath = decodeURIComponent(req.nextUrl.pathname);
  const legacyTarget = legacyProductRedirects[decodedPath];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, "https://albatros.uz"), 301);
  }

  return intl(req);
}

export const config = {
  // skip api, next internals and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
