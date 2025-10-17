// app/categories/page.tsx
'use client';

import { useState } from "react";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import CategoriesTable from "./components/CategoriesTable";
import { PlusIcon } from "@heroicons/react/20/solid";
import Drawer from "../components/commons/Drawer";
import CategoryForm from "./components/CategoryForm";

const typeOptions = [
    { label: "Product Items", value: "products" },
    { label: "Service Items", value: "services" },
];

export default function Categories() {
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-sm text-gray-600">Manage your categories here.</p>
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
                        onClick={() => setDrawerOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Create Category
                    </button>
                </div>
            </div>

            <CategoriesTable
                limit={10}
                type={selectedType.value}
                status="active"
            />

            {/* Drawer for Create Category */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Category"
            >
                <CategoryForm onClose={() => setDrawerOpen(false)} />
            </Drawer>
        </div>
    );
}
