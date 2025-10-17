"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { OrderResponse } from "@/types/OrderType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentOrders } from "@/app/api_/orders";
import StatusBadge from "@/utils/StatusBadge";
import Link from "next/link";

interface RecentOrdersTableProps {
    limit: number;   
    status?: string;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ limit }) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const columns: ColumnDef<OrderResponse>[] = useMemo(
        () => [
            {
                header: "Customer",
                accessorKey: "user",
                cell: ({ getValue }) => {
                    const value = getValue() as { name: string; photo: string } | null;
                    return (
                        <div className="flex items-center space-x-2">
                            <Avatar src={value?.photo} alt={value?.name || "User"} />
                            <span>{value?.name ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Item",
                accessorKey: "product",
                cell: ({ getValue }) => {
                    const value = getValue() as { title: string; image: string } | null;
                    return (
                        <div className="flex items-center space-x-2">
                            <Image
                                src={value?.image || ""}
                                alt={value?.title || "Product"}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <span>{value?.title ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Subtotal",
                accessorKey: "subtotal",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    const numericValue = parseFloat(value);
                    return isNaN(numericValue)
                        ? "Invalid"
                        : `$${numericValue.toFixed(2)}`;
                },
            },
            {
                header: "Quantity",
                accessorKey: "quantity",
            },
            {
                header: "Shipping",
                accessorKey: "shipping_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} />;
                },
            },
            {
                header: "Payment",
                accessorKey: "payment_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} type="payment" />;
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ getValue }) => {
                    const orderId = getValue();
                    return (
                        <button
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
                            onClick={() => {
                                window.location.href = `/orders/${orderId}`;
                            }}
                        >
                            View Order
                        </button>
                    );
                },
            },
            {
                header: "Date",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return formatHumanReadableDate(value);
                },
            },
        ],
        []
    );

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getRecentOrders(limit, 0);  
            setOrders(response.orders);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold text-gray-900">Recent orders</p>
                <Link href="/orders" className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-600 hover:text-amber-50 py-2 px-4 rounded">
                    See all
                </Link>
            </div>
            <TanStackTable
                data={orders}
                columns={columns}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default RecentOrdersTable;
