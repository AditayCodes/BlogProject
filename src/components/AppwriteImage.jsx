import React, { useState, useEffect } from 'react';
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

        // Try different methods to get the image URL
        const tryImageMethods = async () => {
            try {
                // Method 1: Try getFilePreview
                let url = appwriteService.getFilePreview(fileId);
                if (url) {
                    setImageUrl(url);
                    setLoading(false);
                    return;
                }

                // Method 2: Try getFileView
                url = appwriteService.getFileView(fileId);
                if (url) {
                    setImageUrl(url);
                    setLoading(false);
                    return;
                }

                // Method 3: Try getFileDownload
                url = appwriteService.getFileDownload(fileId);
                if (url) {
                    setImageUrl(url);
                    setLoading(false);
                    return;
                }

                // If all methods fail
                setImageError(true);
                setLoading(false);
            } catch (error) {
                console.error("Error loading image:", error);
                setImageError(true);
                setLoading(false);
            }
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
