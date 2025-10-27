'use client';

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import CountryForm from "./components/CountryForm";
import CountryTable from "./components/CountryTable";
import { deleteCountry } from "@/app/api_/locations";
import { CountryType } from "@/types/LocationType";

export default function CountryPage() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState<CountryType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState<CountryType | null>(null);
    const [loading, setLoading] = useState(false);

    const confirmDelete = (country: CountryType) => {
        setCountryToDelete(country);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!countryToDelete?.id) return;

        try {
            setLoading(true);
            await deleteCountry(countryToDelete.id);
            toast.success("Country deleted successfully.");
            setIsModalOpen(false);
            setCountryToDelete(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete country.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
                    <p className="text-sm text-gray-600">Manage your countries and related information here.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => {
                            setEditingCountry(null);
                            setDrawerOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600 cursor-pointer"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Country
                    </button>
                </div>
            </div>

            {/* Country Table */}
            <CountryTable
                limit={10}
                onDelete={confirmDelete}
            />

            {/* Drawer Form */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCountry(null);
                }}
                title={editingCountry ? "Edit Country" : "Add Country"}
            >
                <CountryForm
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCountry(null);
                    }}
                    country={editingCountry ?? undefined}
                />
            </Drawer>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Deletion"
            >
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this country? This action cannot be undone.
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
