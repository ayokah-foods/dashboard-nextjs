'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CommissionFormType } from '@/types/CommissionFormType';
import { deleteCommission, getCommissions } from '@/app/api_/commissions';
import { ColumnDef } from '@tanstack/react-table';
import TanStackTable from '@/app/components/commons/TanStackTable';
import Drawer from '@/app/components/commons/Drawer';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import CommissionForm from '../components/CommissionForm';
import ConfirmationModal from '@/app/components/commons/ConfirmationModal';

export default function Commission() {
    const [commissions, setCommissions] = useState<CommissionFormType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState<CommissionFormType | null>(null);
    const [total, setTotal] = useState(0);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);


    const fetchCommissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCommissions();
            setCommissions(response.data);
            setTotal(response.data.length);
        } catch {
            setError('Failed to fetch commissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCommission(id);
            toast.success("Commission deleted");
            fetchCommissions();
        } catch {
            toast.error("Failed to delete commission");
        }
    };


    const handleEdit = (row: CommissionFormType) => {
        setSelectedCommission(row);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedCommission(null);
    };

    const columns: ColumnDef<CommissionFormType>[] = useMemo(() => [
        {
            header: 'Type',
            accessorFn: (row) => row.type,
            cell: ({ getValue }) => {
                const value = getValue() as string;
                return <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>;
            },
        },
        {
            header: 'Rate',
            accessorKey: 'rate',
            cell: ({ getValue }) => <span>{Number(getValue())}%</span>,
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <button
                        className="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(row.original)}
                        title="Edit"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                        onClick={() => setConfirmDeleteId(row.original.id)}
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>

                </div>
            ),
        },
    ], []);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const { pageIndex, pageSize } = pagination;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800"> Commission Rates</h1>
                    <p className="text-sm text-gray-600">Manage your commission rates here.</p>
                </div>

                <button
                    onClick={() => {
                        setSelectedCommission(null);
                        setDrawerOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Commission
                </button>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={selectedCommission ? 'Edit Commission Rate' : 'Add Commission Rate'}
            >
                <CommissionForm
                    initialData={selectedCommission}
                    onClose={handleCloseDrawer}
                    onSuccess={fetchCommissions}
                />
            </Drawer>

            <TanStackTable
                data={commissions}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex,
                    pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) => setPagination(newPagination)}

            />

            <ConfirmationModal
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                title="Confirm Deletion"
            >
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this commission? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 text-gray-500">
                    <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (confirmDeleteId !== null) {
                                await handleDelete(confirmDeleteId);
                                setConfirmDeleteId(null);
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
}