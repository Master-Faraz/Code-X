import { IndexType, Permission } from 'node-appwrite';
import { db, transactionCollection } from '../name';
import { databases } from './config';

export default async function createTransactionCollection() {
  await databases.createCollection(db, transactionCollection, transactionCollection, [
    Permission.read('users'),
    Permission.create('users'),
    Permission.update('users'),
    Permission.delete('users')
  ]);

  // Attributes to capture every payment event
  await Promise.all([
    databases.createStringAttribute(db, transactionCollection, 'id', 36, true),
    databases.createStringAttribute(db, transactionCollection, 'user_id', 36, true),
    databases.createIntegerAttribute(db, transactionCollection, 'amount', true),
    databases.createEnumAttribute(db, transactionCollection, 'type', ['Purchase', 'Refund', 'Adjustment'], true),
    databases.createEnumAttribute(db, transactionCollection, 'source', ['Razorpay', 'Stripe', 'PayPal', 'Other'], false),
    databases.createStringAttribute(db, transactionCollection, 'payment_id', 100, false), // gateway’s transaction ID
    databases.createDatetimeAttribute(db, transactionCollection, 'created_at', true)
  ]);

  // Indexes for lookup and reporting
  await Promise.all([
    databases.createIndex(db, transactionCollection, 'idx_id', IndexType.Unique, ['id']),
    databases.createIndex(db, transactionCollection, 'idx_user_id', IndexType.Key, ['user_id']),
    databases.createIndex(db, transactionCollection, 'idx_type', IndexType.Key, ['type']),
    databases.createIndex(db, transactionCollection, 'idx_source', IndexType.Key, ['source']),
    databases.createIndex(db, transactionCollection, 'idx_created_at', IndexType.Key, ['created_at'], ['asc'])
  ]);
}
