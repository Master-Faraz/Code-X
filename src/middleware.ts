import { NextResponse, NextRequest } from 'next/server';
// import getOrCreateDB from "./models/server/dbSetup";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // await Promise.all([getOrCreateDB()]);
  return NextResponse.next();
}

// export const config = {
//   /* match all request paths except for the the ones that starts with:
//   - api
//   - _next/static
//   - _next/image
//   - favicon.com

//   */
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// };
