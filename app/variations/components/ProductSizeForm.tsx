'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import axios from 'axios';
import { addSizes } from '@/app/api_/sizes';

export default function ProductSizeForm({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name) {
            toast.error('Please provide size name');
            return;
        }

        setLoading(true);
        try {
            await addSizes({ name });
            toast.success('Size added successfully');
            onClose();
            window.location.reload();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.name || 'Failed to add size');
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size name
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}