"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import { deleteSubscription } from "@/lib/api_/subscriptions";
import { SubscriptionType } from "@/types/SubscriptionType";
import SubscriptionTable from "./components/SubscriptionTable";
import SubscriptionForm from "./components/SubscriptionForm";

export default function SubscriptionPage() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] =
        useState<SubscriptionType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] =
        useState<SubscriptionType | null>(null);
    const [loading, setLoading] = useState(false);

    // Confirm deletion
    const confirmDelete = (subscription: SubscriptionType) => {
        setSubscriptionToDelete(subscription);
        setIsModalOpen(true);
    };

    // Handle deletion
    const handleDelete = async () => {
        if (!subscriptionToDelete) return;
        try {
            setLoading(true);
            await deleteSubscription(subscriptionToDelete.id || 0);
            toast.success("Subscription deleted successfully.");
            setIsModalOpen(false);
            setSubscriptionToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Subscriptions
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage subscription plans with pricing, features, and
                        payment links.
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setEditingSubscription(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Subscription
                    </button>
                </div>
            </div>

            {/* Table */}
            <SubscriptionTable
                limit={10}
                onDelete={confirmDelete}
                onEdit={(subscription) => {
                    setEditingSubscription(subscription);
                    setDrawerOpen(true);
                }}
            />

            {/* Drawer Form */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingSubscription(null);
                }}
                title={
                    editingSubscription
                        ? "Edit Subscription"
                        : "Create Subscription"
                }
            >
                <SubscriptionForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingSubscription(null);
                    }}
                    subscription={editingSubscription ?? undefined}
                />
            </Drawer>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this subscription plan? This
                    action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 cursor-pointer"
                        onClick={handleDelete}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
}
