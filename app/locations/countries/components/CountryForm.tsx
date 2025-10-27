'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { storeCountry } from '@/app/api_/locations';
import { CountryType } from '@/types/LocationType';

export default function CountryForm({
    onClose,
    country,
}: {
    onClose: () => void;
    country?: CountryType;
}) {
    const [form, setForm] = useState<CountryType>({
        name: country?.name || '',
        flag: country?.flag || '',
        dial_code: country?.dial_code || '',
        currency: country?.currency || '',
        short_name: country?.short_name || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.flag || !form.dial_code || !form.currency || !form.short_name) {
            toast.error('All fields are required.');
            return;
        }

        try {
            setLoading(true);
            await storeCountry(form);
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flag (URL)</label>
                <input
                    name="flag"
                    type="text"
                    value={form.flag}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="https://example.com/flag.png"
                />
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
