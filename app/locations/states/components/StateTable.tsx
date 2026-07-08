"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { TrashIcon } from "@heroicons/react/24/outline";
import { listStates } from "@/lib/api/locations";
import { StateType } from "@/types/LocationType";

type StateTableProps = {
    limit: number;
    onDelete: (state: StateType) => void;
};

const StateTable: React.FC<StateTableProps> = ({ limit, onDelete }) => {
    const [states, setStates] = useState<StateType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<StateType>[] = useMemo(
        () => [
            {
                header: "Province Name",
                accessorKey: "name",
            },
            {
                header: "Country",
                accessorFn: (row) => row.country?.name || "—",
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
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
        [onDelete],
    );

    const fetchStates = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listStates(pageSize, offset);
            setStates(response.data || []);
            setTotal(response.data.length);
        } catch (err) {
            console.error(err);
            setError("Failed to load states");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;

    useEffect(() => {
        fetchStates(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={states}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex,
                    pageSize,
                    totalRows: total,
                }}
                onPaginationChange={(newPagination) =>
                    setPagination(newPagination)
                }
            />
        </div>
    );
};

export default StateTable;
