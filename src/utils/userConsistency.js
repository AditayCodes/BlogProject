// Utility functions to ensure user consistency across the application

/**
 * Verify that the user ID in a post matches the current user
 * @param {Object} post - The post object
 * @param {Object} currentUser - The current user object
 * @returns {Object} Verification result
 */
export const verifyPostOwnership = (post, currentUser) => {
    const result = {
        isOwner: false,
        postUserId: post?.userId,
        currentUserId: currentUser?.$id,
        match: false,
        error: null
    };

    if (!post) {
        result.error = "No post provided";
        return result;
    }

    if (!currentUser) {
        result.error = "No current user provided";
        return result;
    }

    result.match = post.userId === currentUser.$id;
    result.isOwner = result.match;

    console.log("🔍 Post ownership verification:", result);
    return result;
};

/**
 * Get consistent user display name
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getConsistentUserName = (user) => {
    if (!user) {
        console.log("⚠️ No user provided for name generation");
        return 'Unknown User';
    }

    let displayName = user.name;

    // If no name, create one from email
    if (!displayName && user.email) {
        const emailPrefix = user.email.split('@')[0];
        // Clean up email prefix to make it more readable
        displayName = emailPrefix
            .replace(/[^a-zA-Z0-9]/g, '')
            .replace(/\d+$/, '') // Remove trailing numbers
            .charAt(0).toUpperCase() + emailPrefix.slice(1).toLowerCase();
    }

    // Final fallback
    if (!displayName || displayName.trim() === '') {
        displayName = `User_${user.$id?.slice(-6) || 'Unknown'}`;
    }

    console.log("👤 Generated consistent name:", {
        userId: user.$id,
        originalName: user.name,
        email: user.email,
        finalName: displayName
    });

    return displayName;
};

/**
 * Verify user consistency between post creation and display
 * @param {string} postUserId - User ID from the post
 * @param {Object} currentUser - Current user object
 * @returns {Object} Consistency check result
 */
export const verifyUserConsistency = (postUserId, currentUser) => {
    const result = {
        consistent: false,
        postUserId,
        currentUserId: currentUser?.$id,
        currentUserName: currentUser ? getConsistentUserName(currentUser) : 'No User',
        shouldShowAsOwn: false,
        error: null
    };

    if (!postUserId) {
        result.error = "No post user ID provided";
        return result;
    }

    if (!currentUser) {
        result.error = "No current user provided";
        return result;
    }

    result.consistent = postUserId === currentUser.$id;
    result.shouldShowAsOwn = result.consistent;

    console.log("🔍 User consistency check:", result);
    return result;
};

/**
 * Log user data for debugging
 * @param {Object} user - User object to log
 * @param {string} context - Context description
 */
export const logUserData = (user, context = 'User data') => {
    console.log(`👤 ${context}:`, {
        id: user?.$id,
        name: user?.name,
        email: user?.email,
        hasName: Boolean(user?.name),
        hasEmail: Boolean(user?.email),
        timestamp: new Date().toISOString()
    });
};
