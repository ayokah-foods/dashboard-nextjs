"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listSubCategories } from "@/app/api_/categories";
import { CategoryType, FlattenedSubCategory } from "@/types/CategoryType";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

type SubcategoryProps = {
    limit: number;
    type: string;
    onEdit: (category: FlattenedSubCategory) => void;
    onDelete: (category: FlattenedSubCategory) => void;


};

type FetchArgs = {
    offset: number;
    pageSize: number;
    searchTerm: string;
    type: string;
};

const SubCategoriesTable: React.FC<SubcategoryProps> = ({ limit, type, onEdit, onDelete }) => {
    const [categories, setSubCategories] = useState<FlattenedSubCategory[]>([]);

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });


    const columns: ColumnDef<FlattenedSubCategory>[] = useMemo(
        () => [
            {
                header: "Subcategory",
                accessorKey: "name",
                cell: ({ row }) => (
                    <span className="text-gray-800 font-medium">{row.original.name}</span>
                ),
            },
            {
                header: "Parent Category",
                accessorKey: "parent_name",
                cell: ({ row }) => (
                    <span className="text-sm text-gray-700">
                        {row.original.parent_name ?? "N/A"}
                    </span>
                ),
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onEdit(row.original)}
                            className="bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600"
                        >
                            <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(row.original)}
                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ),
            }
        ],
        [onEdit, onDelete]
    );

    // ✅ Async fetch function
    const fetchSubCategories = async ({ offset, pageSize, searchTerm, type }: FetchArgs) => {
        try {
            setLoading(true);
            const response = await listSubCategories(pageSize, offset, searchTerm, type);

            const flattened: FlattenedSubCategory[] = response.data.flatMap((parent: CategoryType) =>
                (parent.children || []).map((child: CategoryType) => ({
                    ...child,
                    parent_name: parent.name,
                    parent_id: parent.id,
                    parent_slug: parent.slug,
                }))
            );

            setSubCategories(flattened);
            setTotal(response.total || flattened.length);
        } catch (err) {
            console.error(err);
            setError("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(
        () => debounce((args: FetchArgs) => fetchSubCategories(args), 1000),
        []
    );

    const { pageIndex, pageSize } = pagination;
    useEffect(() => {
        debouncedFetch({
            offset: pageIndex * pageSize,
            pageSize,
            searchTerm: search,
            type,
        });

        return () => {
            debouncedFetch.cancel();
        };
    }, [pageIndex, pageSize, search, type, debouncedFetch]);

    return (
        <div className="space-y-6">
            <input
                type="text"
                placeholder="Search by subcategory name..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="w-full px-3 py-2 border border-amber-600 rounded-md text-gray-900"
            />

            <TanStackTable
                data={categories}
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

export default SubCategoriesTable;
