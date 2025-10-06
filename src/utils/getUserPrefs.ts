'use server';
import { users } from '@/models/server/config';

export default async function getUserPrefs(uid: string) {
  const result = await users.getPrefs(uid);
  return result;
}
