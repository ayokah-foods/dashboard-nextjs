"use client";

import React, { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { updateItemStatus } from "@/app/api_/products";
import TanStackTable from "@/app/components/commons/TanStackTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import StatusBadge from "@/utils/StatusBadge";
import toast from "react-hot-toast";
import { deleteCategory, getCategories } from "@/app/api_/categories";
import CategorySummary from "./CategorySummary";
import { CategoryType } from "@/types/CategoryType";
import { useCategoryStore } from "@/app/store/CategoryStore";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Drawer from "@/app/components/commons/Drawer";
import CategoryForm from "./CategoryForm";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";

interface CategoryTableProps {
    limit: number;
    type: string;
    status: string;
}

type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

function CategoryActionCell({
    category,
    onStatusUpdate,
    onEdit,
}: {
    category: CategoryType;
    onStatusUpdate: (newStatus: "active" | "inactive") => void;
    onEdit: (cat: CategoryType) => void;
}) {
    const [status, setStatus] = useState<Option>(
        statusOptions.find((opt) => opt.value === category.status) || statusOptions[0]
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

    const handleStatusChange = async (selected: Option) => {
        const previous = status;
        setStatus(selected);
        try {
            await updateItemStatus(category.id, selected.value);
            onStatusUpdate(selected.value as "active" | "inactive");
            toast.success("Category status updated.");
        } catch {
            setStatus(previous);
            toast.error("Failed to update category status.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(category.id);
            toast.success("Category deleted.");
            setIsModalOpen(false);
            window.location.reload();
        } catch {
            toast.error("Failed to delete category.");
        }
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <SelectDropdown
                    value={status}
                    options={statusOptions}
                    onChange={handleStatusChange}
                    className="w-auto min-w-[140px]"
                />

                <button
                    title="Update"
                    className="bg-yellow-500 text-white p-1.5 rounded-md hover:bg-yellow-600"
                    onClick={() => {
                        onEdit(category);
                    }}
                >
                    <PencilSquareIcon className="w-4 h-4" />
                </button>

                <button
                    title="Delete"
                    className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600"
                    onClick={() => setIsModalOpen(true)}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>

            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Deletion">
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this category? This action cannot be undone.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Proceed
                    </button>
                </div>
            </ConfirmationModal> 
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <CategoryForm
                    category={editingCategory ?? undefined}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                />
            </Drawer>
        </>
    );
}
const CategoriesTable: React.FC<CategoryTableProps> = ({ limit, type }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalCategories, setTotalCategories] = useState(0);
    const [itemStats, setItemStats] = useState({
        total_items: 0,
        total_active: 0,
        total_inactive: 0,
        total_service: 0,
        total_product: 0,
    });
    const { setCategories: saveToStore } = useCategoryStore();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

    const updateCategoryStatusInState = (id: number, newStatus: "active" | "inactive") => {
        setCategories((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
    };

    const columns: ColumnDef<CategoryType>[] = useMemo(
        () => [
            {
                header: "Category",
                accessorKey: "name",
                cell: ({ row }) => {
                    const { image, name, slug } = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <Image
                                src={image || "/placeholder.png"}
                                alt={name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800">{name}</span>
                                <span className="text-xs text-gray-500">{slug}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Description",
                accessorKey: "description",
                cell: ({ getValue }) => (
                    <span className="text-sm text-gray-700 truncate w-40 overflow-hidden whitespace-nowrap block">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                header: "Type",
                accessorKey: "type",
                cell: ({ getValue }) => (
                    <span className="capitalize text-sm text-gray-800">{getValue() as string}</span>
                ),
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ getValue }) => {
                    const status = getValue() as "active" | "inactive";
                    return <StatusBadge status={status} />;
                },
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return <span className="text-sm">{formatHumanReadableDate(value)}</span>;
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => {
                    const category = row.original;
                    return (
                        <CategoryActionCell
                            category={category}
                            onStatusUpdate={(newStatus) =>
                                updateCategoryStatusInState(category.id, newStatus)
                            }
                            onEdit={(cat) => {
                                setEditingCategory(cat);
                                setDrawerOpen(true);
                            }}
                        />
                    );
                },
            },
        ],
        []
    );

    const fetchCategories = useCallback(
        async (pageIndex: number, search: string = "") => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await getCategories(pagination.pageSize, offset, search, type);
                saveToStore(response.data);
                setCategories(response.data);
                setTotalCategories(response.total || 0);
                setItemStats(response.stats);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching categories.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, type, saveToStore]
    );

    const debouncedFetch = useMemo(() => {
        return debounce((pageIndex: number, search: string) => {
            fetchCategories(pageIndex, search);
        }, 300);
    }, [fetchCategories]);

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => {
            debouncedFetch.cancel();
        };
    }, [pagination.pageIndex, debouncedFetch, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };



    return (
        <div className="space-y-6">
            <CategorySummary loading={loading} stats={itemStats} />

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by category name..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
                />
            </div>

            <TanStackTable
                data={categories}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalCategories,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingCategory(null);
                }}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <CategoryForm
                    category={editingCategory ?? undefined}
                    onClose={() => {
                        setDrawerOpen(false);
                        setEditingCategory(null);
                    }}
                />
            </Drawer>


        </div>

    );


};



export default CategoriesTable;