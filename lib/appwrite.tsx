import SignIn from '@/app/(auth)/sign-in';
import { getEnvironment } from '@/constants/environment';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.breeze",
    projectId: "6759cec00013522c0b0c",
    databaseId: "6759d09800337e8faaad",
    userCollectionId: "6759d0b6003878bcc76d"
};

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const databases = new Databases(client);

export const createUser = async (email: string, password: string, username: string) => {
    const { baseUrl } = getEnvironment();
    try {
        const uniqueId = ID.unique();
        // Step 1: Prepare payload for API call
        const userPayload = {
            userName: username,
            emailAddress: email,
            userId: uniqueId
        };

        // Step 2: Make API call to create-user
        const response = await fetch(`${baseUrl}/v1/breeze/user/create-user`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPayload),
        });

        if (!response.ok) {
            console.error('Failed to create new user in DB');
            throw new Error('Failed to create user in external system');
        }

        console.log('User successfully created in external DB');

        // Step 3: Create Appwrite account only after successful API call
        const newAccount = await account.create(
            uniqueId,
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Failed to create Appwrite account.');

        // Step 4: Sign in the new user
        await signIn(email, password);

        // Step 5: Create a user document in Appwrite Database
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                username: username,
                emailAddress: email,
                userCode: newAccount.$id
            }
        );

        return newUser;
    } catch (error: any) {
        console.error(error);
        throw new Error(`Error occurred while creating user: ${error.message}`);
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error: any) {
        console.error(error);
        throw new Error(`Error occurred while signing user: ${error.message}`);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error: any) {
        console.log(error);
        throw new Error(`Error occurred while signing out user: ${error.message}`);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('No current account found.');

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('userCode', currentAccount.$id)]
        );

        if (!currentUser) throw new Error('No current user found.');

        return currentUser.documents[0];
    } catch (error: any) {
        console.error(error);
        throw new Error(`Error occurred while fetching current user: ${error.message}`);
    }
};
