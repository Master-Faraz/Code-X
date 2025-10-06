import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jwt } = await request.json();

    const response = NextResponse.json({ success: true });

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', jwt, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
