import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Protect the dashboard routes
  if (url.pathname.startsWith('/dashboard')) {
    const hasAdminSession = req.cookies.has('admin_session');

    if (!hasAdminSession) {
      // Redirect to custom login page
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Redirect /admin directly to /admin/login for convenience
  if (url.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin'],
};
