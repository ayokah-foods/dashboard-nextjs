"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { listSubscribers } from "@/lib/api_/subscriptions";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { formatAmount } from "@/utils/formatCurrency";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Image from "next/image";

interface SubscriberType {
    id: number;
    start_date: string;
    end_date: string;
    vendor: {
        id: number;
        name: string;
        email: string;
    };
    subscription: {
        id: number;
        name: string;
        monthly_price: number;
        yearly_price: number;
    };
    shop: {
        id: number;
        name: string;
        logo: string;
    };
    status: string;
}

type Props = {
    limit: number;
};

export default function SubscribersTable({ limit }: Props) {
    const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    // Table columns
    const columns: ColumnDef<SubscriberType>[] = useMemo(
        () => [
            {
                header: "Shop",
                cell: ({ row }) => {
                    const shop = row.original.shop;
                    return (
                        <div className="flex items-center space-x-3">
                            {shop?.logo ? (
                                <Image
                                    width={40}
                                    height={40}
                                    src={shop.logo}
                                    alt={shop.name}
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                    N/A
                                </div>
                            )}
                            <span className="font-medium text-gray-800">
                                {shop?.name || "—"}
                            </span>
                        </div>
                    );
                },
            },

            {
                header: "Vendor",
                cell: ({ row }) => (
                    <div>
                        <p className="font-medium text-gray-800">
                            {row.original.vendor?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {row.original.vendor?.email || "—"}
                        </p>
                    </div>
                ),
            },
            {
                header: "Subscription Plan",
                cell: ({ row }) => (
                    <div>
                        <p className="font-semibold text-gray-700">
                            {row.original.subscription?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Monthly:{" "}
                            {formatAmount(
                                row.original.subscription?.monthly_price || 0
                            )}
                        </p>
                    </div>
                ),
            },
            {
                header: "Status",
                cell: ({ row }) => {
                    const endDate = new Date(row.original.end_date);
                    const now = new Date();

                    const remainingDays = Math.max(
                        0,
                        Math.ceil(
                            (endDate.getTime() - now.getTime()) /
                                (1000 * 60 * 60 * 24)
                        )
                    );

                    const isActive = now <= endDate;

                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {isActive
                                ? `Active (${remainingDays} days left)`
                                : "Inactive"}
                        </span>
                    );
                },
            },
            {
                header: "Started On",
                accessorFn: (row) => formatHumanReadableDate(row.start_date),
            },
        ],
        []
    );

    // Fetch data
    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await listSubscribers();
            setSubscribers(response.data || []);
            setTotal(response.data.length || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to load subscribers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={subscribers}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) =>
                    setPagination(newPagination)
                }
            />
        </div>
    );
}
