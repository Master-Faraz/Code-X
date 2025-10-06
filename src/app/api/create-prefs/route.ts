import { createDefaultUserPrefs } from '@/actions/userPrefs.action';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // destructuring the body

  try {
    const { userID } = await request.json();

    if (!userID || typeof userID !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing or invalid userID' }, { status: 400 });
    }

    const result = await createDefaultUserPrefs(userID);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (err: any) {
    console.error('API create-prefs error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Unknown error' }, { status: 500 });
  }
}
