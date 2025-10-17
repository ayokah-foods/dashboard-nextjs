'use client';

import { useState } from 'react';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import { create, updateFaq } from '@/app/api_/faqs';
import toast from 'react-hot-toast';
import { SubmitButton } from '@/app/components/commons/SubmitButton';
import { Faq } from '@/types/FaqType';

interface Props {
    onClose: () => void;
    faq?: Faq;
}

export default function FaqForm({ onClose, faq }: Props) {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');
    const [type, setType] = useState<{ label: string; value: string } | null>(
        faq?.type ? { label: faq.type, value: faq.type } : null
    );
    const [loading, setLoading] = useState(false);

    const typeOptions = [
        { label: 'Vendor', value: 'vendor' },
        { label: 'Customer', value: 'customer' },
        { label: 'General', value: 'general' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!type?.value) {
            toast.error("Type is required");
            return;  
        }
        if (!String(question).trim()) {
            toast.error("Question is required");
            return;
        }
        if (!String(answer).trim()) {
            toast.error("Answer is required");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("question", String(question));
        formData.append("answer", String(answer));
        formData.append("type", String(type?.value || ""));

        try {
            if (faq?.id) {
                await updateFaq(String(faq.id), formData);
                toast.success('FAQ updated successfully');
            } else {
                await create(formData);
                toast.success('FAQ added successfully');
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${faq?.id ? 'update' : 'add'} FAQ`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Answer */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                    rows={4}
                    placeholder="Enter answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                    options={typeOptions}
                    value={type || { label: 'Select type', value: '' }}
                    onChange={(opt) => setType(opt)}
                    className="w-full"
                />
            </div>

            <SubmitButton loading={loading} label="Save changes" />
        </form>
    );
}
