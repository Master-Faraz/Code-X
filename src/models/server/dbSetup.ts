import { db } from '../name';
import createChatCollection from './chats.collection';
import { databases } from './config';
import createMessagesCollection from './messages.collection';
import createRoomListingCollection from './roomListings.collection';
import createSavedPostsCollection from './savedPosts.collection';
import createTransactionCollection from './transactions.collection';
import createUserCollection from './users.collection';

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log('Database connected ');
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log('Database created successfully');

      // Create Collection
      // await Promise.all([
      //   createUserCollection(),
      //   createRoomListingCollection(),
      //   createSavedPostsCollection(),
      //   createChatCollection(),
      //   createMessagesCollection(),
      //   createTransactionCollection()
      // ]);

      // Execute sequentially instead of parallel
      await createUserCollection();
      await createRoomListingCollection();
      await createSavedPostsCollection();
      await createChatCollection();
      await createMessagesCollection();
      await createTransactionCollection();

      console.log('****** All Collections created successfully ******');

      console.log('DB connected');
    } catch (error: any) {
      console.log('error while creating db :: ' + error.message);
      throw error;
    }
  }
  return databases;
}
