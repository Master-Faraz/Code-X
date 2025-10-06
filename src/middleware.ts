import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivatePath = path === '/users/messages' || path === '/users/profile';

  if (isPrivatePath) {
    let token = null;

    // Method 1: Check HTTP-only cookie (Web browsers)
    token = request.cookies.get('auth-token')?.value;

    // Method 2: Check Appwrite session cookie (backup)
    if (!token) {
      const appwriteCookie = request.cookies.get(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);
      token = appwriteCookie?.value;
    }

    // Method 3: Check Authorization header (Mobile apps)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      token = authHeader?.replace('Bearer ', '');
    }

    // Method 4: Check custom header (fallback)
    if (!token) {
      token = request.headers.get('x-auth-token');
    }

    // No valid token found
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/profile', '/users/messages']
};
