import { IndexType, Permission } from 'node-appwrite';
import { db, messageCollection } from '../name';
import { databases } from './config';

export default async function createMessagesCollection() {
  // Creating collection
  await databases.createCollection(db, messageCollection, messageCollection, [
    // Todo : refactor the permissions
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  console.log('Messages collection created successfully');

  //   Attributes

  await Promise.all([
    databases.createStringAttribute(db, messageCollection, 'id', 36, true),
    databases.createStringAttribute(db, messageCollection, 'chat_id', 36, true),
    databases.createStringAttribute(db, messageCollection, 'sender_id', 36, true),
    databases.createStringAttribute(db, messageCollection, 'content', 2000, true),
    databases.createDatetimeAttribute(db, messageCollection, 'created_at', true),
    databases.createDatetimeAttribute(db, messageCollection, 'updated_at', false)
  ]);

  console.log('Messages attributes created successfully');

  // Delaying so that the attributes creted successfully before index creation
  await new Promise((resolve) => setTimeout(resolve, 60000));
  // await new Promise((resolve) => setTimeout(resolve, 25000));

  //   Indexes

  await Promise.all([
    databases.createIndex(db, messageCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, messageCollection, 'idx_chat_id', IndexType.Key, ['chat_id']),
    databases.createIndex(db, messageCollection, 'idx_sender_id', IndexType.Key, ['sender_id']),
    databases.createIndex(db, messageCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);

  console.log('Messages Indexes created successfullly');
}
