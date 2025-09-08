import { IndexType, Permission } from 'node-appwrite';
import { db, userCollection } from '../name';
import { databases } from './config';

export default async function createUserCollection() {
  // Creating the collection and setting permission
  await databases.createCollection(db, userCollection, userCollection, [Permission.create('users')]);

  console.log('User collection created successfully');

  //   Creating attributes
  await Promise.all([
    databases.createStringAttribute(db, userCollection, 'uid', 100, true),
    databases.createStringAttribute(db, userCollection, 'fname', 100, true),
    databases.createStringAttribute(db, userCollection, 'lname', 100, true),
    databases.createStringAttribute(db, userCollection, 'email', 100, true),
    databases.createStringAttribute(db, userCollection, 'phone', 12, true),
    databases.createStringAttribute(db, userCollection, 'profile_pic', 100, true),
    databases.createDatetimeAttribute(db, userCollection, 'dob', true),
    databases.createEnumAttribute(db, userCollection, 'gender', ['Male', 'Female', 'Others'], true),

    databases.createBooleanAttribute(db, userCollection, 'is_complete', false, false),
    databases.createDatetimeAttribute(db, userCollection, 'created_at', true),
    databases.createDatetimeAttribute(db, userCollection, 'updated_at', true),

    databases.createEnumAttribute(db, userCollection, 'plan_type', ['Free', 'Premium', 'Boost'], false),
    databases.createDatetimeAttribute(db, userCollection, 'plan_start_date', false),
    databases.createDatetimeAttribute(db, userCollection, 'plan_end_date', false)
  ]);

  console.log('User attributes created successfully');

  // Delaying so that the attributes creted successfully before index creation
  await new Promise((resolve) => setTimeout(resolve, 60000));

  await Promise.all([
    databases.createIndex(db, userCollection, 'idx_uid', IndexType.Unique, ['uid'], ['asc']),
    databases.createIndex(db, userCollection, 'idx_email', IndexType.Unique, ['email']),

    databases.createIndex(db, userCollection, 'idx_plan_type', IndexType.Key, ['plan_type']),
    databases.createIndex(db, userCollection, 'idx_plan_end', IndexType.Key, ['plan_end_date'])
  ]);
}

// Just remember to add these permissions while creating the users

// await databases.createDocument(
//   db,
//   userCollection,
//   'unique()',
//   {
//     uid: user.$id,
//     name: user.name,
//     email: user.email,
//     profile_pic: "", // or uploaded URL
//     credits: 0,
//     is_verified: false,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   [
//     Permission.read(`user:${user.$id}`),
//     Permission.update(`user:${user.$id}`),
//     Permission.delete(`user:${user.$id}`)
//   ]
// );
