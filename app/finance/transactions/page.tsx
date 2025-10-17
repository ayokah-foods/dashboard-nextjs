'use client';

import { getTransactions } from "@/app/api_/transactions";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { Summary, Transaction, TransactionResponse } from "@/types/TransactionType";
import { formatAmount } from "@/utils/formatCurrency";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import StatusBadge from "@/utils/StatusBadge";
import { ArrowPathIcon, CheckCircleIcon, CurrencyDollarIcon, ExclamationTriangleIcon, EyeIcon, HandThumbDownIcon, PaperAirplaneIcon, ShieldCheckIcon, ShoppingBagIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import ViewTransactionModal from "../components/ViewTransactionModal";
import Skeleton from "react-loading-skeleton";
import { MetricCardProps } from "@/types/FinanceType";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summary, setSummary] = useState<Summary>();
    const fetchTransactions = useCallback(async (pageIndex: number, searchTerm: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: TransactionResponse = await getTransactions({
                limit: pagination.pageSize,
                offset: pageIndex * pagination.pageSize,
                search: searchTerm,
            });

            setTransactions(response.data);
            setSummary(response.summary);
            setTotalRows(Number(response.total));
        } catch {
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const debouncedFetch = useMemo(() => debounce(fetchTransactions, 300), [fetchTransactions]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => debouncedFetch.cancel();
    }, [pagination.pageIndex, search, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleView = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setIsModalOpen(true);
    };

    const columns: ColumnDef<Transaction>[] = useMemo(() => [
        {
            header: 'Receiver Name',
            accessorFn: (row) => `${row.transaction_data?.vendor?.name || "Bought"} ${row.transaction_data?.vendor?.last_name || row.type}`,
            cell: ({ getValue }) => <span>{getValue() as string}</span>,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ getValue }) => <span>{formatAmount(Number(getValue()))}</span>,
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ getValue }) => <span>{String(getValue())}</span>,
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
                </div>
            ),
        },
    ], []);

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                    <p className="text-sm text-gray-500">Monitor all vendor-related transactions.</p>
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

            {/* Status Summary Cards */}
            <h1 className="text-xl font-bold text-gray-600 mb-2">Status</h1>

            <div className="grid sm:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Total Pending"
                    icon={<EyeIcon className="w-6 h-6" />}
                    value={summary?.status.pending}
                    loading={loading}
                    color="blue"
                />
                <MetricCard
                    title="Total Cancelled"
                    icon={<XCircleIcon className="w-6 h-6" />}
                    value={summary?.status.cancelled}
                    loading={loading}
                    color="amber"
                />
                <MetricCard
                    title="Total Completed"
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    value={summary?.status.completed}
                    loading={loading}
                    color="green"
                />
                <MetricCard
                    title="Total Refunded"
                    icon={<ArrowPathIcon className="w-6 h-6" />}
                    value={summary?.status.refunded}
                    loading={loading}
                    color="yellow"
                />
                <MetricCard
                    title="Total Failed"
                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                    value={summary?.status.failed}
                    loading={loading}
                    color="red"
                />
                <MetricCard
                    title="Total Approved"
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    value={summary?.status.approved}
                    loading={loading}
                    color="green"
                />
                <MetricCard
                    title="Total Declined"
                    icon={<HandThumbDownIcon className="w-6 h-6" />}
                    value={summary?.status.declined}
                    loading={loading}
                    color="red"
                />
            </div>

            {/* Type Summary Cards */}
            <h1 className="text-xl font-bold text-gray-600 mb-2">Type</h1>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <MetricCard
                    title="Product Transactions"
                    icon={<ShoppingBagIcon className="w-6 h-6" />}
                    value={summary?.type.product}
                    loading={loading}
                    color="blue"
                />
                <MetricCard
                    title="Subscriptions"
                    icon={<CurrencyDollarIcon className="w-6 h-6" />}
                    value={summary?.type.subscription}
                    loading={loading}
                    color="gray"
                />
                <MetricCard
                    title="Withdrawals"
                    icon={<PaperAirplaneIcon className="w-6 h-6" />}
                    value={summary?.type.withdrawal}
                    loading={loading}
                    color="orange"
                />
            </div>


            <TanStackTable
                data={transactions}
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

            {isModalOpen && selectedTransaction && (
                <ViewTransactionModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTransaction(null);
                    }}
                    transaction={selectedTransaction}
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