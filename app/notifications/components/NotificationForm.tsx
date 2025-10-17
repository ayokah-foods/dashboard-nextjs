'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { sendNotification } from '@/app/api_/notifications';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { getRecentUsers } from '@/app/api_/users';
import { User } from '@/types/UserType';
import AsyncSelect from 'react-select/async';
import { debounce } from 'lodash';
import { receiverOptions, typeOptions } from '@/app/setting';
 
const userSearchCache = new Map<string, { timestamp: number; data: Option[] }>();
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface NotificationData {
    id: string;
    receiver: string;
    body: string;
    image: string;
    cta: string;
}

interface Props {
    onClose: () => void;
    notification?: NotificationData;
}

type Option = {
    label: string;
    value: string;
    email?: string;
    phone?: string;
};
export default function NotificationForm({ onClose, notification }: Props) {
    const [body, setBody] = useState('');
    const [cta, setCta] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [receiver, setReceiver] = useState<Option>({ label: 'Select receiver', value: '' });
    const [type, setType] = useState<Option>({ label: 'Select channel', value: '' });
    const [selectedUser, setSelectedUser] = useState<Option | null>(null);


    useEffect(() => {
        if (notification) {
            const matched = receiverOptions.find(opt => opt.value === notification.receiver);
            if (matched) setReceiver(matched);

            setBody(notification.body);
            setCta(notification.cta);
            setImagePreview(notification.image);
        }
    }, [notification]);


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

        try {
            const formData = new FormData();
            formData.append('receiver', receiver.value);
            formData.append('body', body);
            formData.append('cta', cta);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            formData.append('receiver', receiver.value);
            if (receiver.value === 'single' && selectedUser) {
                formData.append('user_id', selectedUser.value);
            }

            await sendNotification(formData);
            toast.success('Notification sent successfully!');

            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error('Failed to send notification.');
        } finally {
            setLoading(false);
        }
    };
    const isSMS = type.value === 'sms';
    const isEmail = type.value === 'email';
    const maxLength = isSMS ? 160 : isEmail ? 1000 : undefined;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Receiver */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={receiverOptions}
                    value={receiver}
                    onChange={setReceiver}
                    className="w-full"
                />
            </div>
            {/* Channel */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={typeOptions}
                    value={type}
                    onChange={setType}
                    className="w-full"
                />
            </div>


            {receiver.value === 'single' && (
                <div className="space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select User <span className="text-red-500">*</span>
                        </label>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={(inputValue, callback) => {
                                loadUserOptions(inputValue, callback);
                            }}

                            value={selectedUser}
                            onChange={(val) => setSelectedUser(val)}
                            className="w-full text-sm text-gray-800"
                        />
                    </div>

                    {selectedUser && (
                        <div className="text-xs text-gray-600 mt-1">
                            <span className="font-medium text-gray-700">Contact: </span>
                            {type.value === 'sms'
                                ? selectedUser.phone || <span className="italic text-red-500">No phone available</span>
                                : selectedUser.email || <span className="italic text-red-500">No email available</span>}
                        </div>
                    )}
                </div>
            )}
            {/* Body */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Body <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    maxLength={maxLength}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder={isSMS
                        ? 'Max 160 characters for SMS'
                        : isEmail
                            ? 'Max 1000 characters for Email'
                            : 'Type your notification message here'}
                />
                {(isSMS || isEmail) && (
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {body.length}/{maxLength} characters
                    </p>
                )}
            </div>

            {!isSMS && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Call to Action (CTA) Link
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com"
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image <span className="text-red-500">*</span>
                        </label>
                        <label
                            htmlFor="notificationImage"
                            className="relative w-full h-50 aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors overflow-hidden flex items-center justify-center"
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                                id="notificationImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </>
            )}

            <SubmitButton loading={loading} label={notification ? 'Update Notification' : 'Send Notification'} />
        </form>
    );
}
const loadUserOptions = debounce(async (inputValue: string, callback: (options: Option[]) => void) => {
    const cacheKey = inputValue.trim().toLowerCase();

    const cached = userSearchCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_EXPIRY) {
        // ✅ Use cached data
        callback(cached.data);
        return;
    }

    try {
        const response = await getRecentUsers(20, 0, inputValue);
        const users = response.data.map((user: User) => ({
            label: `${user.name ?? ''} ${user.last_name ?? ''}`.trim() || user.email || user.id,
            value: user.id,
            email: user.email,
            phone: user.phone,
        }));

        // ✅ Cache the result
        userSearchCache.set(cacheKey, { timestamp: now, data: users });

        callback(users);
    } catch (error) {
        console.error('Failed to load users', error);
        callback([]);
    }
}, 500);

