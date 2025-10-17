'use client';

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import { ColorType } from "@/types/ColorType";
import toast from "react-hot-toast"; 
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import ProductColorsTable from "../components/ProductColorsTable";
import ProductColorsForm from "../components/ProductColorsForm";
import { deleteColour } from "@/app/api_/colours";

export default function ProductColors() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingColor, setEditingColor] = useState<ColorType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [colorToDelete, setcolorToDelete] = useState<ColorType | null>(null);

    const confirmDelete = (color: ColorType) => {
        setcolorToDelete(color);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!colorToDelete) return;
        try {
            await deleteColour(colorToDelete.id);
            toast.success("Color deleted successfully.");
            setIsModalOpen(false);
            setcolorToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete subcolor.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Colors</h1>
                    <p className="text-sm text-gray-600">Manage your product colors here.</p>
                </div>

                <div className="flex gap-3 items-center">


                    <button
                        onClick={() => {
                            setEditingColor(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Product Colors
                    </button>
                </div>
            </div>

            <ProductColorsTable
                limit={10}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingColor(null);
                }}
                title={editingColor ? "Edit Color" : "Create Color"}
            >
                <ProductColorsForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingColor(null);
                    }}
                />
            </Drawer>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this color? This action cannot be undone.
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
