// Creating Service so that it helps in code migration in production grade apps
import conf from "@/conf/conf";
import { Account, Client, ID } from "appwrite";

// Create Account type
type TP_createAcc = {
    email: string,
    password: string,
    name: string
}
// Create login type
type TP_login = {
    email: string,
    password: string,
}

export class AuthService {

    client = new Client()
    account;

    // whenever the object is created then constructor is called which initializes the client and account
    constructor() {
        // Go to docs https://appwrite.io/docs/quick-starts/nextjs
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client)
    }
    // Function for creating account 
    async createAccount({ email, password, name }: TP_createAcc) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);

            // Checking if user account is created or not 
            if (userAccount) {
                // call another method like user account created successfully and login the user 
                return this.login({ email, password })
            }
            else {
                return userAccount
            }

        } catch (error) {
            throw error
        }
    }

    async login({ email, password }: TP_login) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Checking the status of current user -> user logged in or not 
    async getCurrentUser() {
        try {
            return this.account.get(); //.  Get method is from documentation , this returns the promise
        } catch (error) {
            console.log("Appwrite service :: get_Current_User error " + error)
            // throw error
        }
        // if user is not logged-in or there is some error getting the status -> then it returns null
        return null;
    }
    async logout() {
        try {
            return this.account.deleteSessions(); //.  deleting or logging out all sessions of user 
        } catch (error) {
            console.log("Appwrite service :: Logout error " + error)
            // throw error
        }
    }

}

// Creating obj of authservice and exporting it 
const authService = new AuthService();
export default authService;