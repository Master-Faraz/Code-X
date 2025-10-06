import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  /*
    Checking the user is logged to access the private path else redilect the user to login page
  */

  const path = request.nextUrl.pathname;
  const isPrivatePath = path === '/users/messages' || path === '/users/profile';

  if (isPrivatePath) {
    // Get Appwrite's session cookie
    const sessionCookie = request.cookies.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    console.log(sessionCookie);

    // If no session cookie exists, redirect to login
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/profile', '/users/messages']
};
