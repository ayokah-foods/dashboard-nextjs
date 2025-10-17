'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { BannerType } from '@/types/CategoryType';
import { addBannerType } from '@/app/api_/banners';

export default function BannerTypesForm({
    onClose,
    category,
}: {
    onClose: () => void;
    category?: BannerType;
}) {
    const [type, setType] = useState<{ label: string; value: string } | null>(
        category?.type ? { label: category.type, value: category.type } : null
    );
     const [loading, setLoading] = useState(false);
 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type) {
            toast.error('Please select a type');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', type.value);
 
        try {
            await addBannerType(formData);
            toast.success('Banner type added successfully');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to add banner type`);
        } finally {
            setLoading(false);
        }
    }; 

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label> 
                <input className='w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500' type="text" value={type?.label} onChange={(e) => setType({ label: e.target.value, value: e.target.value })} />
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
