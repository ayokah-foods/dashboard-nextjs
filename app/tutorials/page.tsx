'use client';

import { useState } from "react";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import { PlusIcon } from "@heroicons/react/20/solid";
import Drawer from "../components/commons/Drawer";
import TutorialForm from "./components/TutorialForm";
import TutorialTable from "./components/TutorialTable";

const typeOptions = [
    { label: "All Tutorials", value: "" },
    { label: "Customer Tutorials", value: "customer" },
    { label: "Vendor Tutorials", value: "vendor" },
    { label: "App Tutorials", value: "system" },
];

export default function Tutorials() {
    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);


    return (
        <div className="space-y-6 text-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Tutorials</h1>
                    <p className="text-sm text-gray-600">Manage your Tutorials here.</p>
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
                        Create Tutorial
                    </button>
                </div>
            </div>

            <TutorialTable
                limit={10}
                type={selectedType.value}
            />

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Tutorial"
            >
                <TutorialForm onClose={() => {
                    setDrawerOpen(false);
                }} />
            </Drawer>
        </div>
    );
}
