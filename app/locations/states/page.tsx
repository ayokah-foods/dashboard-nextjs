"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import { deleteState } from "@/lib/api/locations";
import { StateType } from "@/types/LocationType";
import StateTable from "./components/StateTable";
import StateForm from "./components/StateForm";

export default function StatePage() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingState, setEditingState] = useState<StateType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stateToDelete, setStateToDelete] = useState<StateType | null>(null);
    const [loading, setLoading] = useState(false);

    const confirmDelete = (state: StateType) => {
        setStateToDelete(state);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!stateToDelete) return;
        try {
            setLoading(true);
            await deleteState(stateToDelete.id || 0);
            toast.success("State deleted successfully.");
            setIsModalOpen(false);
            setStateToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete state.");
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
                        Province
                    </h1>
                    <p className="text-sm text-gray-600">
                        Manage the list of province within countries.
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setEditingState(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-hub-primary text-white hover:bg-hub-secondary cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create State
                    </button>
                </div>
            </div>

            {/* Table */}
            <StateTable limit={10} onDelete={confirmDelete} />

            {/* Drawer Form */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingState(null);
                }}
                title={editingState ? "Edit Province" : "Create Province"}
            >
                <StateForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingState(null);
                    }}
                    state={editingState ?? undefined}
                />
            </Drawer>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this province? This action
                    cannot be undone.
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
