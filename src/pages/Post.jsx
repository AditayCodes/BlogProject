import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config.js";
import { Button, Container, AppwriteImage, ConfirmModal } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { useToast } from "../hooks/useToast";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    // Debug author check (keep for troubleshooting)
    console.log("🔐 Is author:", isAuthor, "| User:", userData?.$id, "| Post author:", post?.userId);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) {
                navigate("/");
                return;
            }

            try {
                setLoading(true);
                console.log("🔄 Fetching post:", slug);

                const post = await appwriteService.getPost(slug);

                if (post) {
                    console.log("📖 Retrieved post:", post);
                    console.log("📝 Post content length:", post.content ? post.content.length : 0);
                    console.log("📝 Post content preview:", post.content ? post.content.substring(0, 100) + "..." : "No content");
                    console.log("👤 Post author ID:", post.userId);
                    setPost(post);
                } else {
                    console.log("❌ Post not found");
                    showToast("Post not found", "error");
                    navigate("/");
                }
            } catch (error) {
                console.error("❌ Error fetching post:", error);
                showToast("Failed to load post", "error");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate, showToast]);

    const handleDeleteClick = () => {
        console.log("🗑️ Delete button clicked");
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        console.log("✅ Delete confirmed by user");
        try {
            setDeleting(true);
            setShowDeleteModal(false);

            console.log("🗑️ Starting deletion process for post:", post.$id);

            // Delete the post from database
            const deleteStatus = await appwriteService.deletePost(post.$id);
            console.log("🗑️ Delete status from database:", deleteStatus);

            if (deleteStatus) {
                console.log("✅ Post deleted from database successfully");

                // Delete the associated image
                if (post.featuredImage) {
                    try {
                        console.log("🖼️ Deleting associated image:", post.featuredImage);
                        await appwriteService.deleteFile(post.featuredImage);
                        console.log("✅ Image deleted successfully");
                    } catch (imageError) {
                        console.log("⚠️ Failed to delete image:", imageError);
                        // Don't fail the whole operation if image deletion fails
                    }
                }

                console.log("🎉 Showing success toast and redirecting");
                showToast("Post deleted successfully!", "success");
                navigate("/");
            } else {
                throw new Error("Failed to delete post from database");
            }
        } catch (error) {
            console.error("❌ Error during deletion process:", error);
            showToast("Failed to delete post. Please try again.", "error");
        } finally {
            setDeleting(false);
            console.log("🗑️ Deletion process completed");
        }
    };

    const handleDeleteCancel = () => {
        console.log("❌ Delete cancelled by user");
        setShowDeleteModal(false);
    };

    // Loading state
    if (loading) {
        return (
            <div className="py-8">
                <Container>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-emerald-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading post...</p>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    // Post not found
    if (!post) {
        return (
            <div className="py-8">
                <Container>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Post Not Found</h2>
                            <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
                            <Link to="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-4 sm:py-8">
            <Container>
                {/* Image and Action Buttons */}
                <div className="w-full flex justify-center mb-6 relative border rounded-xl p-2 bg-white shadow-sm">
                    <AppwriteImage
                        fileId={post.featuredImage}
                        alt={post.title}
                        className="rounded-xl w-full h-auto max-h-96 object-cover"
                        fallbackClassName="rounded-xl w-full h-64 bg-gray-200 flex items-center justify-center"
                        fallbackText="No Image Available"
                    />

                    {isAuthor && (
                        <div className="absolute right-2 sm:right-6 top-2 sm:top-6 flex flex-col sm:flex-row gap-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button
                                    bgColor="bg-emerald-500 hover:bg-emerald-600"
                                    className="text-xs sm:text-sm px-3 sm:px-4 py-2 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                bgColor="bg-red-500 hover:bg-red-600"
                                onClick={handleDeleteClick}
                                disabled={deleting}
                                className="text-xs sm:text-sm px-3 sm:px-4 py-2 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>



                {/* Post Title */}
                <div className="w-full mb-6">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {post.title}
                    </h1>

                    {/* Post Meta */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>By {userData?.name || 'Author'}</span>
                        <span>•</span>
                        <span>{new Date(post.$createdAt).toLocaleDateString()}</span>
                        {post.status && (
                            <>
                                <span>•</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    post.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {post.status}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Post Content */}
                <div className="browser-css prose prose-lg max-w-none">
                    {post.content ? (
                        parse(post.content)
                    ) : (
                        <div className="text-gray-500 italic p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-center">No content available for this post.</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <Link
                        to="/all-posts"
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to All Posts
                    </Link>
                </div>
            </Container>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteCancel}
                title="Delete Post"
                message={`Are you sure you want to delete "${post.title}"?\n\nThis action cannot be undone and will permanently remove the post and its associated image.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                isLoading={deleting}
            />
        </div>
    );
}