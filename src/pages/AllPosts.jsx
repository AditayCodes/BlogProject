import {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { useUserName } from '../hooks/useUserName';
import { useSelector } from 'react-redux';

// Component to display user filter button with real name
function UserFilterButton({ userId, selectedAuthor, onSelect, posts }) {
    const { userName, loading } = useUserName(userId);
    const postCount = posts.filter(post => post.userId === userId).length;

    return (
        <button
            onClick={() => onSelect(userId)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedAuthor === userId
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {loading ? 'Loading...' : userName} ({postCount})
        </button>
    );
}

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedAuthor, setSelectedAuthor] = useState('all')
    const [authors, setAuthors] = useState([])

    // Get authentication state
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    console.log("📚 AllPosts render - Auth Status:", authStatus, "User:", userData?.$id)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError("")
                console.log("📚 AllPosts: Fetching all posts immediately")
                console.log("🔐 Auth status:", authStatus)
                console.log("👤 User data:", userData ? { id: userData.$id, name: userData.name } : null)

                const response = await appwriteService.getPosts([])
                console.log("📄 Posts response:", response)

                if (response && response.documents) {
                    const postsData = response.documents
                    setPosts(postsData)
                    setFilteredPosts(postsData)
                    console.log(`✅ Loaded ${postsData.length} posts`)

                    // Extract unique user IDs for filtering by actual users
                    const uniqueUserIds = [...new Set(
                        postsData
                            .map(post => post.userId)
                            .filter(userId => userId)
                    )];

                    console.log("👥 Found unique user IDs:", uniqueUserIds);
                    setAuthors(uniqueUserIds); // Store user IDs for filtering
                } else {
                    console.log("❌ No posts found in response")
                    setPosts([])
                    setFilteredPosts([])
                    setAuthors([])
                }
            } catch (error) {
                console.error("❌ Error fetching posts:", error)
                setError("Failed to load posts. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [authStatus, userData?.$id]) // Refetch when auth status or user changes

    // Filter posts by selected user ID
    useEffect(() => {
        let filteredResult;
        if (selectedAuthor === 'all') {
            filteredResult = posts;
            setFilteredPosts(posts)
        } else {
            filteredResult = posts.filter(post => post.userId === selectedAuthor)
            setFilteredPosts(filteredResult)
        }
        console.log(`🔍 Filtered posts for user ID "${selectedAuthor}":`, filteredResult.length)
    }, [selectedAuthor, posts])

    const handleAuthorFilter = (author) => {
        setSelectedAuthor(author)
        console.log("👤 Selected author filter:", author)
    }

    if (loading) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-emerald-300 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading posts...</p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="text-red-500 text-xl mb-4">⚠️</div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Posts Yet</h2>
                            <p className="text-gray-600">Be the first to create a post!</p>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className="mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {selectedAuthor === 'all' ? 'All Posts' : 'Filtered Posts'}
                            </h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <p className="text-gray-600">
                                    {filteredPosts.length} of {posts.length} post{posts.length !== 1 ? 's' : ''}
                                    {selectedAuthor !== 'all' && (
                                        <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                            Filtered by User
                                        </span>
                                    )}
                                </p>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                                    🕒 Newest First
                                </span>
                            </div>
                        </div>

                        {selectedAuthor !== 'all' && (
                            <button
                                onClick={() => handleAuthorFilter('all')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                                🔄 Show All Posts
                            </button>
                        )}
                    </div>
                </div>

                {/* User Filter */}
                {authors.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Filter by User:</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleAuthorFilter('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedAuthor === 'all'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                All Users ({posts.length})
                            </button>
                            {authors.map((userId) => (
                                <UserFilterButton
                                    key={userId}
                                    userId={userId}
                                    selectedAuthor={selectedAuthor}
                                    onSelect={handleAuthorFilter}
                                    posts={posts}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {filteredPosts.map((post) => (
                            <div key={post.$id}>
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Posts Found</h3>
                        <p className="text-gray-600">
                            {selectedAuthor === 'all'
                                ? 'No posts available.'
                                : `No posts found by ${selectedAuthor}.`
                            }
                        </p>
                        {selectedAuthor !== 'all' && (
                            <button
                                onClick={() => handleAuthorFilter('all')}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            >
                                Show All Posts
                            </button>
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts