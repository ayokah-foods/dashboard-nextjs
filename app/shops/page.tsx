'use client';

import { useEffect, useMemo, useState } from 'react';
import { Shop } from '@/types/ShopType';
import { ColumnDef } from '@tanstack/react-table';
import TanStackTable from '@/app/components/commons/TanStackTable';
import { getShops } from '../api_/shop';
import Image from 'next/image';
import StatusBadge from '@/utils/StatusBadge';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { debounce } from 'lodash';
import SelectDropdown from '../components/commons/Fields/SelectDropdown';
import { MetricCard } from './components/MetricCard';
import AnalysisAreaChart from './components/AnalysisAreaChart';

const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Products", value: "products" },
    { label: "Services", value: "services" },
];

export default function Shops() {
    const [data, setData] = useState<Shop[]>([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });

    const [selectedType, setSelectedType] = useState(typeOptions[0]);

    const fetchShops = async ({
        limit,
        offset,
        search,
        type,
    }: {
        limit: number;
        offset: number;
        search?: string;
        type?: string;
    }) => {
        setLoading(true);
        try {
            const res = await getShops({ limit, offset, search, type });
            setData(res.data);
            setTotal(res.total);
        } catch {
            setError('Failed to fetch shops.');
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(
        () =>
            debounce((params: { limit: number; offset: number; search?: string; type?: string }) => {
                fetchShops(params);
            }, 300),
        []
    );

    useEffect(() => {
        debouncedFetch({
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
            search,
            type: selectedType.value || undefined,
        });
    }, [pagination, search, selectedType, debouncedFetch]);

    const columns: ColumnDef<Shop>[] = useMemo(
        () => [
            {
                header: 'Shop',
                accessorKey: 'name',
                cell: ({ row }) => {
                    const { name, logo, type, category } = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            {logo && (
                                <div className="w-10 h-10 relative rounded-full overflow-hidden border">
                                    <Image src={logo} alt={name} fill className="object-cover" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-medium leading-tight">{name}</span>
                                <span className="text-xs text-gray-500 capitalize">
                                    {category?.name} | <b>{row.original.products_count}</b> {type}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: 'Vendor',
                accessorKey: 'vendor.name',
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    return (
                        <div className="text-sm">
                            <div className="font-medium text-gray-900">
                                {vendor?.name} {vendor?.last_name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {vendor?.city}, {vendor?.state}
                            </div>
                        </div>
                    );
                },
            },
            {
                header: 'Pickup Address',
                accessorKey: 'address',
                cell: ({ row }) => (
                    <span className="text-gray-600 text-sm">{row.original.address}</span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: ({ row }) => (
                    <span className="text-sm text-gray-500">
                        {formatHumanReadableDate(row.original.created_at)}
                    </span>
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

    const pageSizeOptions = [10, 20, 30, 50].map((size) => ({
        label: `${size} / page`,
        value: String(size),
    }));

    const currentPageSize = pageSizeOptions.find(
        (opt) => Number(opt.value) === pagination.pageSize
    ) || pageSizeOptions[0];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
                    <p className="text-gray-600 text-sm">Manage your vendor shops here.</p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search shops..."
                        className="w-full px-10 py-2 border border-amber-600 rounded-md text-gray-900 focus:outline-none focus:border-amber-600 focus:ring-0"
                        value={search}
                        onChange={(e) => {
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            setSearch(e.target.value);
                        }}
                    />
                    <SelectDropdown
                        options={pageSizeOptions}
                        value={currentPageSize}
                        onChange={(option) => {
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 0,
                                pageSize: Number(option.value),
                            }));
                        }}
                    />

                    <SelectDropdown
                        options={typeOptions}
                        value={selectedType}
                        onChange={(option) => {
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                            setSelectedType(option);
                        }}
                    />
                </div>
            </div>
            
            <MetricCard />
            
            <AnalysisAreaChart />
            
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
    );
}
