'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { storeCountry } from '@/app/api_/locations';
import { CountryType } from '@/types/LocationType';
import Image from 'next/image';

export default function CountryForm({
    onClose,
    country,
}: {
    onClose: () => void;
    country?: CountryType;
}) {
    const [form, setForm] = useState<{
        name: string;
        flag: File | null;
        dial_code: string;
        currency: string;
        short_name: string;
    }>({
        name: country?.name || '',
        flag: null,
        dial_code: country?.dial_code || '',
        currency: country?.currency || '',
        short_name: country?.short_name || '',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        country?.flag ? country.flag : null
    );

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'flag' && files && files.length > 0) {
            const file = files[0];
            setForm((prev) => ({ ...prev, flag: file }));
            setPreviewUrl(URL.createObjectURL(file)); // ✅ preview
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, flag, dial_code, currency, short_name } = form;

        if (!name || !flag || !dial_code || !currency || !short_name) {
            toast.error('All fields are required.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('flag', flag);  
        formData.append('dial_code', dial_code);
        formData.append('currency', currency);
        formData.append('short_name', short_name);

        try {
            setLoading(true);
            await storeCountry(formData);
            toast.success('Country saved successfully.');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save country.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Kenya"
                />
            </div>

            {/* ✅ File Upload for Flag */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flag (Upload Image)</label>
                <input
                    name="flag"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                {/* ✅ Preview Image */}
                {previewUrl && (
                    <div className="mt-2">
                        <Image
                            width={200}
                            height={100}
                            src={previewUrl}
                            alt="Flag Preview"
                            className="h-16 w-auto rounded-md border border-gray-300 object-cover"
                        />
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dial Code</label>
                <input
                    name="dial_code"
                    type="text"
                    value={form.dial_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="+254"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                    name="currency"
                    type="text"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="KES"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                <input
                    name="short_name"
                    type="text"
                    value={form.short_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="KE"
                />
            </div>

            <SubmitButton loading={loading} label="Save Country" />
        </form>
    );
}
