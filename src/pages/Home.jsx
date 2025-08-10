import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                console.log("🏠 Fetching posts for Home page, auth status:", authStatus)

                // Try to load cached posts first for better UX
                try {
                    const cached = localStorage.getItem('cachedPosts')
                    if (cached) {
                        const { posts: cachedPosts, timestamp, userId } = JSON.parse(cached)
                        // Use cache if it's less than 5 minutes old and for the same user
                        if (Date.now() - timestamp < 300000 && userId === userData?.$id) {
                            console.log("📦 Using cached posts")
                            setPosts(cachedPosts)
                            setLoading(false)
                            return
                        }
                    }
                } catch (error) {
                    console.log("⚠️ Failed to load cached posts:", error)
                }

                const postsData = await appwriteService.getPosts()
                if (postsData) {
                    console.log("✅ Posts fetched successfully:", postsData.documents.length)
                    setPosts(postsData.documents)

                    // Cache posts in localStorage for better UX
                    try {
                        localStorage.setItem('cachedPosts', JSON.stringify({
                            posts: postsData.documents,
                            timestamp: Date.now(),
                            userId: userData?.$id
                        }))
                    } catch (error) {
                        console.log("⚠️ Failed to cache posts:", error)
                    }
                } else {
                    console.log("❌ No posts data received")
                    setPosts([])
                }
            } catch (error) {
                console.error("❌ Error fetching posts:", error)
                setPosts([])
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [authStatus]) // Refetch when auth status changes
  
    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold text-gray-600">
                                Loading posts...
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                {authStatus ? "No posts available" : "Login to read posts"}
                            </h1>
                            {authStatus && (
                                <p className="text-gray-600 mt-2">
                                    Be the first to create a post!
                                </p>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {posts.map((post) => (
                        <div key={post.$id} className='w-full'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home