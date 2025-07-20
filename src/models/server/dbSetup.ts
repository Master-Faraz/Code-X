import { db } from "../name";
import { databases } from "./config";
import createUserCollection from "./users.collection";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("Database connected ");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database created successfully");

      // Create Collection
      Promise.all([createUserCollection()]);
      console.log("Collection created successfully");
      console.log("DB connected");
    } catch (error: any) {
      console.log("error while creating db :: " + error.message);
    }
  }
  return databases;
}
