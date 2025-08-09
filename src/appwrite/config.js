import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{ 
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    // post methods
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("📝 Creating post with data:", {
                title,
                slug,
                contentLength: content ? content.length : 0,
                contentPreview: content ? content.substring(0, 100) + "..." : "No content",
                featuredImage,
                status,
                userId
            });

            if (!title || !slug || !content || !featuredImage || !userId) {
                console.log("❌ Missing required fields for post creation");
                console.log("Missing fields:", {
                    title: !title,
                    slug: !slug,
                    content: !content,
                    featuredImage: !featuredImage,
                    userId: !userId
                });
                return false;
            }

            const result = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            );

            console.log("✅ Post created successfully:", result);
            return result;
        } catch (error) {
            console.log("Error creating post:", error);
            throw error; // Re-throw to handle in the calling function
        }
    }

    // update post method
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            if (!slug) {
                console.log("No slug provided for post update");
                return false;
            }

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )

        } catch (error) {
            console.log("Error updating post:", error);
            throw error; // Re-throw to handle in the calling function
        }
    }

    // delete post method
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Error deleting post:", error);
            return false
        }
    }
    
    // get post method
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Error getting posts:", error);
            return false
        }
    } 

    // get all posts method
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Error getting posts:", error);
            return false
        }
    }

    // file upload

    async uploadFile(file) {
        try {
            if (!file) {
                console.log("No file provided for upload");
                return false;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                console.log("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
                return false;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                console.log("File size too large. Maximum size is 5MB.");
                return false;
            }

            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Error uploading file:", error);
            return false
        }
    }


    async deleteFile(fileId) {
        try {
            if (!fileId) {
                console.log("No file ID provided for deletion");
                return false;
            }
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
        } catch (error) {
            console.log("Error deleting file:", error);
            return false
        }
    }

    getFilePreview(fileId, width = 400, height = 300, quality = 85) {
        try {
            if (!fileId) {
                console.log("No file ID provided for preview");
                return null;
            }

            const url = this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId,
                width,
                height,
                'center', // gravity
                quality,
                0, // border width
                '', // border color
                0, // border radius
                1, // opacity
                0, // rotation
                '', // background
                'jpg' // output format
            );

            console.log(`📸 Generated preview URL: ${url}`);
            return url;
        } catch (error) {
            console.log("❌ Error getting file preview:", error);
            return null;
        }
    }

    // Alternative method to get file view (direct file access)
    getFileView(fileId) {
        try {
            if (!fileId) {
                console.log("No file ID provided for view");
                return null;
            }

            const url = this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            );

            console.log(`👁️ Generated view URL: ${url}`);
            return url;
        } catch (error) {
            console.log("❌ Error getting file view:", error);
            return null;
        }
    }

    // Method to get file download URL
    getFileDownload(fileId) {
        try {
            if (!fileId) {
                console.log("No file ID provided for download");
                return null;
            }
            return this.bucket.getFileDownload(
                conf.appwriteBucketId,
                fileId
            )
        } catch (error) {
            console.log("Error getting file download:", error);
            return null;
        }
    }

}

const service = new Service();
export default service