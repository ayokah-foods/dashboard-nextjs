"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listReviews } from "@/app/api_/reviews";
import ReviewType from "@/types/ReviewType";
import Image from "next/image";
import Link from "next/link";
interface ReviewTableProps {
    limit: number;
}

const ReviewTable: React.FC<ReviewTableProps> = ({ limit }) => {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalReviews, setTotalReviews] = useState(0);

    const columns: ColumnDef<ReviewType>[] = useMemo(
        () => [
            {
                header: "Customer",
                accessorKey: "user",
                cell: ({ getValue }) => {
                    const value = getValue() as ReviewType["user"] | null;
                    return (
                        <div className="flex items-center space-x-2">
                            <Avatar
                                src={value?.profile_photo ?? ""}
                                alt={value?.name || "User"}
                            />
                            <span>
                                {value?.name} {value?.last_name}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: "Product",
                accessorKey: "product",
                cell: ({ getValue }) => {
                    const product = getValue() as ReviewType["product"] | null;
                    return (
                        <div className="flex items-center space-x-2">
                            {product?.images?.[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-cover rounded"
                                />
                            )}
                            <span className="truncate max-w-xs">{product?.title ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Comment",
                accessorKey: "comment",
                cell: ({ getValue }) => {
                    const comment = getValue() as string;
                    return (
                        <div
                            className="w-64 h-20 overflow-auto text-gray-800 whitespace-normal p-2   rounded bg-gray-50"
                        >
                            {comment}
                        </div>
                    );
                },
            },

            {
                header: "Order",
                accessorKey: "order_id",
                cell: ({ getValue }) => {
                    const orderId = getValue() as number;
                    return (
                        <Link
                            href={`/orders/${orderId}`}
                            className="text-amber-600 font-medium hover:underline"
                        >
                            #{orderId}
                        </Link>
                    );
                },
            },
            {
                header: "Rating",
                accessorKey: "rating",
                cell: ({ getValue }) => {
                    const rating = Number(getValue());
                    return (
                        <span className="text-yellow-600 font-semibold">{rating} / 5</span>
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


    const fetchReviews = useCallback(
        async (pageIndex: number) => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await listReviews(
                    pagination.pageSize,
                    offset,
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
                <input hidden
                    type="text"
                    placeholder="Search by customer name or comment..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
                />
            </div>
            <TanStackTable
                data={reviews}
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

export default ReviewTable;
