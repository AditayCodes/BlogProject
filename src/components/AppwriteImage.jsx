import { useState, useEffect } from 'react';
import appwriteService from '../appwrite/config';

function AppwriteImage({
    fileId,
    alt = "Image",
    className = "",
    fallbackClassName = "",
    fallbackText = "No Image Available",
    ...props
}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!fileId) {
            setLoading(false);
            setImageError(true);
            return;
        }

        console.log(`🖼️ Loading image for fileId: ${fileId}`);

        // CORS-free image loading - NO FETCH, direct image testing
        const tryImageMethods = () => {
            const methods = [
                { name: 'preview', fn: () => appwriteService.getFilePreview(fileId, 400, 300, 85) },
                { name: 'view', fn: () => appwriteService.getFileView(fileId) },
                { name: 'direct', fn: () => appwriteService.getDirectImageUrl(fileId) }
            ];

            const tryNextMethod = (methodIndex) => {
                if (methodIndex >= methods.length) {
                    console.log(`❌ All image loading methods failed for ${fileId}`);
                    setImageError(true);
                    setLoading(false);
                    return;
                }

                const method = methods[methodIndex];

                try {
                    const url = method.fn();
                    if (!url) {
                        console.log(`❌ No ${method.name} URL generated for ${fileId}`);
                        tryNextMethod(methodIndex + 1);
                        return;
                    }

                    console.log(`🔗 Trying ${method.name} URL: ${url}`);

                    // Create image element and test loading directly (NO CORS)
                    const img = new Image();

                    // Timeout to prevent hanging
                    const timeout = setTimeout(() => {
                        console.log(`⏰ ${method.name} timeout, trying next method...`);
                        tryNextMethod(methodIndex + 1);
                    }, 5000);

                    img.onload = () => {
                        clearTimeout(timeout);
                        console.log(`✅ ${method.name} image loaded successfully: ${fileId}`);
                        setImageUrl(url);
                        setLoading(false);
                        setImageError(false);
                    };

                    img.onerror = (error) => {
                        clearTimeout(timeout);
                        console.log(`❌ ${method.name} image load failed: ${fileId}`, error);
                        tryNextMethod(methodIndex + 1);
                    };

                    // Start loading the image
                    img.src = url;

                } catch (methodError) {
                    console.log(`❌ ${method.name} method failed: ${methodError.message}`);
                    tryNextMethod(methodIndex + 1);
                }
            };

            // Start with the first method
            tryNextMethod(0);
        };

        tryImageMethods();
    }, [fileId]);

    const handleImageError = () => {
        setImageError(true);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
                <span className="text-gray-500 text-sm">Loading...</span>
            </div>
        );
    }

    if (imageError || !imageUrl) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${fallbackClassName || className}`}>
                <span className="text-gray-500 text-sm">{fallbackText}</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={handleImageError}
            {...props}
        />
    );
}

export default AppwriteImage;
