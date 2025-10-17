'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { useCategoryStore } from '@/app/store/CategoryStore';
import { addCategory, updateCategory } from '@/app/api_/categories';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { CategoryType } from '@/types/CategoryType';

interface Props {
    onClose: () => void;
    category?: CategoryType;

}

export default function CategoryForm({ onClose, category }: Props) {
    const [name, setName] = useState(category?.name || '');
    const [selectedParent, setSelectedParent] = useState<{ label: string; value: string } | null>(
        category?.parent_id
            ? { label: category.parent_name || '', value: String(category.parent_id) }
            : null
    );
    const [description, setDescription] = useState(category?.description || '');
    const [imagePreview, setImagePreview] = useState<string | null>(category?.image || null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [type, setType] = useState<{ label: string; value: string } | null>(
        category?.type ? { label: category.type, value: category.type } : null
    );
    const { categories } = useCategoryStore();

    const categoryOptions = useMemo(() => {
        return categories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
        }));
    }, [categories]);

    const typeOptions = [
        { label: 'Product', value: 'products' },
        { label: 'Service', value: 'services' },
    ];
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (type?.value) formData.append('type', type.value);
        if (selectedParent?.value) formData.append('parent_id', selectedParent.value);
        if (imageFile) formData.append('image', imageFile);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success('Category updated successfully');
            } else {
                await addCategory(formData);
                toast.success('Category added successfully');
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${category?.id ? 'update' : 'add'} category`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name <span className='text-red-500'>*</span></label>
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className='text-red-500'>*</span></label>
                <SelectDropdown
                    options={typeOptions}
                    value={type || { label: 'Select type', value: '' }}
                    onChange={(opt) => setType(opt)}
                    className="w-full"
                />
            </div>
            {/* Parent Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category <span className='text-yellow-500'>(optional)</span></label>
                <SelectDropdown
                    options={categoryOptions}
                    value={selectedParent || { label: 'Select category', value: '' }}
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className='text-red-500'>*</span></label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Category description"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cat Image <span className='text-red-500'>*</span></label>

                <label
                    htmlFor="categoryImage"
                    className="relative w-full h-50 aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors overflow-hidden flex items-center justify-center"
                >
                    {/* Image Preview fills label */}
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
