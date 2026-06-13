import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-storage')?.value; // Note: In a real app we'd need to parse Zustand's persist state from cookies if using SSR, or rely on client-side protection. But let's keep it simple and redirect to login if we can't detect auth serverside, OR we just do client-side protection.
  
  // Actually, since Zustand is using localStorage by default, server middleware can't read it easily without extra config. 
  // Let's rely on client-side routing protection for this demo, or just basic path checks if possible.
  // We will pass for now and handle protection in client layouts.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
