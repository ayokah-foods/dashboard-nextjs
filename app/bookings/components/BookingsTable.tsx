"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentBookings } from "@/app/api_/bookings";
import StatusBadge from "@/utils/StatusBadge";
import { BookingResponse } from "@/types/BookingType";

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
                        <div className="flex items-center space-x-2">
                            <Avatar src={value?.photo || ""} alt={value?.name || "Customer"} />
                            <span>{value?.name ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Vendor",
                accessorKey: "vendor",
                cell: ({ getValue }) => {
                    const value = getValue() as BookingResponse["vendor"];
                    return (
                        <div className="flex items-center space-x-2">
                            <Avatar src={value?.photo || ""} alt={value?.name || "Vendor"} />
                            <span>{value?.name ?? "N/A"}</span>
                        </div>
                    );
                },
            },
            {
                header: "Service",
                accessorKey: "service",
                cell: ({ getValue }) => {
                    const value = getValue() as BookingResponse["service"];
                    return (
                        <div className="flex items-center space-x-2">
                            <Image
                                src={value?.image || ""}
                                alt={value?.title || "Service"}
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
                header: "Total",
                accessorKey: "total",
                cell: ({ getValue }) => {
                    const value = getValue() as string | number;
                    const numericValue = parseFloat(value as string);
                    return isNaN(numericValue)
                        ? "Invalid"
                        : `$${numericValue.toFixed(2)}`;
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
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
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
        []
    );


    const fetchBookings = useCallback(async (pageIndex: number, search: string) => {
        try {
            setLoading(true);
            const offset = pageIndex * pagination.pageSize;
            const response = await getRecentBookings(
                pagination.pageSize,
                offset,
                search,
                status
            );
            setBookings(response.bookings);
            setTotalBookings(response.total || 0);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching bookings.");
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize, status]);

    const debouncedFetchBookings = useMemo(
        () =>
            debounce((pageIndex: number, search: string) => {
                fetchBookings(pageIndex, search);
            }, 300),
        [fetchBookings]
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
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900 focus:outline-hub-primary-400"
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
