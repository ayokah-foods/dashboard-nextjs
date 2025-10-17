'use client';

import { getSettlementAccounts } from "@/app/api_/finance";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { SettlementAccountItem, SettlementAccountType } from "@/types/SettlementAccountType";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

export default function SettlementAccounts() {
    const [settlementAccounts, setSettlementAccounts] = useState<SettlementAccountItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState('');

    const fetchSettlementAccounts = useCallback(async (pageIndex: number, searchTerm: string) => {
        setLoading(true);
        setError(null);
        try {
            const response: SettlementAccountType = await getSettlementAccounts(
                pagination.pageSize,
                pageIndex * pagination.pageSize,
                searchTerm
            );
            setSettlementAccounts(response.data);
            setTotalRows(response.total);
        } catch {
            setError('Failed to fetch settlement accounts');
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    const debouncedFetch = useMemo(() => debounce(fetchSettlementAccounts, 300), [fetchSettlementAccounts]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => debouncedFetch.cancel();
    }, [pagination.pageIndex, search, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const columns: ColumnDef<SettlementAccountItem>[] = useMemo(() => [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Institution Number',
            accessorKey: 'institution_number',
        },
        {
            header: 'Transit Number',
            accessorKey: 'transit_number',
        },
        {
            header: 'Account Number',
            accessorKey: 'account_number',
        },
        {
            header: 'Account Name',
            accessorKey: 'account_name',
        }, 
        {
            header: 'Vendor Name',
            accessorKey: 'user.name',
        }, 
    ], []);

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Settlement Accounts</h1>
                    <p className="text-sm text-gray-500">Manage your settlement accounts here.</p>
                </div>

                <div className="w-78">
                    <input
                        type="text"
                        placeholder="Search by account name or number..."
                        value={search}
                        onChange={handleSearchChange}
                        className="mb-4 w-full max-w-sm text-gray-800 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                </div>
            </div>

            <TanStackTable
                data={settlementAccounts}
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
        </>
    );
}
