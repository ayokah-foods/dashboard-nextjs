'use client';
import ActivitiesTable from "../components/ActivitiesTable";
import ActivityAreaChart from "../components/ActivityAreaChart";


export default function Activities() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold text-gray-800">Customer Activities</h1>
            <p className="text-sm text-gray-500">Manage your customer activities here.</p>
            <div className="space-y-6 mt-6">
                <ActivityAreaChart type="customer" />
                <ActivitiesTable limit={10} role="customer" />
            </div>
        </div>
    );
}