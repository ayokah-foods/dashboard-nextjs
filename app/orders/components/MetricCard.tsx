'use client';

import { useEffect, useState } from 'react';
import {
   ArrowPathIcon,
     CheckCircleIcon,
    XCircleIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import { orderStats } from '@/app/api_/orders';
import { OrderStatsType } from '@/types/OrderType';

export function MetricCard() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<OrderStatsType | null>(null);

    useEffect(() => {
        orderStats()
            .then((data) => {
                setMetrics(data);
            })
            .catch((err) => {
                console.error("Failed to load order stats", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-gray-800">
            {/* Processing Orders */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <ArrowPathIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Processing</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_processing ?? 0}
                    </p>
                </div>
            </div>

            {/* Ongoing Orders */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-sky-100 text-sky-600">
                    <TruckIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ongoing</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_ongoing ?? 0}
                    </p>
                </div>
            </div>

            {/* Completed Orders */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckCircleIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_completed ?? 0}
                    </p>
                </div>
            </div>

            {/* Cancelled Orders */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <XCircleIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_cancelled ?? 0}
                    </p>
                </div>
            </div>
        </div>

    );
}
