
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simpan data ini di cookie atau session nantinya
// Untuk demo, kita asumsikan middleware membaca role dari cookie
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil data user dari cookie (nama cookie bisa disesuaikan nanti dengan Firebase Auth)
  const userRole = request.cookies.get('user-role')?.value; // 'admin', 'trainer', 'user'
  const isLoggedIn = request.cookies.get('is-logged-in')?.value === 'true';

  // 1. Proteksi halaman ADMIN
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/masuk', request.url));
    }
  }

  // 2. Proteksi halaman TRAINER
  if (pathname.startsWith('/trainer/dashboard')) {
    if (!isLoggedIn || userRole !== 'trainer') {
      return NextResponse.redirect(new URL('/masuk', request.url));
    }
  }

  // 3. Proteksi halaman DASHBOARD USER (Hasil Tes/Bootcamp)
  const protectedUserRoutes = ['/hasil', '/bootcamp', '/wawancara'];
  if (protectedUserRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/masuk', request.url));
    }
  }

  // 4. Jika user sudah LOGIN, jangan biarkan masuk ke halaman /masuk atau /daftar lagi
  if ((pathname === '/masuk' || pathname === '/daftar') && isLoggedIn) {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (userRole === 'trainer') return NextResponse.redirect(new URL('/trainer/dashboard', request.url));
    return NextResponse.redirect(new URL('/hasil', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/trainer/dashboard/:path*',
    '/hasil/:path*',
    '/bootcamp/:path*',
    '/wawancara/:path*',
    '/masuk',
    '/daftar'
  ],
};
