'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { addBanner, listBannerTypes } from '@/app/api_/banners';
import { BannerType } from '@/types/CategoryType';

export default function BannerForm({
    onClose,
    category,
}: {
    onClose: () => void;
    category?: BannerType;
}) {
    const [type, setType] = useState<{ label: string; value: string } | null>(
        category?.type ? { label: category.type, value: category.type } : null
    );
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category?.banner && !image) {
            setImagePreview(category.banner);
        }
    }, [category?.banner, image]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type) {
            toast.error('Please select a type');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('type', type.value);
        if (image) formData.append('banner', image);

        try {
            await addBanner(formData);
            toast.success('Banner updated successfully');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${category?.id ? 'update' : 'add'} banner`);
        } finally {
            setLoading(false);
        }
    };

    const [typeOptions, setTypeOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        async function fetchTypes() {
            try {
                const res = await listBannerTypes();
                const formatted = res.data.map((type: { id: number; name: string }) => ({
                    label: type.name,
                    value: String(type.id),
                }));
                setTypeOptions(formatted);
            } catch (error) {
                console.error("Failed to fetch banner types", error);
            }
        }

        fetchTypes();
    }, []);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <SelectDropdown
                    options={typeOptions}
                    value={type || { label: 'Select type', value: '' }}
                    onChange={(option) => setType(option)}
                    className="w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image <span className="text-red-500">*</span>
                </label>

                <label
                    htmlFor="categoryImage"
                    className="relative w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors overflow-hidden flex items-center justify-center"
                >
                    {imagePreview ? (
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-orange-600">
                            <svg
                                className="w-12 h-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="mt-2 text-sm">Click to upload or drag and drop</span>
                        </div>
                    )}

                    <input
                        id="categoryImage"
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
