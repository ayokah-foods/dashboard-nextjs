'use client';

import { useState } from 'react';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { sendInvite } from '@/app/api_/team';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface Props {
    onClose: () => void;
}

const typeOptions = [
    { label: "Admin", value: "admin" },
    { label: "Staff", value: "staff" },
];

export default function InviteForm({ onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name) newErrors.name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (formData.phone && formData.phone.length > 12) {
            newErrors.phone = 'Phone number must be at most 12 characters';
        }
        if (!formData.role || !['admin', 'staff'].includes(formData.role)) {
            newErrors.role = 'Role must be admin or staff';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8 || formData.password.length > 20) {
            newErrors.password = 'Password must be between 8 and 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validate()) {
            setLoading(false);
            return;
        }

        try {
            const response = await sendInvite(formData);
            toast.success(response.message);
            window.location.reload();
        } catch (err) {
            const error = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
            if (error.response?.data?.errors) {
                const messages = Object.values(error.response.data.errors).flat();
                messages.forEach((msg) => toast.error(msg));
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {/* First Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Last Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Role */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign role</label>
                <SelectDropdown
                    options={typeOptions}
                    value={typeOptions.find(opt => opt.value === formData.role) || typeOptions[0]}
                    onChange={(option) => setFormData({ ...formData, role: option.value })}
                    className="w-full"
                />
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>


            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            {/* Buttons */}
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center py-2 px-4 text-sm font-bold rounded-md text-gray-900 hover:text-gray-500 bg-gray-300 hover:bg-gray-200 cursor-pointer"
                >
                    Cancel
                </button>
                <SubmitButton loading={loading} label="Send Invite" />


            </div>
        </form>
    );
}
