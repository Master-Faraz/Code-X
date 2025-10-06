'use server';
import { users } from '@/models/server/config';

type UserPrefs = {
  id?: string;
  isCompleted?: boolean;
  totalListings?: number;
  theme?: 'light' | 'dark';
  // credits?: number;
};

export async function createUserPrefs({ userID }: { userID: string }) {
  try {
    if (userID === '') throw { success: false, message: 'User not found' };

    const respone = await users.updatePrefs(userID, {
      id: '123456789',
      isCompleted: false,
      totalListings: 0
    });
    return { success: true, message: 'User profile updated', data: respone };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Can't update user profile", error: error };
  }
}
export async function createDefaultUserPrefs(userID: string) {
  try {
    if (userID === '') throw { success: false, message: 'User not found' };

    const respone = await users.updatePrefs(userID, {
      id: '',
      isCompleted: false,
      totalListings: 0
    });
    return { success: true, message: 'User profile updated', data: respone };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Can't update user profile", error: error };
  }
}

export async function updateUserPrefs({ userID, updates }: { userID: string; updates: Partial<UserPrefs> }) {
  try {
    if (userID === '') throw { success: false, message: 'User not found' };

    // Getting the user for updation
    const user = await users.get(userID);
    const newPrefs = { ...user.prefs, ...updates };
    const response = await users.updatePrefs(userID, newPrefs);
    return { success: true, message: 'User prefs updated', data: response };
  } catch (error) {
    return { success: false, message: "Can't update user prefs", error };
  }
}
