import conf from '../conf/conf.js';
import { Client, Account,ID } from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        console.log("🔧 Initializing Appwrite Auth Service...");
        console.log("🌐 Appwrite URL:", conf.appwriteUrl);
        console.log("📋 Project ID:", conf.appwriteProjectId);
        console.log("🌍 Current domain:", window.location.hostname);

        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);

        console.log("✅ Appwrite Auth Service initialized");
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }
    
    async login({ email, password }) {
        try {
            console.log("🔐 Attempting login for:", email);
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log("✅ Login successful:", session);
            return session;
        } catch (error) {
            console.error("❌ Login failed:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                type: error.type
            });

            // Check for common CORS/domain issues
            if (error.message.includes('CORS') || error.message.includes('network')) {
                console.error("🚨 CORS/Network Error - Check Appwrite platform settings!");
                console.error("Current domain:", window.location.hostname);
                console.error("Make sure this domain is added to Appwrite platforms");
            }

            throw error;
        }
    }
    
    async getCurrentUser(){
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Error getting current user:", error);
            // Don't throw error here as this is used for checking auth status
        }
        return null;
    }
    
    async logout(){
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Error logging out:", error);
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;