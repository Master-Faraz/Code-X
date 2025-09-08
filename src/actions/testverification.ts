'use server';

import { users } from '@/models/server/config';

export default async function UserVerificationActionTest(uid = '688517950031c887ca1c') {
  const result = await users.updateEmailVerification(uid, true);
  return result;
}
