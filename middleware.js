import { NextResponse } from 'next/server';

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host');
  
  // Check if the hostname is just localhost (without subdomain)
  const isRootDomain = hostname === 'localhost:3000' || hostname === 'localhost';
  
  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Route based on hostname
  if (isRootDomain) {
    // If we're at the root domain, route to central
    if (!url.pathname.startsWith('/central')) {
      url.pathname = `/central${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else {
    // Extract tenant name from subdomain
    const tenantName = hostname.split('.')[0];
    
    try {
      // Check if tenant exists by making API request
      const response = await fetch(`http://app.localhost:8000/api/tenant/get-tenant-by-name/${tenantName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        // If tenant doesn't exist, redirect to central domain
        return NextResponse.redirect(new URL('/','http://localhost:3000'));
      }

      // If tenant exists, route to tenant pages
      if (!url.pathname.startsWith('/tenant')) {
        url.pathname = `/tenant${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
    } catch (error) {
      // On error, redirect to central domain
      return NextResponse.redirect(new URL('/', 'http://localhost:3000'));
    }
  }

  return NextResponse.next();
}

// Run middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 