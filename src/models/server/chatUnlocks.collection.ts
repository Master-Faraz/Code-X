import { IndexType, Permission } from 'node-appwrite';
import { db, unlockCollection } from '../name';
import { databases } from './config';

export default async function createChatUnlockCollection() {
  // Creating collection
  await databases.createCollection(db, unlockCollection, unlockCollection, [
    // Todo : refactor the permissions
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  console.log('Chat-Unlock collection created successfully');

  //   Attributes

  await Promise.all([
    databases.createStringAttribute(db, unlockCollection, 'id', 36, true),
    databases.createStringAttribute(db, unlockCollection, 'listing_id', 36, true),
    databases.createStringAttribute(db, unlockCollection, 'tenant_id', 36, true),
    databases.createStringAttribute(db, unlockCollection, 'owner_id', 36, true),
    databases.createStringAttribute(db, unlockCollection, 'chat_id', 36, true),
    databases.createDatetimeAttribute(db, unlockCollection, 'created_at', true)
  ]);

  console.log('Chat-Unlock attributes created successfully');

  //   Indexes

  await Promise.all([
    databases.createIndex(db, unlockCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, unlockCollection, 'idx_listing_id', IndexType.Key, ['listing_id']),
    databases.createIndex(db, unlockCollection, 'idx_chat_id', IndexType.Key, ['chat_id']),
    databases.createIndex(db, unlockCollection, 'idx_owner_id', IndexType.Key, ['owner_id']),
    databases.createIndex(db, unlockCollection, 'idx_tenant_id', IndexType.Key, ['tenant_id']),
    databases.createIndex(db, unlockCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);

  console.log('Chat-Unlock Indexes created successfullly');
}
