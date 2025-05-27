
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to auth pages and static files/API routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') || // Allow API routes
    pathname.includes('.') // Allow static files like images, css
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      // Redirect to login if trying to access admin pages without a session
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  } else if (sessionCookie && (pathname === '/' || pathname === '')) {
    // Optional: If logged in and on homepage, redirect to dashboard
    // return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }


  return NextResponse.next();
}

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
