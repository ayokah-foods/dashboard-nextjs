"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createSubscription } from "@/app/api_/subscriptions";
import { SubscriptionType } from "@/types/SubscriptionType";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface Props {
    onClose: () => void;
    subscription?: SubscriptionType;
}

export default function SubscriptionForm({ onClose, subscription }: Props) {
    const [form, setForm] = useState({
        name: subscription?.name || "",
        monthly_price: subscription?.monthly_price || 0,
        yearly_price: subscription?.yearly_price || "",
        features: subscription?.features || "",
        payment_link: subscription?.payment_link || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.monthly_price ||
            !form.yearly_price ||
            !form.features ||
            !form.payment_link
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                monthly_price: Number(form.monthly_price),
                yearly_price: Number(form.yearly_price),
                features: form.features,
                payment_link: form.payment_link,
            };

            await createSubscription(payload);
            toast.success("Subscription saved successfully");
            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save subscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter plan name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Monthly Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Price <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="monthly_price"
                    value={form.monthly_price}
                    onChange={handleChange}
                    placeholder="Enter monthly price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Yearly Price */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yearly Price <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="yearly_price"
                    value={form.yearly_price}
                    onChange={handleChange}
                    placeholder="Enter yearly price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {/* Features */}
            {/* Features */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features <span className="text-red-500">*</span>
                </label>
                <TinyMCEEditor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    value={form.features}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: "link lists code",
                        toolbar:
                            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link | code",
                        content_style:
                            "body { font-family:Inter,Arial,sans-serif; font-size:14px; color:#374151 }",
                    }}
                    onEditorChange={(content) =>
                        setForm({ ...form, features: content })
                    }
                />
            </div>


            {/* Payment Link */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Link <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    name="payment_link"
                    value={form.payment_link}
                    onChange={handleChange}
                    placeholder="https://payment.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            <SubmitButton loading={loading} label="Save Subscription" />
        </form>
    );
}
