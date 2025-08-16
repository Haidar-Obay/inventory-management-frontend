import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n.js";
import { NextResponse } from "next/server";

// Tenant cache with tenant name as key
const tenantCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');

  // Skip for static files, API routes, and notfound page to prevent redirect loops
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname === '/notfound'
  ) {
    return NextResponse.next();
  }

  // Extract tenant name from subdomain
  const tenantName = hostname.split('.')[0];
  
  // If no subdomain (just localhost), apply intl middleware
  if (hostname === 'localhost:3000' || hostname === 'localhost') {
    return intlMiddleware(request);
  }

  // Check cache first
  const cached = tenantCache.get(tenantName);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    // Use cached tenant info
    const token = request.cookies.get('tenant_token')?.value;
    if (!token && url.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return intlMiddleware(request);
  }

  // Verify tenant exists
  try {
    const response = await fetch(`http://app.localhost:8000/api/tenant/get-tenant-by-name/${tenantName}`);
    
    if (!response.ok) {
      // Tenant doesn't exist - redirect to root domain notfound page
      const notFoundUrl = new URL('/notfound', 'http://localhost:3000');
      notFoundUrl.searchParams.set('tenant', tenantName);
      return NextResponse.redirect(notFoundUrl);
    }

    // Cache the tenant verification
    tenantCache.set(tenantName, {
      verified: true,
      timestamp: Date.now()
    });

    // Check token for protected routes
    const token = request.cookies.get('tenant_token')?.value;
    if (!token && url.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return intlMiddleware(request);
  } catch (error) {
    // On error, redirect to root domain notfound page
    const notFoundUrl = new URL('/notfound', 'http://localhost:3000');
    notFoundUrl.searchParams.set('tenant', tenantName);
    return NextResponse.redirect(notFoundUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};