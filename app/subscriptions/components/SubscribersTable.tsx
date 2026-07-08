"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { listSubscribers } from "@/lib/api/subscriptions";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { formatAmount } from "@/utils/formatCurrency";
import Image from "next/image";

interface SubscriberType {
    id: number;
    start_date: string;
    end_date: string;
    status: string;
    subscription: {
        id: number;
        name: string;
        monthly_price: number;
    } | null;
    vendor: {
        id: number;
        name: string;
        email: string;
    };
    shop: {
        id: number;
        name: string;
        logo: string;
    };
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

    const columns: ColumnDef<SubscriberType>[] = useMemo(
        () => [
            {
                header: "Shop",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        {row.original.shop?.logo ? (
                            <Image
                                width={32}
                                height={32}
                                src={row.original.shop.logo}
                                alt="logo"
                                className="size-8 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                                NA
                            </div>
                        )}
                        <span className="font-medium text-gray-900">
                            {row.original.shop?.name || "Unknown Shop"}
                        </span>
                    </div>
                ),
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
                header: "Plan",
                cell: ({ row }) => (
                    <div>
                        <p className="font-semibold text-gray-700">
                            {row.original.subscription?.name || "No Plan"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {row.original.subscription
                                ? `${formatAmount(
                                      row.original.subscription.monthly_price,
                                  )}/mo`
                                : "N/A"}
                        </p>
                    </div>
                ),
            },
            {
                header: "Status",
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                            row.original.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                        }`}
                    >
                        {row.original.status}
                    </span>
                ),
            },
            {
                header: "Duration",
                cell: ({ row }) => {
                    const start = row.original.start_date;
                    const end = row.original.end_date;
                    return (
                        <div className="text-xs">
                            <p className="text-gray-700">
                                Started: {start.split(" ")[0]}
                            </p>
                            <p className="text-gray-400 font-light">
                                Expires: {end.split(" ")[0]}
                            </p>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await listSubscribers();
            // Note: Adjust based on whether your API service returns the full JSON or just data
            const data = response.data || [];
            setSubscribers(data);
            setTotal(data.length);
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                onPaginationChange={setPagination}
            />
        </div>
    );
}
