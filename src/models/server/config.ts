// const sdk = require("node-appwrite");
import env from '@/app/env';
import { Avatars, Client, Storage, Databases, Users } from 'node-appwrite';

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectId) // Your project ID
  .setKey(env.appwrite.apiKey); // Your secret API key

const databases = new Databases(client);
const avatar = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, users, databases, avatar, storage };
