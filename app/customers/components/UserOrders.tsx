"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserOrder } from "@/app/api_/users";
import { Order } from "@/types/OrderType";
import { ColumnDef } from "@tanstack/react-table";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import TanStackTable from "@/app/components/commons/TanStackTable";
import Image from "next/image";
import StatusBadge from "@/utils/StatusBadge";
import { debounce } from "lodash";
import TableSkeleton from "@/app/components/Skeletons/TableSkeleton";

interface UserOrdersProps {
    userId: string;
    type?: string;
}

export default function UserOrders({ userId, type }: UserOrdersProps) {
    const [cartItems, setCartItems] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [searchInput, setSearchInput] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20, });
    const [totalOrders, setTotalOrders] = useState(0);

    const router = useRouter();

    const debouncedSearch = useMemo(() => debounce((value: string) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500), [setSearch]);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        debouncedSearch(val);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const offset = pagination.pageIndex * pagination.pageSize;
                const response = await getUserOrder(
                    pagination.pageSize,
                    offset,
                    search,
                    type,
                    userId
                );
                setCartItems(response.data ?? []);
                setTotalOrders(response.total ?? 0);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch customer orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [pagination.pageIndex, pagination.pageSize, search, userId, type]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const columns: ColumnDef<Order>[] = [
        {
            header: "Item",
            accessorKey: "product.title",
            cell: ({ row }) => {
                const product = row.original?.product;

                return (
                    <div className="flex items-center gap-3">
                        <Image
                            width={40}
                            height={40}
                            src={product?.images?.[0] || "/no-image.png"}
                            alt={product?.title}
                            className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div>
                            <div className="font-medium text-sm text-gray-800">
                                {product?.title ?? "Unnamed Product"}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Qty",
            accessorKey: "quantity",
        },
        {
            header: "Unit Price",
            accessorKey: "price",
            cell: ({ getValue }) =>
                `$${parseFloat(String(getValue() ?? "0")).toFixed(2)}`,
        },
        {
            header: "Subtotal",
            accessorKey: "subtotal",
            cell: ({ getValue }) =>
                `$${parseFloat(String(getValue() ?? "0")).toFixed(2)}`,
        },
        {
            header: "Order Status",
            accessorKey: "order.shipping_status",
            cell: ({ getValue }) => {
                const value = String(getValue() ?? "N/A");
                return <StatusBadge status={value} />;
            },
        },
        {
            header: "Payment Status",
            accessorKey: "order.payment_status",
            cell: ({ getValue }) => {
                const value = String(getValue() ?? "N/A");
                return <StatusBadge status={value} type={"payment"} />;
            },
        },
        {
            header: "Vendor Payout",
            accessorKey: "order.vendor_payment_settlement_status",
            cell: ({ getValue }) => {
                const value = String(getValue() ?? "N/A");
                return <StatusBadge status={value} type={"payment"} />;
            },
        },
        {
            header: "Date",
            accessorKey: "created_at",
            cell: ({ getValue }) => {
                const val = getValue();
                return (
                    <span className="text-sm text-gray-500">
                        {typeof val === "string" ? formatHumanReadableDate(val) : "N/A"}
                    </span>
                );
            },
        },
        {
            header: "Action",
            accessorKey: "id",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 text-indigo-600 cursor-pointer">
                        <button onClick={() => router.push(`/orders/${row.original.id}`)} className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer">
                            View
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>

            {loading && <TableSkeleton columns={columns.length} rows={5} />}

            {!loading && (
                <>
                    {cartItems && cartItems.length > 0 ? (
                        <>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by name, or order id..."
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                    className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900 focus:outline-none focus:ring-0 focus:border-amber-400"
                                />
                            </div>

                            <TanStackTable
                                data={cartItems}
                                columns={columns}
                                loading={loading}
                                error={error}
                                pagination={{
                                    pageIndex: pagination.pageIndex,
                                    pageSize: pagination.pageSize,
                                    totalRows: totalOrders,
                                }}
                                onPaginationChange={(updatedPagination) => {
                                    setPagination({
                                        pageIndex: updatedPagination.pageIndex,
                                        pageSize: updatedPagination.pageSize,
                                    });
                                }}
                            />
                        </>
                    ) : (
                        <p className="flex items-center justify-center w-full text-yellow-900 p-4 border border-amber-500 bg-amber-50 rounded-xl text-sm text-center">
                            {searchInput
                                ? `No orders found for “${searchInput}”.`
                                : `This ${type} does not have any orders yet.`}
                        </p>
                    )}
                </>
            )}
        </div>

    );


}
