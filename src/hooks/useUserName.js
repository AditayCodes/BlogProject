import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Cache for user names to avoid repeated API calls
const userNameCache = new Map();

export const useUserName = (userId) => {
    const [userName, setUserName] = useState('Loading...');
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!userId) {
                setUserName('Unknown User');
                setLoading(false);
                return;
            }

            // Check cache first
            if (userNameCache.has(userId)) {
                const cachedName = userNameCache.get(userId);
                setUserName(cachedName);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // If this is the current user, use their data
                if (currentUser && currentUser.$id === userId) {
                    let displayName = currentUser.name;
                    
                    console.log("👤 Processing current user name:", {
                        userId,
                        originalName: currentUser.name,
                        email: currentUser.email,
                        hasName: Boolean(currentUser.name)
                    });
                    
                    // If no name, create one from email
                    if (!displayName && currentUser.email) {
                        const emailPrefix = currentUser.email.split('@')[0];
                        // Clean up email prefix to make it more readable
                        let cleanPrefix = emailPrefix
                            .replace(/[^a-zA-Z0-9]/g, '')
                            .replace(/\d+$/, ''); // Remove trailing numbers

                        if (cleanPrefix.length > 0) {
                            displayName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1).toLowerCase();
                        } else {
                            // If email prefix is all numbers/symbols, use User + ID
                            displayName = `User_${currentUser.$id.slice(-6)}`;
                        }

                        console.log("👤 Generated name from email:", {
                            email: currentUser.email,
                            emailPrefix,
                            cleanPrefix,
                            generatedName: displayName
                        });
                    }

                    // Final fallback with unique ID
                    if (!displayName || displayName.trim() === '') {
                        displayName = `User_${currentUser.$id.slice(-6)}`;
                        console.log("👤 Using final fallback name with ID:", displayName);
                    }
                    
                    userNameCache.set(userId, displayName);
                    setUserName(displayName);
                    console.log("👤 Final current user name:", displayName);
                } else {
                    // For other users, create a more readable name from user ID
                    // Use a more user-friendly format
                    const shortId = userId.slice(-6); // Use 6 characters for better uniqueness
                    const fallbackName = `User_${shortId}`;
                    userNameCache.set(userId, fallbackName);
                    setUserName(fallbackName);
                    console.log("👤 Using fallback name for other user:", userId, "->", fallbackName);
                }
            } catch (error) {
                console.error("Error fetching user name:", error);
                const fallbackName = `User_${userId.slice(-6)}`;
                userNameCache.set(userId, fallbackName);
                setUserName(fallbackName);
            } finally {
                setLoading(false);
            }
        };

        fetchUserName();
    }, [userId, currentUser]);

    return { userName, loading };
};

// Helper function to get user name synchronously if cached
export const getCachedUserName = (userId) => {
    if (userNameCache.has(userId)) {
        return userNameCache.get(userId);
    }
    // Use the same format as the hook for consistency
    return `User_${userId.slice(-6)}`;
};

// Function to clear the cache (useful for testing or when user data changes)
export const clearUserNameCache = () => {
    userNameCache.clear();
};
