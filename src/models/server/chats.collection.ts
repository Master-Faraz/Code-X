import { IndexType, Permission } from 'node-appwrite';
import { db, chatCollection } from '../name';
import { databases } from './config';

export default async function createChatCollection() {
  await databases.createCollection(db, chatCollection, chatCollection, [
    // Todo : refactor the permissions
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);
  console.log('Chat collection created successfully');

  //   Attributes

  await Promise.all([
    databases.createStringAttribute(db, chatCollection, 'id', 36, true),
    databases.createStringAttribute(db, chatCollection, 'listing_id', 36, true),
    databases.createStringAttribute(db, chatCollection, 'owner_id', 36, true),
    databases.createStringAttribute(db, chatCollection, 'tenant_id', 36, true),
    databases.createDatetimeAttribute(db, chatCollection, 'created_at', true),
    databases.createDatetimeAttribute(db, chatCollection, 'updated_at', false)
  ]);

  console.log('Chats attributes created successfully');

  //   Indexes

  await Promise.all([
    databases.createIndex(db, chatCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, chatCollection, 'idx_listing_id', IndexType.Key, ['listing_id']),
    databases.createIndex(db, chatCollection, 'idx_owner_id', IndexType.Key, ['owner_id']),
    databases.createIndex(db, chatCollection, 'idx_tenant_id', IndexType.Key, ['tenant_id']),
    databases.createIndex(db, chatCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);

  console.log('Chat Indexes created successfullly');
}
