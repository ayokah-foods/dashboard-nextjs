"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import { deleteCity } from "@/lib/api/locations";
import { CityType } from "@/types/LocationType";
import CityTable from "./components/CityTable";
import CityForm from "./components/CityForm";
export default function CityPage() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<CityType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState<CityType | null>(null);
    const [loading, setLoading] = useState(false);

    const confirmDelete = (city: CityType) => {
        setCityToDelete(city);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!cityToDelete) return;
        try {
            setLoading(true);
            await deleteCity(cityToDelete.id || 0);
            toast.success("City deleted successfully.");
            setIsModalOpen(false);
            setCityToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete city.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cities</h1>
                    <p className="text-sm text-gray-600">
                        Manage the list of cities under each Province and
                        Country.
                    </p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setEditingCity(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-hub-primary text-white hover:bg-hub-secondary cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create City
                    </button>
                </div>
            </div>

            {/* Table */}
            <CityTable limit={10} onDelete={confirmDelete} />

            {/* Drawer Form */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCity(null);
                }}
                title={editingCity ? "Edit City" : "Create City"}
            >
                <CityForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCity(null);
                    }}
                    city={editingCity ?? undefined}
                />
            </Drawer>

            {/* Delete Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this city? This action
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
