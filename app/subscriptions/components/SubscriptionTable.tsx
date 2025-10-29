"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { listSubscriptions } from "@/app/api_/subscriptions";
import { SubscriptionType } from "@/types/SubscriptionType";
import TanStackTable from "@/app/components/commons/TanStackTable";

type SubscriptionTableProps = {
    limit: number;
    onDelete: (subscription: SubscriptionType) => void;
    onEdit?: (subscription: SubscriptionType) => void;
};

export default function SubscriptionTable({
    limit,
    onDelete,
    onEdit,
}: SubscriptionTableProps) {
    const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<SubscriptionType>[] = useMemo(
        () => [
            {
                header: "Plan Name",
                accessorKey: "name",
            },
            {
                header: "Monthly Price",
                accessorFn: (row) => `KES ${row.monthly_price?.toLocaleString() || 0}`,
            },
            {
                header: "Yearly Price",
                accessorFn: (row) => `KES ${row.yearly_price || "—"}`,
            },
            {
                header: "Features",
                accessorFn: (row) =>
                    row.features?.length > 60
                        ? `${row.features.substring(0, 60)}...`
                        : row.features || "—",
            },
            {
                header: "Payment Link",
                accessorFn: (row) =>
                    row.payment_link ? (
                        <a
                            href={row.payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 underline hover:text-amber-700"
                        >
                            Open Link
                        </a>
                    ) : (
                        "—"
                    ),
            },
            {
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(row.original)}
                                className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(row.original)}
                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [onDelete, onEdit]
    );

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await listSubscriptions();
            setSubscriptions(response.data || []);
            setTotal(response.data.length || 0);
        } catch (err) {
            console.error(err);
            setError("Nothing to show");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={subscriptions}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) => setPagination(newPagination)}
            />
        </div>
    );
}
