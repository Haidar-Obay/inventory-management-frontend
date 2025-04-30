import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Remove port if present (e.g., :3000)
  const hostname = host.split(":")[0];

  // Check if it's the central domain
  if (hostname === "app.localhost") {
    url.pathname = `/central${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Match tenant subdomain like hadishokor.app.localhost
  const match = hostname.match(/^(.+)\.app\.localhost$/);

  if (match) {
    const tenant = match[1];
    url.pathname = `/tenant/${tenant}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
