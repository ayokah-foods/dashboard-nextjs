'use client';
import { getCommissionRevenues } from '@/app/api_/finance';
import TanStackTable from '@/app/components/commons/TanStackTable';
import { CommissionRevenueItem, CommissionRevenuesType } from '@/types/CommissionRevenueType';
import { MetricCardProps } from '@/types/FinanceType';
import { formatAmount } from '@/utils/formatCurrency';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';
import { EyeIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton';
import ViewRevenuesModal from '../components/ViewRevenuesModal';
import { CurrencyDollarIcon } from '@heroicons/react/20/solid';

export default function Revenues() {
    const [revenues, setRevenues] = useState<CommissionRevenueItem[]>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [totalRows, setTotalRows] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRevenue, setselectedRevenue] = useState<CommissionRevenueItem | null>(null);

    const fetchRevenues = useCallback(async (pageIndex: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: CommissionRevenuesType = await getCommissionRevenues(
                pagination.pageSize,
                pageIndex * pagination.pageSize,
            );
            setRevenues(response.data);
            setTotalRows(response.total);

            if (response.total_revenue) {
                setTotalRevenue(response.total_revenue);
            }

        } catch {
            setError('Failed to fetch payout requests');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        fetchRevenues(pagination.pageIndex);
    }, [pagination.pageIndex, fetchRevenues]);

    const handleView = (revenues: CommissionRevenueItem) => {
        setselectedRevenue(revenues);
        setIsModalOpen(true);
    };

    const columns: ColumnDef<CommissionRevenueItem>[] = useMemo(() => [
        {
            header: 'Source',
            accessorKey: 'source',
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ getValue }) => <span>{formatAmount(Number(getValue()))}</span>,
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

                </div>
            ),
        },
    ], []);


    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Commission Revenues</h1>
                    <p className="text-sm text-gray-500">Manage your commission revenues here.</p>
                </div>

                <div className="w-78">

                </div>

            </div>
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-1 gap-4 mb-6">
                <MetricCard
                    title="Total Revenue"
                    icon={<CurrencyDollarIcon className="w-6 h-6" />}
                    value={formatAmount(totalRevenue)}
                    loading={loading}
                    color="green"
                />

            </div>

            <TanStackTable
                data={revenues}
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

            {isModalOpen && selectedRevenue && (
                <ViewRevenuesModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setselectedRevenue(null);
                    }}
                    revenue={selectedRevenue}
                />
            )}
        </>
    )
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
