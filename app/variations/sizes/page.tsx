'use client';

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import { deleteSizes } from "@/app/api_/sizes";
import ProductSizesTable from "../components/ProductSizesTable";
import ProductSizeForm from "../components/ProductSizeForm";
import { Sizes } from "@/types/SizeType";

export default function ProductSizes() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sizeToDelete, setsizeToDelete] = useState<Sizes | null>(null);
    const [loading, setLoading] = useState(false);

    const confirmDelete = (size: Sizes) => {
        setsizeToDelete(size);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!sizeToDelete) return;
        setLoading(true);

        try {
            await deleteSizes(sizeToDelete.id);
            toast.success("Size deleted successfully.");
            setIsModalOpen(false);
            setsizeToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete size.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product sizes</h1>
                    <p className="text-sm text-gray-600">Manage your product sizes here.</p>
                </div>

                <div className="flex gap-3 items-center">


                    <button
                        onClick={() => {
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Product Size
                    </button>
                </div>
            </div>

            <ProductSizesTable
                limit={10}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                }}
            >
                <ProductSizeForm
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                />
            </Drawer>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this size? This action cannot be undone.
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
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
}
