import SignIn from '@/app/(auth)/sign-in';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.breeze",
    projectId: "6759cec00013522c0b0c",
    databaseId: "6759d09800337e8faaad",
    userCollectionId: "6759d0b6003878bcc76d"
}

const client = new Client()
        .setEndpoint(appwriteConfig.endpoint) 
        .setProject(appwriteConfig.projectId) 
        .setPlatform(appwriteConfig.platform)

    const account = new Account(client);
    const databases = new Databases(client);

    export const createUser = async (email: string, password: string, username: string) => {
        try {
           const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
           )

           if (!newAccount) throw Error;

        //    const avatarUrl = avatars.getInitials(username);
        
           await signIn(email, password);

           const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                username: username,
                emailAddress: email,
                // avatar: avatarUrl,
                userCode: newAccount.$id
            }
           )

           return newUser;
        } catch (error: any) {
            console.error(error);  
            throw new Error(`Error occurred while creating user: ${error.message}`);
        }
    }

    export const signIn = async (email: string, password: string) => {
        try {
            
            const session = await account.createEmailPasswordSession(email, password);
            return session;

        } catch (error: any) {
            console.error(error);  
            throw new Error(`Error occurred while signing user: ${error.message}`);
        }
    }

    export const signOut = async () => {
        try {

            const session = await account.deleteSession('current');
            return session;

        } catch (error: any) {
            console.log(error);
            throw new Error(`Error occurred while signing out user: ${error.message}`);
        }
    }

    export const getCurrentUser = async () => {
        try {

            const currentAccount = await account.get();
            if (!currentAccount) throw Error;

            const currentUser = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.equal('userCode', currentAccount.$id)]
            )

            if (!currentUser) throw Error;
            
            return currentUser.documents[0];
        } catch(error: any) {
            console.error(error);  
            throw new Error(`Error occurred while fetching current user: ${error.message}`);
        }
    }
;