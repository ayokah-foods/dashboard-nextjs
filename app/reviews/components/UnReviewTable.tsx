"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listUnReviews } from "@/lib/api_/reviews";
import { User } from "@/types/UserType";
import ReviewType from "@/types/ReviewType";
import UnReviewOrderType from "@/types/UnReviewOrderType";
import Link from "next/link";
import { formatAmount } from "@/utils/formatCurrency";
import StatusBadge from "@/utils/StatusBadge";

interface ReviewTableProps {
    limit: number;
}

const UnReviewTable: React.FC<ReviewTableProps> = ({ limit }) => {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalReviews, setTotalReviews] = useState(0);

    const columns: ColumnDef<UnReviewOrderType>[] = useMemo(
        () => [
            {
                header: "Customer",
                accessorKey: "customer",
                cell: ({ getValue }) => {
                    const customer = getValue() as User;
                    return (
                        <div className="flex items-center space-x-2">
                            <Avatar
                                src={customer?.profile_photo ?? ""}
                                alt={customer?.name || "User"}
                            />
                            <span>
                                {customer?.name} {customer?.last_name}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: "Order",
                accessorKey: "id",
                cell: ({ getValue }) => {
                    const orderId = getValue() as number;
                    return (
                        <Link
                            href={`/orders/${orderId}`}
                            className="text-amber-600 font-medium hover:underline"
                        >
                            Order #{orderId}
                        </Link>
                    );
                },
            },
            {
                header: "Items",
                accessorKey: "items",
                cell: ({ getValue }) => {
                    const items = getValue() as UnReviewOrderType["items"];
                    return (
                        <span
                            className="truncate block max-w-xs"
                            title={items.length + " items"}
                        >
                            {items.length} product{items.length > 1 ? "s" : ""}
                        </span>
                    );
                },
            },
            {
                header: "Total",
                accessorKey: "total",
                cell: ({ getValue }) => {
                    const total = getValue() as string;
                    return (
                        <span className="font-semibold">
                            {formatAmount(total)}
                        </span>
                    );
                },
            },
            {
                header: "Shipping Status",
                accessorKey: "shipping_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} />;
                },
            },
            {
                header: "Payment Status",
                accessorKey: "payment_status",
                cell: ({ getValue }) => {
                    const value = String(getValue() ?? "N/A");
                    return <StatusBadge status={value} type="payment" />;
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

    const fetchReviews = useCallback(
        async (pageIndex: number) => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await listUnReviews(
                    pagination.pageSize,
                    offset
                );
                setReviews(response.data || []);
                setTotalReviews(response.total || 0);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching reviews.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize]
    );

    const debouncedFetchReviews = useMemo(
        () =>
            debounce((pageIndex: number) => {
                fetchReviews(pageIndex);
            }, 300),
        [fetchReviews]
    );

    useEffect(() => {
        debouncedFetchReviews(pagination.pageIndex);
        return () => {
            debouncedFetchReviews.cancel();
        };
    }, [pagination.pageIndex, debouncedFetchReviews, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div>
            <div className="mb-4">
                <input
                    hidden
                    type="text"
                    placeholder="Search by customer name or comment..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
                />
            </div>
            <TanStackTable
                data={reviews as unknown as UnReviewOrderType[]}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalReviews,
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

export default UnReviewTable;
