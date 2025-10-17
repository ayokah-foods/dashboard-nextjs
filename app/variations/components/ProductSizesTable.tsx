"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Sizes} from "@/types/SizeType";
import { listSizes } from "@/app/api_/sizes";

type SizeProps = {
    limit: number;
    onDelete: (size: Sizes) => void;
};

const ProductSizesTable: React.FC<SizeProps> = ({ limit, onDelete }) => {
    const [sizes, setSizes] = useState<Sizes[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<Sizes>[] = useMemo(
        () => [
            {
                header: "Size name",
                accessorKey: "name",
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

    const fetchSizes = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listSizes(pageSize, offset);
            setSizes(response.data);
            setTotal(response.total);
        } catch (err) {
            console.error(err);
            setError("Failed to load sizes");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;
    useEffect(() => {
        fetchSizes(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={sizes}
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
        </div>
    );
};

export default ProductSizesTable;
