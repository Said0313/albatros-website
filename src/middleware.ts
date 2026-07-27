import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

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
  return intl(req);
}

export const config = {
  // skip api, next internals and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
