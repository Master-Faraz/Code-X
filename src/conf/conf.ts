// Production grade approach so that TypeScript does't give error ex-> we have to put ! for forcefully enrap the var
// But with this approach we are certain that our variable is always present

const conf = {
    appwriteUrl: String(process.env.APPWRITE_ENDPOINT),
    appwriteProjectId: String(process.env.APPWRITE_PROJECT_ID),
    appwriteDbId: String(process.env.APPWRITE_DB_ID),
    appwriteCollectionId: String(process.env.APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(process.env.APPWRITE_BUCKET_ID),

}
export default conf