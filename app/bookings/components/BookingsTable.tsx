"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentBookings } from "@/lib/api/bookings";
import StatusBadge from "@/utils/StatusBadge";
import { BookingResponse } from "@/types/BookingType";
import { formatAmount } from "@/utils/formatCurrency";

interface BookingTableProps {
    limit: number;
    status?: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ limit, status }) => {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalBookings, setTotalBookings] = useState(0);

    const columns: ColumnDef<BookingResponse>[] = useMemo(
        () => [
            {
                header: "Customer",
                accessorKey: "customer",
                cell: ({ getValue }) => {
                    const value = getValue() as BookingResponse["customer"];
                    return (
                        <div className="flex items-center space-x-2 ">
                            <Avatar
                                src={value?.profile_photo || ""}
                                alt={value?.name || "Customer"}
                            />
                            <span
                                className="truncate max-w-40"
                                title={value?.name}
                            >
                                {value?.name ?? "N/A"}
                            </span>
                        </div>
                    );
                },
            },

            {
                header: "Service",
                accessorKey: "service",
                cell: ({ getValue }) => {
                    const value = getValue() as BookingResponse["service"];
                    const displayImage = Array.isArray(value?.images)
                        ? value.images[0]
                        : value?.images;
                    const serviceUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/items/${value?.slug}?type=services`;

                    return (
                        <div className="flex items-center space-x-2">
                            <a
                                href={serviceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <Image
                                    src={displayImage || "/placeholder.png"}
                                    alt={value?.title || "Service"}
                                    width={38}
                                    height={38}
                                    className="w-9 h-9 object-cover rounded-md border hover:opacity-80 transition-opacity"
                                />
                            </a>

                            <div className="flex flex-col">
                                <a
                                    href={serviceUrl}
                                    target="_blank"
                                    title={value?.title}
                                    rel="noopener noreferrer"
                                    className="font-medium text-sm text-gray-800 hover:text-hub-secondary/20 hover:underline transition-colors truncate max-w-30 mr-2"
                                >
                                    <span className="truncate max-w-20">
                                        {value?.title ?? "N/A"}
                                    </span>
                                </a>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Provider",
                accessorKey: "shop",
                cell: ({ getValue }) => {
                    const value = getValue() as BookingResponse["shop"];
                    const shopUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/shops/${value?.slug}`;

                    return (
                        <div className="flex items-center space-x-2 truncate">
                            {/* Wrap Avatar in the link */}
                            <a
                                href={shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <Image
                                    src={value?.logo || ""}
                                    alt={value?.name || "Vendor"}
                                    width={38}
                                    height={38}
                                    className="w-9 h-9 object-cover rounded-md border hover:opacity-80 transition-opacity"
                                />
                            </a>

                            {/* Wrap Name in the link */}
                            <a
                                href={shopUrl}
                                target="_blank"
                                title="View provider"
                                rel="noopener noreferrer"
                                className="font-medium text-sm text-gray-800 hover:text-hub-secondary/20 hover:underline transition-colors truncate"
                            >
                                {value?.name ?? "N/A"}
                            </a>
                        </div>
                    );
                },
            },
            {
                header: "Total",
                accessorKey: "amount",
                cell: ({ getValue }) => {
                    const value = getValue() as string | number;
                    const numericValue = parseFloat(value as string);
                    return isNaN(numericValue)
                        ? "Invalid"
                        : `${formatAmount(numericValue)}`;
                },
            },
            {
                header: "Delivery",
                accessorKey: "delivery_status",
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
                    const bookingId = getValue();
                    return (
                        <button
                            className="px-3 py-1 bg-hub-secondary text-white rounded hover:bg-hub-secondary cursor-pointer"
                            onClick={() => {
                                window.location.href = `/bookings/${bookingId}`;
                            }}
                        >
                            View Booking
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
        [],
    );

    const fetchBookings = useCallback(
        async (pageIndex: number, search: string) => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await getRecentBookings(
                    pagination.pageSize,
                    offset,
                    search,
                    status,
                );
                setBookings(response.bookings);
                setTotalBookings(response.total || 0);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching bookings.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, status],
    );

    const debouncedFetchBookings = useMemo(
        () =>
            debounce((pageIndex: number, search: string) => {
                fetchBookings(pageIndex, search);
            }, 300),
        [fetchBookings],
    );

    useEffect(() => {
        debouncedFetchBookings(pagination.pageIndex, search);
        return () => {
            debouncedFetchBookings.cancel();
        };
    }, [pagination.pageIndex, debouncedFetchBookings, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by customer or service name..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-hub-secondary text-gray-900 focus:outline-hub-primary-400"
                />
            </div>
            <TanStackTable
                data={bookings}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalBookings,
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

export default BookingTable;
