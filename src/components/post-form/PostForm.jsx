import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select, AppwriteImage } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const submit = async (data) => {
        setError("");
        setLoading(true);

        console.log("📝 Form submission data:", data);
        console.log("📝 Content length:", data.content ? data.content.length : 0);
        console.log("📝 Content preview:", data.content ? data.content.substring(0, 100) + "..." : "No content");

        try {
            if (post) {
                // Updating existing post
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    // Delete old image if new one is uploaded
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage, // Keep existing image if no new one
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    setError("Failed to update post. Please try again.");
                }
            } else {
                // Creating new post
                if (!data.image || !data.image[0]) {
                    setError("Please select an image for the post.");
                    return;
                }

                // Validate content
                if (!data.content || data.content.trim() === "" || data.content === "<p></p>") {
                    setError("Please add some content to your post.");
                    return;
                }

                // Validate file before upload
                const selectedFile = data.image[0];
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (!allowedTypes.includes(selectedFile.type)) {
                    setError("Please select a valid image file (JPEG, PNG, or GIF).");
                    return;
                }

                if (selectedFile.size > maxSize) {
                    setError("Image file size must be less than 5MB.");
                    return;
                }

                const file = await appwriteService.uploadFile(selectedFile);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    } else {
                        setError("Failed to create post. Please try again.");
                        // Clean up uploaded file if post creation fails
                        await appwriteService.deleteFile(fileId);
                    }
                } else {
                    setError("Failed to upload image. Please check the file and try again.");
                }
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            setError(error.message || "An error occurred while submitting the post.");
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <AppwriteImage
                            fileId={post.featuredImage}
                            alt={post.title}
                            className="rounded-lg w-full h-auto max-h-48 object-cover"
                            fallbackClassName="rounded-lg w-full h-48 bg-gray-200 flex items-center justify-center"
                            fallbackText="Current Image Unavailable"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Processing..." : (post ? "Update" : "Submit")}
                </Button>
            </div>
        </form>
        </div>
    );
}