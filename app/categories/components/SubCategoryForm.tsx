'use client';

import { useState, useMemo, useEffect } from 'react';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { useCategoryStore } from '@/app/store/CategoryStore';
import { addCategory, getCategories, updateCategory } from '@/app/api_/categories';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { CategoryType, FlattenedSubCategory } from '@/types/CategoryType';


export default function SubCategoryForm({ onClose, category }: { onClose: () => void, category?: FlattenedSubCategory }) {
    const [name, setName] = useState(category?.name ?? '');
    const [selectedParent, setSelectedParent] = useState<{ label: string, value: string } | null>(
        category?.parent_id
            ? { label: category.parent_name ?? '', value: String(category.parent_id) }
            : null
    );
    const { categories, setCategories: saveToStore } = useCategoryStore();
    const [localCategories, setLocalCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories(100);
                saveToStore(response.data);
                setLocalCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        if (categories.length === 0) {
            fetchCategories();
        } else {
            setLocalCategories(localCategories);
        }
    }, [categories, saveToStore, localCategories]);

    const categoryOptions = useMemo(() => {
        return localCategories.map((cat) => ({
            label: cat.name,
            value: String(cat.id),
        }));
    }, [localCategories]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        if (selectedParent?.value) formData.append('parent_id', selectedParent.value);

        try {
            if (category?.id) {
                await updateCategory(category.id, formData);
                toast.success('Sub category updated successfully');
            } else {
                await addCategory(formData);
                toast.success('Sub category added successfully');
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub category Name</label>
                <input
                    type="text"
                    placeholder="Enter sub category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category <span className='text-red-500'>*</span></label>
                <SelectDropdown
                    options={categoryOptions}
                    value={selectedParent || { label: 'Select category', value: '' }}
                    onChange={(opt) => setSelectedParent(opt)}
                    className="w-full"
                />
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
