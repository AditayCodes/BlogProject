import appwriteService from '../appwrite/config.js';

export const debugImageAccess = async (fileId) => {
    console.log('🔍 Debugging image access for fileId:', fileId);
    
    if (!fileId) {
        console.log('❌ No fileId provided');
        return;
    }

    try {
        // Test 1: getFilePreview
        console.log('🧪 Testing getFilePreview...');
        const previewUrl = appwriteService.getFilePreview(fileId);
        console.log('📸 Preview URL:', previewUrl);

        // Test 2: getFileView
        console.log('🧪 Testing getFileView...');
        const viewUrl = appwriteService.getFileView(fileId);
        console.log('👁️ View URL:', viewUrl);

        // Test 3: getFileDownload
        console.log('🧪 Testing getFileDownload...');
        const downloadUrl = appwriteService.getFileDownload(fileId);
        console.log('⬇️ Download URL:', downloadUrl);

        // Test 4: Try to fetch the preview URL
        if (previewUrl) {
            console.log('🧪 Testing fetch to preview URL...');
            try {
                const response = await fetch(previewUrl);
                console.log('📡 Fetch response status:', response.status);
                console.log('📡 Fetch response headers:', Object.fromEntries(response.headers.entries()));
                
                if (response.status === 401) {
                    console.log('🚨 401 Unauthorized - Check bucket permissions!');
                    console.log('💡 Bucket needs "Any" read permission for public access');
                }
            } catch (fetchError) {
                console.log('❌ Fetch error:', fetchError);
            }
        }

    } catch (error) {
        console.log('❌ Debug error:', error);
    }
};

export const logBucketInfo = () => {
    console.log('🪣 Bucket Configuration:');
    console.log('Bucket ID:', import.meta.env.VITE_APPWRITE_BUCKET_ID);
    console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID);
    console.log('Appwrite URL:', import.meta.env.VITE_APPWRITE_URL);
    
    console.log('\n📋 Required Bucket Permissions:');
    console.log('- Read: Any (for public image access)');
    console.log('- Create: Users (for authenticated users to upload)');
    console.log('- Update: Users (for authenticated users to update)');
    console.log('- Delete: Users (for authenticated users to delete)');
};
