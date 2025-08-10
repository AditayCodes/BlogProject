import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{ 
    client = new Client();
    databases;
    bucket;

    constructor() {
        console.log("🔧 Initializing Appwrite Service...");
        console.log("🌐 Appwrite URL:", conf.appwriteUrl);
        console.log("📋 Project ID:", conf.appwriteProjectId);
        console.log("🗄️ Database ID:", conf.appwriteDatabaseId);
        console.log("📁 Collection ID:", conf.appwriteCollectionId);
        console.log("🪣 Bucket ID:", conf.appwriteBucketId);
        console.log("🌍 Current domain:", window.location.hostname);

        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);

        console.log("✅ Appwrite Service initialized");
    }

    // post methods - Create a new post with user ID only
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            console.log("📝 Creating post with user ID:", {
                title,
                slug,
                contentLength: content ? content.length : 0,
                contentPreview: content ? content.substring(0, 100) + "..." : "No content",
                featuredImage,
                status,
                userId: userId,
                timestamp: new Date().toISOString()
            });

            // Validate required fields
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

            // Create post document with only standard fields
            const postData = {
                title,
                content,
                featuredImage,
                status,
                userId, // Only store user ID, we'll fetch name when needed
            };

            console.log("💾 Saving post to database with data:", postData);

            const result = await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                postData
            );

            console.log("✅ Post created successfully by user:", {
                postId: result.$id,
                userId: result.userId,
                createdAt: result.$createdAt
            });

            return result;
        } catch (error) {
            console.log("❌ Error creating post:", error);
            throw error; // Re-throw to handle in the calling function
        }
    }

    // update post method - Only allows original author to update their post
    async updatePost(slug, { title, content, featuredImage, status, currentUserId }) {
        try {
            if (!slug) {
                console.log("❌ No slug provided for post update");
                return false;
            }

            // First, get the existing post to verify ownership
            const existingPost = await this.getPost(slug);
            if (!existingPost) {
                console.log("❌ Post not found for update");
                return false;
            }

            // Verify that the current user is the original author
            if (existingPost.userId !== currentUserId) {
                console.log("❌ Access denied: User is not the author of this post");
                console.log("Post author:", existingPost.userId, "Current user:", currentUserId);
                throw new Error("Access denied: You can only edit your own posts");
            }

            console.log("📝 Updating post by authorized author:", {
                postId: slug,
                title,
                content: content ? content.substring(0, 100) + "..." : "No content",
                featuredImage,
                status,
                userId: currentUserId
            });

            const updateData = {
                title,
                content,
                featuredImage,
                status,
                // Don't include authorName or other custom fields that don't exist in schema
            };

            const result = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                updateData
            );

            console.log("✅ Post updated successfully by author:", {
                postId: result.$id,
                userId: result.userId,
                updatedAt: result.$updatedAt
            });

            return result;

        } catch (error) {
            console.log("❌ Error updating post:", error);
            throw error; // Re-throw to handle in the calling function
        }
    }

    // delete post method - Only allows original author to delete their post
    async deletePost(slug, currentUserId) {
        try {
            if (!slug || !currentUserId) {
                console.log("❌ Missing slug or user ID for post deletion");
                return false;
            }

            // First, get the existing post to verify ownership
            const existingPost = await this.getPost(slug);
            if (!existingPost) {
                console.log("❌ Post not found for deletion");
                return false;
            }

            // Verify that the current user is the original author
            if (existingPost.userId !== currentUserId) {
                console.log("❌ Access denied: User is not the author of this post");
                console.log("Post author:", existingPost.userId, "Current user:", currentUserId);
                throw new Error("Access denied: You can only delete your own posts");
            }

            console.log("🗑️ Deleting post by authorized author:", {
                postId: slug,
                title: existingPost.title,
                userId: currentUserId,
                deletedAt: new Date().toISOString()
            });

            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

            console.log("✅ Post deleted successfully by author:", {
                postId: slug,
                userId: existingPost.userId,
                deletedBy: currentUserId
            });

            return true;
        } catch (error) {
            console.log("❌ Error deleting post:", error);
            return false;
        }
    }
    
    // get post method
    async getPost(slug) {
        try {
            if (!slug) {
                console.log("❌ No slug provided for getPost");
                return false;
            }

            console.log("📖 Fetching post with slug:", slug);

            const result = await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

            console.log("✅ Post retrieved successfully:", {
                id: result.$id,
                title: result.title,
                userId: result.userId,
                status: result.status,
                createdAt: result.$createdAt
            });

            return result;
        } catch (error) {
            console.error("❌ Error getting post:", error);
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                type: error.type,
                slug: slug
            });
            return false;
        }
    }

    // get all posts method - ordered by creation date (newest first)
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            // Add ordering by creation date (newest first) to the queries
            const orderedQueries = [
                ...queries,
                Query.orderDesc("$createdAt") // Order by creation date, newest first
            ];

            console.log("📚 Fetching posts with queries:", orderedQueries);

            const result = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                orderedQueries
            );

            console.log(`📚 Retrieved ${result.documents?.length || 0} posts ordered by date`);
            return result;
        } catch (error) {
            console.log("❌ Error getting posts:", error);
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

    // Get user information by ID (for displaying author names)
    async getUser(userId) {
        try {
            console.log("👤 Fetching user info for ID:", userId);
            // Note: Appwrite doesn't allow getting other users' info easily for security
            // We'll store author name in the post or use a fallback
            return { name: 'Author', $id: userId };
        } catch (error) {
            console.log("❌ Error fetching user:", error);
            return { name: 'Unknown Author', $id: userId };
        }
    }

}

const service = new Service();
export default service