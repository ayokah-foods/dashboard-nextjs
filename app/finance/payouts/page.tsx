'use client';

import { getPayoutRequests } from '@/app/api_/finance';
import { MetricCardProps, PayoutItem, PayoutRequest } from '@/types/FinanceType';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { formatAmount } from '@/utils/formatCurrency';
import { EyeIcon, TrashIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';
import TanStackTable from '@/app/components/commons/TanStackTable';
import StatusBadge from '@/utils/StatusBadge';
import ViewPayoutModal from '../components/ViewPayoutModal';
import Skeleton from 'react-loading-skeleton';

export default function PayoutRequests() {
    const [payouts, setPayouts] = useState<PayoutItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);

    const [summary, setSummary] = useState<{ total_payout: number; pending_payout: string }>({
        total_payout: 0,
        pending_payout: '0',
    });

    const fetchPayouts = useCallback(async (pageIndex: number, searchTerm: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: PayoutRequest = await getPayoutRequests(
                pagination.pageSize,
                pageIndex * pagination.pageSize,
                searchTerm
            );
            setPayouts(response.data);
            setTotalRows(response.total);

            if (response.summary) {
                setSummary(response.summary);
            }
        } catch {
            setError('Failed to fetch payout requests');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const debouncedFetch = useMemo(() => debounce(fetchPayouts, 300), [fetchPayouts]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => debouncedFetch.cancel();
    }, [pagination.pageIndex, search, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleDelete = (id: number) => {
        setPayouts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleView = (payout: PayoutItem) => {
        setSelectedPayout(payout);
        setIsModalOpen(true);
    };

    const refetchPayouts = () => {
        fetchPayouts(pagination.pageIndex, search);
    };


    const columns: ColumnDef<PayoutItem>[] = useMemo(() => [
        {
            header: 'Vendor Name',
            accessorFn: (row) => `${row.vendor.name} ${row.vendor.last_name}`,
            cell: ({ getValue }) => <span>{getValue() as string}</span>,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ getValue }) => <span>{formatAmount(Number(getValue()))}</span>,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = String(getValue() || "").toLowerCase();
                return <StatusBadge status={status} />;
            },
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            cell: ({ getValue }) => formatHumanReadableDate(getValue() as string),
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: ({ row }) => (
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => handleView(row.original)}
                        className="text-blue-600 bg-blue-100 p-1 rounded-lg hover:text-blue-800"
                        title="View"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="text-red-600 bg-red-100 p-1 rounded-lg hover:text-red-800"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payout Requests</h1>
                    <p className="text-sm text-gray-500">Manage your vendor payout requests here.</p>
                </div>

                <div className="w-78">
                    <input
                        type="text"
                        placeholder="Search by vendor name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="mb-4 w-full max-w-sm text-gray-800 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <MetricCard
                    title="Total Payout Requests"
                    icon={<EyeIcon className="w-6 h-6" />}
                    value={payouts.length}
                    loading={loading}
                    color="blue"
                />
                <MetricCard
                    title="Pending Payout"
                    icon={<BanknotesIcon className="w-6 h-6" />}
                    value={formatAmount(Number(summary.pending_payout))}
                    loading={loading}
                    color="amber"
                />
                <MetricCard
                    title="Total Paid out"
                    icon={<BanknotesIcon className="w-6 h-6" />}
                    value={formatAmount(Number(summary.total_payout))}
                    loading={loading}
                    color="green"
                />
            </div>

            <TanStackTable
                data={payouts}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalRows,
                }}
                onPaginationChange={(updated) =>
                    setPagination({ pageIndex: updated.pageIndex, pageSize: updated.pageSize })
                }
            />

            {isModalOpen && selectedPayout && (
                <ViewPayoutModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedPayout(null);
                    }}
                    payout={selectedPayout}
                    onStatusUpdated={refetchPayouts}  
                />
            )}

        </>
    );
}



function MetricCard({ title, value, icon, loading, color }: MetricCardProps) {
    const bg = `bg-${color}-100`;
    const text = `text-${color}-600`;

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
            <div className={`${bg} ${text} p-2 rounded-full`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-950">
                    {loading ? <Skeleton width={80} height={28} /> : value ?? 0}
                </p>
            </div>
        </div>
    );
}
