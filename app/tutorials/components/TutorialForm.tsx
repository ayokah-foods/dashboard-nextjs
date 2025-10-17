'use client';

import { useEffect, useState } from 'react';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { Tutorial } from '@/types/TutorialType';
import { createTutorial, updateTutorial } from '@/app/api_/tutorial';
import Image from 'next/image';

interface Props {
    onClose: () => void;
    tutorial?: Tutorial;
}

export default function TutorialForm({ onClose, tutorial }: Props) {
    const [title, setTitle] = useState(tutorial?.title || '');
    const [description, setDescription] = useState(tutorial?.description || '');
    const [type, setType] = useState<{ label: string; value: string } | null>(
        tutorial?.type ? { label: tutorial.type, value: tutorial.type } : null
    );
    const [videoPreview, setVideoPreview] = useState(tutorial?.video_url || '');
    const [imagePreview, setImagePreview] = useState<string | null>(
        tutorial?.image_url || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);

    // ✅ Initialize previews when editing
    useEffect(() => {
        if (tutorial?.video_url) setVideoPreview(tutorial.video_url);
        if (tutorial?.image_url) setImagePreview(tutorial.image_url);
    }, [tutorial]);

    const typeOptions = [
        { label: 'Vendor', value: 'vendor' },
        { label: 'Customer', value: 'customer' },
        { label: 'System', value: 'system' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🔹 Validations
        if (!title.trim()) return toast.error('Title is required');
        if (!description.trim()) return toast.error('Description is required');
        if (!type?.value) return toast.error('Type is required');
        if (!videoPreview.trim() && !imagePreview?.trim()) {
            return toast.error('Either video URL or image is required');
        }

        console.log(imagePreview);
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type.value);
        formData.append('video_url', videoPreview);
        formData.append('image', imageFile || '');

        try {
            if (tutorial?.id) {
                await updateTutorial(Number(tutorial.id), formData);
                toast.success('Tutorial updated successfully');
            } else {
                await createTutorial(formData);
                toast.success('Tutorial added successfully');
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${tutorial?.id ? 'update' : 'add'} tutorial`);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoChange = (url: string) => {
        setVideoPreview(url);
        if (
            url &&
            !url.endsWith('.mp4') &&
            !url.endsWith('.webm') &&
            !url.endsWith('.ogg')
        ) {
            toast.error('Preview not available. This URL may not be a direct video file');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                </label>
                <input
                    type="url"
                    value={videoPreview}
                    onChange={(e) => handleVideoChange(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {videoPreview && (
                    <div className="mt-4">
                        <video
                            src={videoPreview}
                            controls
                            className="w-full aspect-[16/9] rounded-lg object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                </label>
                <label
                    htmlFor="imageFile"
                    className="relative w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors overflow-hidden flex items-center justify-center"
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
                        <div className="flex flex-col items-center text-orange-600">
                            <svg className="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-sm">Click to upload or drag and drop image</span>
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

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={typeOptions}
                    value={type || { label: 'Select type', value: '' }}
                    onChange={(opt) => setType(opt)}
                    className="w-full"
                />
            </div>

            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
