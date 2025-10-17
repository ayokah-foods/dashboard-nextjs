'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { reviewStats } from '@/app/api_/reviews';
import { StarIcon } from '@heroicons/react/24/solid';
import { ReviewMetricType } from '@/types/ReviewType';



export function ReviewMetrics() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<ReviewMetricType[]>([]);

    useEffect(() => {
        reviewStats()
            .then((res) => {
                if (res?.data) setMetrics(res.data);
            })
            .catch((err) => {
                console.error("Failed to load review stats", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-gray-800">
            {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4"
                    >
                        <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                            <StarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500"><Skeleton width={120} height={18} /></p>
                            <Skeleton width={40} height={28} />
                        </div>
                    </div>
                ))
            ) : (
                [5, 4, 3, 2, 1].map((star) => {
                    const metric = metrics.find((m) => m.rating === star);
                    return (
                        <div
                            key={star}
                            className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4"
                        >
                            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                                <StarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total {star} Star ratings</p>
                                <p className="text-3xl font-bold">{metric?.count ?? 0}</p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
