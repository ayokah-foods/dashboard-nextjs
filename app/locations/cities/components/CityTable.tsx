"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { TrashIcon } from "@heroicons/react/24/outline";
import { listCities } from "@/lib/api_/locations";
import { CityType } from "@/types/LocationType";

type CityTableProps = {
    limit: number;
    onDelete: (city: CityType) => void;
};

const CityTable: React.FC<CityTableProps> = ({ limit, onDelete }) => {
    const [cities, setCities] = useState<CityType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<CityType>[] = useMemo(
        () => [
            {
                header: "City Name",
                accessorKey: "name",
            },
            {
                header: "Province",
                accessorFn: (row) => row.state?.name || "—",
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
        [onDelete]
    );

    const fetchCities = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listCities(pageSize, offset);
            setCities(response.data || []);
            setTotal(response.data.length);
        } catch (err) {
            console.error(err);
            setError("Failed to load cities");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;

    useEffect(() => {
        fetchCities(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={cities}
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

export default CityTable;
