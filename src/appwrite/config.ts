import conf from "@/conf/conf";
import { Client, Databases, ID, Query, Storage } from "appwrite";


export class Service {

    client = new Client()
    databases;
    bucket;

    // whenever the object is created then constructor is called which initializes the client and account
    constructor() {
        // Go to docs https://appwrite.io/docs/quick-starts/nextjs
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    // DB Documentation -> https://appwrite.io/docs/references/cloud/client-web/databases
    // ToDo find the datatype of the below parameters *********************************************


    async createPost({ title, slug, content, featuredImage, status, userId }: any) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDbId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Create Post error " + error)

        }
    }

    async updatePost(slug: any, { title, content, featuredImage, status }: any) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDbId,
                conf.appwriteCollectionId,
                slug,
                // below is the content we want to update
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Update Post error " + error)

        }
    }

    async deletePost(slug: any) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDbId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: Delete Post error " + error)
            return false
        }
    }

    async getPost(slug: any) {
        try {
            // Here we are returning what we are getting
            return await this.databases.getDocument(
                conf.appwriteDbId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite service :: Get Post error " + error)
            return false
        }
    }

    // query is a default parameter which holds the query for finding all active posts and it is possible because we enable indexes in appwrite DB 
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDbId,
                conf.appwriteCollectionId,
                // we can write queries here instead of writting in parameters
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: Get Post error " + error)
            return false
        }
    }

    // ************************* File upload service *********************

    async uploadFile(file: any) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: Upload File error " + error)
            return false
        }
    }

    async deleteFile(fileId: any) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId,
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: Delete File error " + error)
            return false
        }
    }

    getFile(fileId: any) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

}

const service = new Service()
export default service;
