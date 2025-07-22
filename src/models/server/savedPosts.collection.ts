import { IndexType, Permission } from 'node-appwrite';
import { db, savedCollection } from '../name';
import { databases } from './config';

export default async function createSavedPostsCollection() {
  // Creating collection
  await databases.createCollection(db, savedCollection, savedCollection, [
    // Todo : refactor the permissions
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  console.log('Saved Posts collection created successfully');

  //   Attributes

  await Promise.all([
    databases.createStringAttribute(db, savedCollection, 'id', 36, true),
    databases.createStringAttribute(db, savedCollection, 'user_id', 36, true),
    databases.createStringAttribute(db, savedCollection, 'listing_id', 36, true),
    databases.createDatetimeAttribute(db, savedCollection, 'created_at', true)
  ]);

  console.log('Saved Posts  attributes created successfully');

  //   Indexes

  await Promise.all([
    databases.createIndex(db, savedCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, savedCollection, 'idx_user_id', IndexType.Key, ['user_id']),
    databases.createIndex(db, savedCollection, 'idx_listing_id', IndexType.Key, ['listing_id']),
    databases.createIndex(db, savedCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);

  console.log('Saved Posts  Indexes created successfullly');
}
