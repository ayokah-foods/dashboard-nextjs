"use client";

import { useState } from "react";
import SubscribersTable from "../components/SubscribersTable";

export default function SubscribersPage() {
    const [limit] = useState(10);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Subscribers</h1>
                    <p className="text-sm text-gray-600">
                        View all vendors and shops currently subscribed to active plans.
                    </p>
                </div>
            </div>

            {/* Table */}
            <SubscribersTable limit={limit} />
        </div>
    );
}
