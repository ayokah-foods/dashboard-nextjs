"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { OrderResponse } from "@/types/OrderType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentOrders } from "@/app/api_/orders";
import StatusBadge from "@/utils/StatusBadge";

interface OrderTableProps {
    limit: number;
    status?: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ limit, status }) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalOrders, setTotalOrders] = useState(0);

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
                    return <StatusBadge status={value} type={"payment"} />;
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

    const fetchOrders = useCallback(async (pageIndex: number, search: string) => {
        try {
            setLoading(true);
            const offset = pageIndex * pagination.pageSize;
            const response = await getRecentOrders(
                pagination.pageSize,
                offset,
                search,
                status
            );
            setOrders(response.orders);
            setTotalOrders(response.total || 0);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching orders.");
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, status]);

    const debouncedFetchOrders = useMemo(
        () =>
            debounce((pageIndex: number, search: string) => {
                fetchOrders(pageIndex, search);
            }, 300),
        [fetchOrders]
    );

    useEffect(() => {
        debouncedFetchOrders(pagination.pageIndex, search);
        return () => {
            debouncedFetchOrders.cancel();
        };
    }, [pagination.pageIndex, debouncedFetchOrders, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by customer or product name..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900 focus:outline-hub-primary-400"
                />
            </div>
            <TanStackTable
                data={orders}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalOrders,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />
        </div>
    );
};

export default OrderTable;
