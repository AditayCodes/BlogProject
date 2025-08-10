import { AppwriteImage } from "./index"
import {Link} from "react-router-dom"
import { useSelector } from 'react-redux'
import { useUserName } from '../hooks/useUserName'
import { verifyPostOwnership } from '../utils/userConsistency'

// Helper function to extract text from HTML content
const extractTextFromHTML = (html) => {
    if (!html) return "";
    // Remove HTML tags and decode entities
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return text;
};

// Helper function to create content preview
const createContentPreview = (content, maxLength = 120) => {
    if (!content) return "No description available...";

    const text = extractTextFromHTML(content);
    if (text.length <= maxLength) return text;

    // Find the last complete word within the limit
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
};

function PostCard({$id, title, featuredImage, content, status, $createdAt, userId}) {
    const contentPreview = createContentPreview(content);

    // Get current user to check if this is their post
    const userData = useSelector((state) => state.auth.userData);

    // Get the author name using the hook - this ensures unique identification
    const { userName: displayAuthorName, loading: authorLoading } = useUserName(userId);

    // Verify post ownership using utility function
    const ownershipVerification = verifyPostOwnership({ userId }, userData);
    const isOwnPost = ownershipVerification.isOwner;

    // Additional consistency check
    console.log("🔍 PostCard consistency check:", {
        postUserId: userId,
        currentUserId: userData?.$id,
        isOwnPost,
        displayAuthorName,
        authorLoading,
        ownershipVerification
    });

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col group'>
                <div className='w-full mb-4 flex-shrink-0 overflow-hidden rounded-xl'>
                    <AppwriteImage
                        fileId={featuredImage}
                        alt={title}
                        className='rounded-xl w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        fallbackClassName='rounded-xl w-full h-48 bg-gray-200 flex items-center justify-center'
                        fallbackText='No Image Available'
                    />
                </div>

                <div className="flex-grow flex flex-col">
                    <h2 className='text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300'>
                        {title}
                    </h2>

                    {/* Author Info - More Prominent */}
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-sm">
                                    {authorLoading ? 'L' : (displayAuthorName || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">
                                    {authorLoading ? 'Loading...' : (displayAuthorName || `User_${userId?.slice(-6)}`)}
                                </span>
                                {$createdAt && (
                                    <span className="text-xs text-gray-500">
                                        {new Date($createdAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        {isOwnPost && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium ml-auto">
                                Your Post
                            </span>
                        )}
                    </div>

                    <p className='text-gray-600 text-sm leading-relaxed flex-grow line-clamp-3 mb-3'>
                        {contentPreview}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors duration-300">
                            Read more →
                        </span>
                        {status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {status}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard