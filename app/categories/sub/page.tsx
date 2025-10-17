'use client';

import { Fragment, useState } from "react";
import SubCategoriesTable from "../components/SubCategoriesTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import SubCategoryForm from "../components/SubCategoryForm";
import { FlattenedSubCategory } from "@/types/CategoryType";
import { deleteCategory } from "@/app/api_/categories";
import toast from "react-hot-toast";
import { Transition, Dialog, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/react";

const typeOptions = [
    { label: "Product Items", value: "products" },
    { label: "Service Items", value: "services" },
];

export default function Sub() {
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<FlattenedSubCategory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<FlattenedSubCategory | null>(null);

    const handleEdit = (category: FlattenedSubCategory) => {
        setEditingCategory(category);
        setDrawerOpen(true);
    };

    const confirmDelete = (category: FlattenedSubCategory) => {
        setCategoryToDelete(category);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id);
            toast.success("Subcategory deleted successfully.");
            setIsModalOpen(false);
            setCategoryToDelete(null);
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
                    <h1 className="text-2xl font-bold text-gray-800">Sub categories</h1>
                    <p className="text-sm text-gray-600">Manage your sub-categories here.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <div className="w-48">
                        <SelectDropdown
                            options={typeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Subcategory
                    </button>
                </div>
            </div>

            <SubCategoriesTable
                limit={10}
                type={selectedType.value}
                onEdit={handleEdit}
                onDelete={confirmDelete}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? "Edit Sub-category" : "Create Sub-category"}
            >
                <SubCategoryForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                    category={editingCategory ?? undefined}
                />
            </Drawer>

            {/* Delete Confirmation Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                                    <DialogTitle className="text-lg font-medium text-gray-900">
                                        Confirm Deletion
                                    </DialogTitle>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Are you sure you want to delete this subcategory? This action cannot be undone.
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
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
