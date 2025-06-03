import { NextResponse } from 'next/server';

// In-memory cache for tenant verification
const tenantCache = new Map();

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the hostname is just localhost (without subdomain)
  const isRootDomain = hostname === 'localhost:3000' || hostname === 'localhost';
  
  // Get token from cookies
  const token = request.cookies.get('tenant_token')?.value;

  // For root domain (localhost), serve everything from central directory
  if (isRootDomain) {
    if (!url.pathname.startsWith('/central')) {
      url.pathname = `/central${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // For tenant subdomains, verify tenant and serve from tenant directory
  const tenantName = hostname.split('.')[0];
  
  // Check cache for tenant verification
  const cachedTenant = tenantCache.get(tenantName);
  const now = Date.now();
  
  if (cachedTenant && (now - cachedTenant.timestamp) < CACHE_DURATION) {
    // If tenant is verified and cache is still valid, serve from tenant directory
    if (!url.pathname.startsWith('/tenant')) {
      // Check if user is trying to access a protected route
      if (url.pathname !== '/login' && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      url.pathname = `/tenant${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }
  
  try {
    // Check if tenant exists by making API request
    const tenantResponse = await fetch(`http://app.localhost:8000/api/tenant/get-tenant-by-name/${tenantName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      cache: 'force-cache'
    });
    
    if (!tenantResponse.ok) {
      // If tenant doesn't exist, redirect to notfound page
      const notFoundUrl = new URL('/notfound', request.url);
      notFoundUrl.searchParams.set('tenant', tenantName);
      return NextResponse.redirect(notFoundUrl);
    }

    // Cache the tenant verification result
    tenantCache.set(tenantName, {
      verified: true,
      timestamp: now
    });

    // Serve from tenant directory
    if (!url.pathname.startsWith('/tenant')) {
      // Check if user is trying to access a protected route
      if (url.pathname !== '/login' && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      url.pathname = `/tenant${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  } catch (error) {
    // On error, redirect to notfound page
    const notFoundUrl = new URL('/notfound', request.url);
    notFoundUrl.searchParams.set('tenant', tenantName);
    return NextResponse.redirect(notFoundUrl);
  }
}

// Run middleware on all routes except static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 