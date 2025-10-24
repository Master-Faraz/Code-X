'use server';

import { users } from '@/models/server/config';
import { createSuccessResponse } from '@/utils/responseHandler';
import { handleServerError } from '@/utils/errorHandler';

type UserPrefs = {
  id?: string;
  isCompleted?: boolean;
  totalListings?: number;
  profile_pic?: string;
  // credits?: number;
};

/**
 * Create default user preferences
 */
export async function createDefaultUserPrefs(userID: string) {
  try {
    if (!userID) throw new Error('User ID not provided');

    const response = await users.updatePrefs(userID, {
      id: '',
      isCompleted: false,
      totalListings: 0,
      profile_pic: ''
    });

    return createSuccessResponse('Default user preferences created successfully', response, 'createDefaultUserPrefs', 201);
  } catch (error) {
    throw handleServerError('Failed to create default user preferences', error, 'createDefaultUserPrefs', 500);
  }
}

/**
 * Update user preferences
 */
export async function updateUserPrefs({ userID, updates }: { userID: string; updates: Partial<UserPrefs> }) {
  try {
    if (!userID) throw new Error('User ID not provided');

    const user = await users.get(userID);
    if (!user) throw new Error('User not found');

    const newPrefs = { ...user.prefs, ...updates };
    const response = await users.updatePrefs(userID, newPrefs);

    return createSuccessResponse('User preferences updated successfully', response, 'updateUserPrefs', 200);
  } catch (error) {
    throw handleServerError('Failed to update user preferences', error, 'updateUserPrefs');
  }
}
