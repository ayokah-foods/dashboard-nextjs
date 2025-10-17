"use client";

import { useEffect, useState } from "react";
import { userStats } from "../api_/users";
import UsersTable from "./components/UsersTable";
import { UserGroupIcon, CheckBadgeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import UserAreaChart from "./components/UserAreaChart";

type Stats = {
    total_users: number;
    verified_users: number;
    unverified_users: number;
};

export default function Customers() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await userStats("customer");
                setStats(response);
            } catch (err) {
                console.error("Failed to load user stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6 text-gray-800">
            <div>
                <h1 className="text-2xl font-bold">Customers</h1>
                <p className="text-sm text-gray-500">Manage your customers here.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Customers */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <UserGroupIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Customers</p>
                        <p className="text-3xl font-bold">
                            {loading ? <Skeleton width={50} height={28} /> : stats?.total_users ?? 0}
                        </p>
                    </div>
                </div>

                {/* Verified Customers */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <CheckBadgeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Verified Customers</p>
                        <p className="text-3xl font-bold">
                            {loading ? <Skeleton width={50} height={28} /> : stats?.verified_users ?? 0}
                        </p>
                    </div>
                </div>
                {/* unverified Customers */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                        <ExclamationTriangleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Unverified Customers</p>
                        <p className="text-3xl font-bold">
                            {loading ? <Skeleton width={50} height={28} /> : stats?.unverified_users ?? 0}
                        </p>
                    </div>
                </div>
            </div>

            <UserAreaChart />


            <UsersTable limit={10} />
        </div>
    );
}
