'use client';

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import { BannerType } from "@/types/CategoryType";
import toast from "react-hot-toast";
import BannerTypesTable from "../components/BannerTypesTable";
import BannerTypesForm from "../components/BannerTypesForm";
import { deleteBannerType } from "@/app/api_/banners";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";


export default function BannerTypes() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BannerType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [typeToDelete, settypeToDelete] = useState<BannerType | null>(null);

    const confirmDelete = (category: BannerType) => {
        settypeToDelete(category);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!typeToDelete) return;
        try {
            await deleteBannerType(typeToDelete.id);
            toast.success("Banner deleted successfully.");
            setIsModalOpen(false);
            settypeToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subcategory.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Banner types</h1>
                    <p className="text-sm text-gray-600">Manage your banner types here.</p>
                </div>

                <div className="flex gap-3 items-center">


                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Banner Type
                    </button>
                </div>
            </div>

            <BannerTypesTable
                limit={10}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? "Edit Banner" : "Create Banner"}
            >
                <BannerTypesForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                    category={editingCategory ?? undefined}
                />
            </Drawer>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this banner type? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Proceed
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
}
