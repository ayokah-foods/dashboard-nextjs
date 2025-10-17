'use client';

import { useEffect, useMemo, useState } from "react";
import { CubeIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { mostSellingShops } from "@/app/api_/shop";
import { ShopPerformanceItem, ShopPerformanceType } from "@/types/ShopType";
import Image from "next/image";
import { formatAmount } from "@/utils/formatCurrency";

export default function ShopPerformance() {
    const [data, setData] = useState<ShopPerformanceItem[]>([]);
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
                const response: ShopPerformanceType = await mostSellingShops({
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

    const columns: ColumnDef<ShopPerformanceItem>[] = useMemo(
        () => [
            {
                header: "Logo",
                accessorKey: "logo",
                cell: ({ row }) => (
                    <Image
                        width={50}
                        height={50}
                        src={row.original.logo ?? "/placeholder.png"}
                        alt="Logo"
                        className="h-8 w-8 object-cover rounded-full"
                    />
                ),
            },
            {
                header: "Shop Name",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span className="text-gray-800 font-medium">{row.original.name}</span>
                ),
            },
            {
                header: "Vendor",
                accessorKey: "vendor_name",
                cell: ({ row }) => (
                    <span className="text-gray-700">{row.original.vendor_name}</span>
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
                        {formatAmount(row.original.total_sales_amount)}
                    </span>
                ),
            },
            {
                header: "Orders",
                accessorKey: "total_orders",
                cell: ({ row }) => (
                    <span className="text-gray-900">{row.original.total_orders}</span>
                ),
            },
            {
                header: "Sales %",
                accessorKey: "sales_percentage",
                cell: ({ row }) => (
                    <span className="text-gray-700">{row.original.sales_percentage.toFixed(2)}%</span>
                ),
            },
            {
                header: 'Action',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <Link
                        href={`/shops/${row.original.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
                    >
                        View
                        {/* lead to frontend web app */}
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </Link>
                ),
            },
        ],
        []
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-950">Top Performing Shops</h1>
            <p className="text-gray-700 text-sm mb-6">Review the top shops by sales performance.</p>

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
