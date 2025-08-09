# Appwrite Setup Guide for BlogProject

## 🚨 Fixing 401 Image Loading Errors

The 401 error when loading images is caused by incorrect bucket permissions in Appwrite. Follow these steps to fix it:

### 1. Access Appwrite Console
1. Go to your Appwrite console: https://cloud.appwrite.io/
2. Select your project
3. Navigate to **Storage** in the left sidebar

### 2. Configure Bucket Permissions
1. Click on your bucket (the one specified in `VITE_APPWRITE_BUCKET_ID`)
2. Go to the **Settings** tab
3. Scroll down to **Permissions**

### 3. Set Correct Permissions

#### For Public Image Access (Recommended):
- **Read**: Add `any` (allows anyone to view images)
- **Create**: Add `users` (allows authenticated users to upload)
- **Update**: Add `users` (allows authenticated users to update)
- **Delete**: Add `users` (allows authenticated users to delete)

#### Permission Syntax:
```
Read: any
Create: users
Update: users  
Delete: users
```

### 4. Alternative: User-Only Access
If you want only authenticated users to see images:
```
Read: users
Create: users
Update: users
Delete: users
```

### 5. Verify Setup
1. Save the permissions
2. Refresh your BlogProject application
3. Try uploading and viewing images
4. Check browser console for debug information

## 🔧 Debugging Tools

The project now includes debugging tools. Open browser console to see:
- Image URL generation attempts
- Fetch response status
- Permission-related errors

## 🛠️ Manual Testing

### Test Image Upload:
1. Login to your blog
2. Go to "Add Post"
3. Fill in title and content
4. Select an image file (JPEG, PNG, or GIF under 5MB)
5. Submit the post
6. Check if image displays correctly

### Test Image Display:
1. Go to "All Posts" or Home page
2. Check if post thumbnails load
3. Click on a post to view full image
4. Verify no 401 errors in console

## 📋 Troubleshooting Checklist

- [ ] Bucket permissions include `any` for Read access
- [ ] Environment variables are correctly set
- [ ] Appwrite project ID matches your actual project
- [ ] Bucket ID matches your actual bucket
- [ ] Images are valid formats (JPEG, PNG, GIF)
- [ ] Images are under 5MB
- [ ] No CORS issues in browser console

## 🔍 Common Issues

### Issue: 401 Unauthorized
**Solution**: Add `any` permission for Read access in bucket settings

### Issue: 404 Not Found  
**Solution**: Verify bucket ID and project ID in environment variables

### Issue: CORS Error
**Solution**: Check Appwrite project settings for allowed origins

### Issue: File Too Large
**Solution**: Ensure images are under 5MB

## 📞 Support

If issues persist:
1. Check Appwrite documentation: https://appwrite.io/docs
2. Verify all environment variables
3. Test with a fresh image upload
4. Check browser network tab for detailed error responses
