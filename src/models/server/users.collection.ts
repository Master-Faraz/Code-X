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
    databases.createStringAttribute(db, userCollection, 'name', 100, true),
    databases.createStringAttribute(db, userCollection, 'email', 100, true),
    databases.createStringAttribute(db, userCollection, 'profile_pic', 100, false),
    databases.createIntegerAttribute(db, userCollection, 'credits', false, 0, 1000, 0),
    databases.createBooleanAttribute(db, userCollection, 'is_verified', false),

    databases.createDatetimeAttribute(db, userCollection, 'created_at', true),
    databases.createDatetimeAttribute(db, userCollection, 'updated_at', true)
  ]);

  console.log('User attributes created successfully');

  await Promise.all([
    databases.createIndex(db, userCollection, 'idx_uid', IndexType.Unique, ['uid'], ['asc']),
    databases.createIndex(db, userCollection, 'idx_email', IndexType.Unique, ['email'])
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
