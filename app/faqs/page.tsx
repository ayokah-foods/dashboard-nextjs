'use client';

import { useState } from "react";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
 import { PlusIcon } from "@heroicons/react/20/solid";
import Drawer from "../components/commons/Drawer"; 
import FaqsTable from "./components/FaqsTable";
import FaqsForm from "./components/FaqsForm";

const typeOptions = [
    { label: "All Faqs", value: "" },
    { label: "Customer Faqs", value: "customer" },
    { label: "Vendor Faqs", value: "vendor" },
    { label: "App Faqs", value: "system" },
];

export default function Faqs() {
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Faqs</h1>
                    <p className="text-sm text-gray-600">Manage your Faqs here.</p>
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
                        Create Faqs
                    </button>
                </div>
            </div>

            <FaqsTable
                limit={10}
                type={selectedType.value}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Faqs"
            >
                <FaqsForm onClose={() => setDrawerOpen(false)} />
            </Drawer>
        </div>
    );
}
