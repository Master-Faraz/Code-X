'use server';

import { db, userCollection } from '@/models/name';
import { databases } from '@/models/server/config';
import { handleServerError } from '@/utils/errorHandler';
import { createSuccessResponse } from '@/utils/responseHandler';

const getUserDocument = async (id: string) => {
  try {
    const response = await databases.getDocument(db, userCollection, id);

    const data = {
      fname: response.fname,
      lname: response.lname,
      email: response.email,
      phone: response.phone,
      dob: response.dob,
      profile_pic: response.profile_pic,
      gender: response.gender,
      plan_start_date: response.plan_start_date,
      plan_end_date: response.plan_end_date,
      plan_type: response.plan_type,
      created_at: response.$createdAt
    };

    return createSuccessResponse('Fetched user successfully', data, 'getUserDocument', 200);
  } catch (error) {
    handleServerError("Can't get the user document", error, 'getUserDocument', 500);
  }
};

export default getUserDocument;
