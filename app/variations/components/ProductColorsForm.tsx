'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { addColours } from '@/app/api_/colours';
import axios from 'axios';
import { colornames } from 'color-name-list';

export default function ProductColorsForm({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [hexcode, setHexcode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (name.trim()) {
            const match = colornames.find(
                c => c.name.toLowerCase() === name.trim().toLowerCase()
            );
            if (match) {
                setHexcode(match.hex);
            }
        }
    }, [name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !hexcode) {
            toast.error('Please provide both color name and hexcode');
            return;
        }

        setLoading(true);
        try {
            await addColours({ name, hexcode });
            toast.success('Color added successfully');
            onClose();
            window.location.reload();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.name || 'Failed to add color');
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
                    Colour name
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                    Colour Hexcode
                </label>
                <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    type="text"
                    value={hexcode}
                    onChange={(e) => setHexcode(e.target.value)}
                />
            </div>
            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}