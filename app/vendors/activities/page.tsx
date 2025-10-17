'use client';

import ActivitiesTable from "@/app/customers/components/ActivitiesTable";
import ActivityAreaChart from "@/app/customers/components/ActivityAreaChart";


export default function Activities() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Vendor Activities</h1>
            <p className="text-sm text-gray-500 mb-6">Manage your vendor activities here.</p>
            <ActivityAreaChart type="vendor" />
            <ActivitiesTable limit={10} role="vendor" />
        </div>
    );
}