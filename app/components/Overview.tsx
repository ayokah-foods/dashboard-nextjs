"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getStats } from "../api_/orders";

interface StatCardProps {
    title: string;
    value?: string | number;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, loading }) => (
    <div className="card w-full p-4">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="mt-2 flex items-baseline gap-2">
            <div className="text-4xl font-bold text-black">
                {loading ? <Skeleton width={80} height={28} baseColor="#444" highlightColor="#666" /> : value}
            </div>
        </div>
    </div>
);

interface Stats {
    total_customers: number;
    total_vendors: number;
    total_products: number;
    total_orders: number;
    total_revenue: string;
}

interface OverviewProps {
    period: string;
}

const Overview: React.FC<OverviewProps> = ({ period }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getStats(period);
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
                setError("Failed to load statistics. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (period) {
            fetchStats();
        }
    }, [period]);

    if (error) {
        return <div className="card p-6 text-red-400">{error}</div>;
    }

    const statCards = [
        {
            title: "Total Revenue",
            value: stats ? `$${Number(stats.total_revenue).toLocaleString()}` : undefined,
        },
        { title: "Total Orders", value: stats?.total_orders },
        { title: "Total Customers", value: stats?.total_customers },
        { title: "Total Vendors", value: stats?.total_vendors },
        { title: "Total Products", value: stats?.total_products },
    ];

    return (
        <div className="flex items-center justify-between gap-4">
            {statCards.map((card) => (
                <StatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    loading={isLoading}
                />
            ))}
        </div>
    );
};

export default Overview;
