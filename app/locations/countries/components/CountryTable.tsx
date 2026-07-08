"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { TrashIcon } from "@heroicons/react/24/outline";
import { listCountries } from "@/lib/api/locations";
import Image from "next/image";
import { CountryType } from "@/types/LocationType";

type CountryTableProps = {
    limit: number;
    onDelete: (country: CountryType) => void;
};

const CountryTable: React.FC<CountryTableProps> = ({ limit, onDelete }) => {
    const [countries, setCountries] = useState<CountryType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    // Define table columns
    const columns: ColumnDef<CountryType>[] = useMemo(
        () => [
            {
                header: "Flag",
                accessorKey: "flag",
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Image
                            width={50}
                            height={50}
                            src={row.original.flag}
                            alt={`${row.original.name} flag`}
                            className="w-8 h-5 rounded border object-cover"
                        />
                    </div>
                ),
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Short Name",
                accessorKey: "short_name",
            },
            {
                header: "Dial Code",
                accessorKey: "dial_code",
            },
            {
                header: "Currency",
                accessorKey: "currency",
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

    // Fetch countries
    const fetchCountries = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listCountries(pageSize, offset);
            setCountries(response.data);
            setTotal(response.data?.length || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to load countries");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;

    useEffect(() => {
        fetchCountries(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={countries}
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

export default CountryTable;
