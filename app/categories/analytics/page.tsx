'use client';

import { useEffect, useMemo, useState } from "react";
import { categoryAnalytics } from "@/app/api_/categories";
import { CategoryAnalyticsItem, CategoryAnalyticsType } from "@/types/CategoryType";
import { CubeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Analytics() {
    const [data, setData] = useState<CategoryAnalyticsItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response: CategoryAnalyticsType = await categoryAnalytics({
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize,
                });
                setData(response.data);
                setTotal(response.total);
            } catch {
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [pagination]);

    const columns: ColumnDef<CategoryAnalyticsItem>[] = useMemo(
        () => [
            {
                header: "Category Name",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span className="text-gray-800 font-medium">{row.original.name}</span>
                ),
            }, 
            {
                header: "Type",
                accessorKey: "type",
                cell: ({ row }) => {
                    const type = row.original.type;
                    const isProduct = type === "products";
                    const Icon = isProduct ? CubeIcon : WrenchScrewdriverIcon;

                    return (
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <Icon className="w-4 h-4 text-amber-600" />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    );
                },
            },
            {
                header: "Sales Count",
                accessorKey: "total_sales_count",
                cell: ({ row }) => (
                    <span className="text-gray-900">{row.original.total_sales_count}</span>
                ),
            },
            {
                header: "Sales Amount",
                accessorKey: "total_sales_amount",
                cell: ({ row }) => (
                    <span className="text-gray-900">
                        {parseFloat(row.original.total_sales_amount).toLocaleString()}
                    </span>
                ),
            },
            {
                header: "Total Orders",
                accessorKey: "total_orders",
                cell: ({ row }) => (
                    <span className="text-gray-900">{row.original.total_orders}</span>
                ),
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/categories/${row.original.slug}`}
                            className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 flex items-center gap-1"
                        >
                            <EyeIcon className="w-4 h-4" />
                            View
                        </Link>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-950">Most selling categories</h1>
            <p className="text-gray-700 text-sm mb-6">Manage your selling categories here.</p>

            <div className="space-y-6">
                <TanStackTable
                    data={data}
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
        </div>
    );
}
