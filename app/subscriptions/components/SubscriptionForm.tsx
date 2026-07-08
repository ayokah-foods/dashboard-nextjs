"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
    createSubscription,
    updateSubscription,
} from "@/lib/api/subscriptions";
import { SubscriptionType } from "@/types/SubscriptionType";
import { SubmitButton } from "@/app/components/commons/SubmitButton";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface Props {
    onClose: () => void;
    subscription?: SubscriptionType; // optional for edit mode
}

export default function SubscriptionForm({ onClose, subscription }: Props) {
    const [form, setForm] = useState({
        name: subscription?.name || "",
        monthly_price: subscription?.monthly_price || 0,
        features: subscription?.features || "",
        payment_link: subscription?.payment_link_url || "",
    });

    const [loading, setLoading] = useState(false);
    const isEditing = Boolean(subscription?.id); // ✅ determine edit mode

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.name ||
            !form.monthly_price ||
            !form.features ||
            !form.payment_link
        ) {
            toast.error("All fields are required");
            return;
        }

        const payload = {
            name: form.name,
            monthly_price: Number(form.monthly_price),
            features: form.features,
            payment_link_url: form.payment_link,
        };

        try {
            setLoading(true);

            if (isEditing && subscription?.id) {
                await updateSubscription(subscription.id, payload);
                toast.success("Subscription updated successfully");
            } else {
                await createSubscription(payload);
                toast.success("Subscription created successfully");
            }

            onClose();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(
                `Failed to ${isEditing ? "update" : "create"} subscription`,
            );
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-hub-primary/200"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-hub-primary/200"
                />
            </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-hub-primary/200"
                />
            </div>

            <SubmitButton
                loading={loading}
                label={isEditing ? "Update Subscription" : "Save Subscription"}
            />
        </form>
    );
}
