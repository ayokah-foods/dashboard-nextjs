"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Product, Stats } from "@/types/ProductType";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { getRecentProducts, updateItemStatus } from "@/lib/api_/products";
import StatusBadge from "@/utils/StatusBadge";
import ItemSummary from "./ItemSummary";
import { getStockBadgeClass } from "@/utils/StockBadge";
import {
    BuildingStorefrontIcon,
    EyeIcon,
    StarIcon,
} from "@heroicons/react/24/outline";
import ProductAreaChart from "./ProductAreaChart";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";
import { formatAmount } from "@/utils/formatCurrency";
import Link from "next/link";

interface ProductTableProps {
    limit: number;
    type: string;
    status: string;
}
type Option = { label: string; value: string };

const statusOptions: Option[] = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

function ProductActionCell({
    productId,
    initialStatus,
    onStatusUpdate,
}: {
    productId: number;
    initialStatus: string;
    onStatusUpdate: (newStatus: string) => void;
}) {
    const [status, setStatus] = useState<Option>(
        statusOptions.find((opt) => opt.value === initialStatus) ||
            statusOptions[0]
    );

    const handleStatusChange = async (selected: Option) => {
        const previous = status;
        setStatus(selected);
        try {
            await updateItemStatus(productId, selected.value);
            toast.success("Status updated");
            onStatusUpdate(selected.value);
        } catch {
            setStatus(previous);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <SelectDropdown
                value={status}
                options={statusOptions}
                onChange={handleStatusChange}
            />
        </div>
    );
}

const ItemsTable: React.FC<ProductTableProps> = ({ limit, type, status }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemStats, setItemStats] = useState<Stats>({
        total_items: 0,
        total_active: 0,
        total_inactive: 0,
        total_service: 0,
        total_product: 0,
    });

    const updateProductStatusInState = (
        id: number,
        newStatus: "active" | "inactive"
    ) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
    };

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: "Item & Rating",
                accessorKey: "title",
                cell: ({ row }) => {
                    const image = row.original.images?.[0];
                    const title = row.original.title;
                    const slug = row.original.slug;
                    const category = row.original.category?.name;
                    const rating: number = row.original.average_rating || 0;
                    const fullStars = Math.floor(rating);
                    const hasHalfStar = rating - fullStars >= 0.5;

                    return (
                        <div className="flex items-center space-x-2 min-w-0">
                            {/* Wrap the image and text in a Link */}
                            <Link
                                href={`/items/${slug}`}
                                className="flex items-center space-x-2 min-w-0 group"
                            >
                                <Image
                                    src={image || "/placeholder.png"}
                                    alt={title}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-cover rounded flex-shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="block text-xs font-medium text-gray-800 truncate group-hover:text-blue-600 group-hover:underline">
                                        {title}
                                    </span>
                                    {category && (
                                        <span className="block text-xs text-gray-500 truncate">
                                            {category}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-0.5 mt-1">
                                        {[...Array(5)].map((_, index) => {
                                            if (index < fullStars) {
                                                return (
                                                    <StarIcon
                                                        key={index}
                                                        className="w-3 h-3 text-yellow-500"
                                                    />
                                                );
                                            } else if (
                                                index === fullStars &&
                                                hasHalfStar
                                            ) {
                                                return (
                                                    <StarIcon
                                                        key={index}
                                                        className="w-3 h-3 text-yellow-300"
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <StarIcon
                                                        key={index}
                                                        className="w-3 h-3 text-gray-300"
                                                    />
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                },
            },

            {
                header: "Price",
                cell: ({ row }) => {
                    const salesPrice = parseFloat(
                        row.original.sales_price || "0"
                    );
                    const regularPrice = parseFloat(
                        row.original.regular_price || "0"
                    );

                    const formattedSales = `${formatAmount(salesPrice)}`;
                    const formattedRegular = `${formatAmount(regularPrice)}`;

                    return (
                        <div className="flex flex-col text-xs">
                            <span className="text-gray-800 font-semibold">
                                {formattedSales}
                            </span>
                            {salesPrice > 0 &&
                                regularPrice > 0 &&
                                salesPrice < regularPrice && (
                                    <span className="text-gray-500 line-through text-xs">
                                        {formattedRegular}
                                    </span>
                                )}
                        </div>
                    );
                },
            },

            {
                header: "Stock",
                accessorKey: "quantity",
                cell: ({ getValue }) => {
                    const quantity = getValue() as number;
                    const max = 100;
                    const stock = getStockBadgeClass(quantity, max);
                    return (
                        <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${stock.class}`}
                        >
                            {quantity} • {stock.level}
                        </span>
                    );
                },
            },
            {
                header: "Vendor",
                accessorKey: "vendor.name",
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    const type = row.original.type;

                    return vendor ? (
                        <div className="flex flex-col text-gray-700">
                            <div className="flex items-center gap-2">
                                <BuildingStorefrontIcon className="w-4 h-4 text-amber-600" />
                                <span>{vendor.name}</span>
                            </div>
                            <span className="text-xs text-gray-500 mt-0.5 ml-6">
                                {type === "services"
                                    ? "Service Provider"
                                    : "Product Seller"}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-400 italic">N/A</span>
                    );
                },
            },
            {
                header: "Views",
                accessorKey: "views",
                cell: ({ getValue }) => {
                    const views = getValue() as number;

                    return (
                        <div className="flex items-center gap-1 text-gray-700">
                            <EyeIcon className="w-4 h-4 text-amber-600" />
                            <span>{views}</span>
                        </div>
                    );
                },
            },

            {
                header: "Status",
                accessorKey: "status",
                cell: ({ getValue }) => {
                    const status = String(getValue() || "").toLowerCase();
                    return <StatusBadge status={status} />;
                },
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return formatHumanReadableDate(value);
                },
            },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <ProductActionCell
                        productId={row.original.id}
                        initialStatus={row.original.status}
                        onStatusUpdate={(newStatus) =>
                            updateProductStatusInState(
                                row.original.id,
                                newStatus as "active" | "inactive"
                            )
                        }
                    />
                ),
            },
        ],
        []
    );

    const fetchProducts = useCallback(
        async (pageIndex: number, search: string = "") => {
            try {
                setLoading(true);
                const offset = pageIndex * pagination.pageSize;
                const response = await getRecentProducts(
                    pagination.pageSize,
                    offset,
                    search,
                    type,
                    status
                );
                setProducts(response.data);
                setTotalProducts(response.total || 0);
                setItemStats(response.stats);
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching products.");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, type, status]
    );

    const debouncedFetchProducts = useMemo(() => {
        return debounce((pageIndex: number, search: string) => {
            fetchProducts(pageIndex, search);
        }, 300);
    }, [fetchProducts]);

    useEffect(() => {
        debouncedFetchProducts(pagination.pageIndex, search);
        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [pagination.pageIndex, debouncedFetchProducts, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="space-y-6">
            <ItemSummary loading={loading} stats={itemStats} />

            <ProductAreaChart type={type} status={status} />

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by product or vendor name..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
                />
            </div>

            <TanStackTable
                data={products}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalProducts,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />
        </div>
    );
};

export default ItemsTable;
