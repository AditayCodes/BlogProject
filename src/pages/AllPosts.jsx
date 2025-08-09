import {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError("")
                console.log("🔄 Fetching all posts...")

                const response = await appwriteService.getPosts([])
                console.log("📄 Posts response:", response)

                if (response && response.documents) {
                    setPosts(response.documents)
                    console.log(`✅ Loaded ${response.documents.length} posts`)
                } else {
                    console.log("❌ No posts found in response")
                    setPosts([])
                }
            } catch (error) {
                console.error("❌ Error fetching posts:", error)
                setError("Failed to load posts. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h1>
                    <p className="text-gray-600">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts