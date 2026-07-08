"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { Tutorial } from "@/types/TutorialType";
import { createTutorial, updateTutorial } from "@/lib/api/tutorial";
import Image from "next/image";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface Props {
    onClose: () => void;
    tutorial?: Tutorial;
}

export default function TutorialForm({ onClose, tutorial }: Props) {
    const [title, setTitle] = useState(tutorial?.title || "");
    const [description, setDescription] = useState(tutorial?.description || "");
    const [videoPreview, setVideoPreview] = useState(tutorial?.video_url || "");
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [vimeoThumbnail, setVimeoThumbnail] = useState<string | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(
        tutorial?.image_url || null,
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Load thumbnails for Vimeo URLs
    useEffect(() => {
        if (videoPreview.includes("vimeo.com")) {
            const match = videoPreview.match(/vimeo\.com\/(\d+)/);
            const videoId = match ? match[1] : null;
            if (videoId) {
                fetch(`https://vimeo.com/api/v2/video/${videoId}.json`)
                    .then((res) => res.json())
                    .then((data) => setVimeoThumbnail(data[0]?.thumbnail_large))
                    .catch(() => setVimeoThumbnail(null));
            }
        } else {
            setVimeoThumbnail(null);
        }
    }, [videoPreview]);

    // ✅ Initialize previews when editing
    useEffect(() => {
        if (tutorial?.video_url) setVideoPreview(tutorial.video_url);
        if (tutorial?.image_url) setImagePreview(tutorial.image_url);
    }, [tutorial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return toast.error("Title is required");
        if (!description.trim()) return toast.error("Description is required");
        // if (!type?.value) return toast.error("Type is required");
        if (!videoPreview.trim() && !imagePreview?.trim()) {
            return toast.error("Either video URL or image is required");
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", "system");
        formData.append("video_url", videoPreview);
        formData.append("image", imageFile || "");

        try {
            if (tutorial?.id) {
                await updateTutorial(Number(tutorial.id), formData);
                toast.success("Tutorial updated successfully");
            } else {
                await createTutorial(formData);
                toast.success("Tutorial added successfully");
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${tutorial?.id ? "update" : "add"} tutorial`,
            );
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // ✅ VIDEO PREVIEW RENDERING
    const renderVideoPreview = () => {
        if (!videoPreview) return null;

        // YOUTUBE
        if (
            videoPreview.includes("youtube.com") ||
            videoPreview.includes("youtu.be")
        ) {
            const match =
                videoPreview.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/) ||
                videoPreview.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
            const videoId = match ? match[1] : null;
            if (!videoId)
                return (
                    <p className="text-sm text-red-500">Invalid YouTube URL</p>
                );

            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
                <div className="mt-4 relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                    {isVideoPlaying ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                            title="YouTube video"
                            className="absolute inset-0 w-full h-full rounded-lg"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div
                            className="absolute inset-0 cursor-pointer group"
                            onClick={() => setIsVideoPlaying(true)}
                        >
                            <Image
                                src={thumbnailUrl}
                                alt="YouTube Thumbnail"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                    stroke="none"
                                    className="w-16 h-16 group-hover:scale-110 transition-transform"
                                >
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // VIMEO
        if (videoPreview.includes("vimeo.com")) {
            const match = videoPreview.match(/vimeo\.com\/(\d+)/);
            const videoId = match ? match[1] : null;
            if (!videoId)
                return (
                    <p className="text-sm text-red-500">Invalid Vimeo URL</p>
                );

            return (
                <div className="mt-4 relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                    {isVideoPlaying ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
                            title="Vimeo video"
                            className="absolute inset-0 w-full h-full rounded-lg"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div
                            className="absolute inset-0 cursor-pointer group"
                            onClick={() => setIsVideoPlaying(true)}
                        >
                            {vimeoThumbnail ? (
                                <Image
                                    src={vimeoThumbnail}
                                    alt="Vimeo Thumbnail"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Loading thumbnail...
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="white"
                                    viewBox="0 0 24 24"
                                    stroke="none"
                                    className="w-16 h-16 group-hover:scale-110 transition-transform"
                                >
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // DIRECT VIDEO FILE
        if (/\.(mp4|webm|ogg)$/i.test(videoPreview)) {
            return (
                <video
                    src={videoPreview}
                    controls
                    className="w-full aspect-video rounded-lg object-cover"
                />
            );
        }

        return (
            <p className="text-sm text-gray-500 italic">
                Preview not available for this URL type.
            </p>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hub-primary/200"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <TinyMCEEditor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    value={description}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: "link lists code",
                        toolbar:
                            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code",
                        content_style:
                            "body { font-family:Inter,Arial,sans-serif; font-size:14px; color:#374151 }",
                    }}
                    onEditorChange={(content) => setDescription(content)}
                />
            </div>

            {/* Video Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                </label>
                <input
                    type="url"
                    value={videoPreview}
                    onChange={(e) => {
                        setVideoPreview(e.target.value);
                        setIsVideoPlaying(false);
                    }}
                    placeholder="Paste YouTube, Vimeo, or direct video URL"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-hub-primary/200 focus:border-hub-primary"
                />
                {renderVideoPreview()}
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                </label>
                <label
                    htmlFor="imageFile"
                    className="relative w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-hub-primary hover:bg-hub-primary/20 transition overflow-hidden flex items-center justify-center"
                >
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-green-600">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span className="mt-2 text-sm">
                                Click to upload or drag and drop image
                            </span>
                        </div>
                    )}
                    <input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>

            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
