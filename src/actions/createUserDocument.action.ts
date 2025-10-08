'use server';

import { db, userCollection } from '@/models/name';
import { databases } from '@/models/server/config';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';
import { ID, Permission, Query } from 'node-appwrite';

interface UserDataTypes {
  uid: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  profile_pic: string;
  dob: Date | null;
  gender: 'Male' | 'Female' | 'Others';
  is_complete: boolean;
  plan_type?: 'Free' | 'Premium' | 'Professional' | string;
  plan_start_date?: string | null;
  plan_end_date?: string | null;
}

export default async function CreateUserDocument(userData: UserDataTypes) {
  try {
    //  Check if a user document with same UID exists
    const existing = await databases.listDocuments(db, userCollection, [Query.equal('uid', userData.uid)]);

    // If found, update that document instead of creating a new one
    if (existing.total > 0) {
      const userDocId = existing.documents[0].$id;

      const updated = await databases.updateDocument(db, userCollection, userDocId, { ...userData });

      return createSuccessResponse('User document already existed, updated successfully', updated, 'CreateUserDocumentAction', 200);
    }

    //  Create a new document if none exists
    const response = await databases.createDocument(db, userCollection, ID.unique(), { ...userData }, [
      Permission.read(`user:${userData.uid}`),
      Permission.update(`user:${userData.uid}`),
      Permission.delete(`user:${userData.uid}`)
    ]);

    return createSuccessResponse('User document created successfully', response, 'CreateUserDocumentAction', 201);
  } catch (error) {
    handleServerError('Error while creating user document', error, 'CreateUserDocument');
  }
}
