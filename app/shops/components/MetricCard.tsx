'use client';

import { useEffect, useState } from 'react';
import {
    BuildingStorefrontIcon,
    CheckBadgeIcon,
    CubeIcon,
    ExclamationTriangleIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import { ShopMetrics } from '@/types/ShopType';
import { shopMetrics } from '@/app/api_/shop';

export function MetricCard() {
    const [metrics, setMetrics] = useState<ShopMetrics['data'] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        shopMetrics()
            .then((response) => {
                setMetrics(response.data);
            })
            .catch((err) => {
                console.error("Failed to load shop metrics", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-gray-800">
            {/* Total Shops */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4 ">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <BuildingStorefrontIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Shops</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_shops ?? 0}
                    </p>
                </div>
            </div>

            {/* Active Shops */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckBadgeIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Active Shops</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.active_shops ?? 0}
                    </p>
                </div>
            </div>

            {/* Inactive Shops */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <ExclamationTriangleIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Inactive Shops</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.inactive_shops ?? 0}
                    </p>
                </div>
            </div>
            {/* Product Sellers */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                    <CubeIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Product Sellers</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_products ?? 0}
                    </p>
                </div>
            </div>

            {/* Service Providers */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-sky-100 text-sky-600">
                    <WrenchScrewdriverIcon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Service Providers</p>
                    <p className="text-3xl font-bold">
                        {loading ? <Skeleton width={50} height={28} /> : metrics?.total_services ?? 0}
                    </p>
                </div>
            </div>

        </div>
    );
}
