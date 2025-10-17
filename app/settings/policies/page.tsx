"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PrivacyPages } from "@/app/setting";

const PolicyEditor = dynamic(
    () => import("@/app/settings/policies/components/PolicyEditor"),
    {
        ssr: false,
    }
);


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("privacy");

    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <nav className="mb-4">
                <div className="mt-4 flex space-x-4 border-b">
                    {PrivacyPages.map((page) => (
                        <button
                            key={page.name}
                            onClick={() => setActiveTab(page.type)}
                            className={`pb-2 px-3 text-sm font-medium border-b-2 cursor-pointer ${activeTab === page.type
                                ? "border-hub-primary-500 text-hub-primary-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {page.name}
                        </button>
                    ))}
                </div>
            </nav>

            <PolicyEditor type={activeTab} />
        </div>
    );
}
