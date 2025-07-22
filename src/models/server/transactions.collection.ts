import { IndexType, Permission } from 'node-appwrite';
import { db, transactionCollection } from '../name';
import { databases } from './config';

export default async function createTransactionCollection() {
  // Creating collection
  await databases.createCollection(db, transactionCollection, transactionCollection, [
    // Todo : refactor the permissions
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  console.log('Transaction collection created successfully');

  //   Attributes

  await Promise.all([
    databases.createStringAttribute(db, transactionCollection, 'id', 36, true),
    databases.createStringAttribute(db, transactionCollection, 'user_id', 36, true),
    databases.createIntegerAttribute(db, transactionCollection, 'amount', true),
    databases.createIntegerAttribute(db, transactionCollection, 'credits_added', true),
    databases.createEnumAttribute(db, transactionCollection, 'type', ['Purchase', 'Spend'], true),
    databases.createEnumAttribute(db, transactionCollection, 'source', ['Razorpay', 'Card', 'Others'], false),
    databases.createStringAttribute(db, transactionCollection, 'spend_chat_id', 36, false), //. spending credit on chat id
    databases.createDatetimeAttribute(db, transactionCollection, 'created_at', true)
  ]);

  console.log('Transaction attributes created successfully');

  //   Indexes

  await Promise.all([
    databases.createIndex(db, transactionCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, transactionCollection, 'idx_user_id', IndexType.Key, ['user_id']),
    databases.createIndex(db, transactionCollection, 'idx_type', IndexType.Key, ['type']),
    databases.createIndex(db, transactionCollection, 'idx_spend_chat_id', IndexType.Key, ['spend_chat_id']),
    databases.createIndex(db, transactionCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);

  console.log('Transaction Indexes created successfullly');
}
