"use client";

import { useEffect, useMemo, useState } from "react";
import { Shop } from "@/types/ShopType";
import { ColumnDef } from "@tanstack/react-table";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { shopAction, getShops } from "../../lib/api/shop";
import Image from "next/image";
import StatusBadge from "@/utils/StatusBadge";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { debounce } from "lodash";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import { MetricCard } from "./components/MetricCard";
import AnalysisAreaChart from "./components/AnalysisAreaChart";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/commons/ConfirmationModal";
import Link from "next/link";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";

const typeOptions = [
    { label: "All Types", value: "" },
    { label: "Item Seller", value: "products" },
    { label: "Service Providers", value: "services" },
    { label: "Delivery Partners", value: "deliveries" },
];

export default function Shops() {
    const [data, setData] = useState<Shop[]>([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [selectedType, setSelectedType] = useState(typeOptions[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shopToTakeAction, setShopToTakeAction] = useState<Shop | null>(null);
    const [actioning, setAction] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false); // New state to toggle UI

    const hanleShopAction = async (status: "approved" | "rejected") => {
        if (!shopToTakeAction) return;

        try {
            setAction(true);
            // Pass both the ID and the specific action to your API
            await shopAction(shopToTakeAction.id, status, rejectionReason);

            toast.success(`Shop ${status} successfully`);
            setIsModalOpen(false);
            setShopToTakeAction(null);

            // Refresh data
            fetchShops({
                limit: pagination.pageSize,
                offset: pagination.pageIndex * pagination.pageSize,
                search,
                type: selectedType.value || undefined,
            });
        } catch {
            toast.error("Failed to update shop status");
        } finally {
            setAction(false);
        }
    };
    const fetchShops = async ({
        limit,
        offset,
        search,
        type,
    }: {
        limit: number;
        offset: number;
        search?: string;
        type?: string;
    }) => {
        setLoading(true);
        try {
            const res = await getShops({ limit, offset, search, type });
            setData(res.data);
            setTotal(res.total);
        } catch {
            setError("Failed to fetch shops.");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = useMemo(
        () =>
            debounce(
                (params: {
                    limit: number;
                    offset: number;
                    search?: string;
                    type?: string;
                }) => {
                    fetchShops(params);
                },
                300,
            ),
        [],
    );

    useEffect(() => {
        debouncedFetch({
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
            search,
            type: selectedType.value || undefined,
        });
    }, [pagination, search, selectedType, debouncedFetch]);

    const columns: ColumnDef<Shop>[] = useMemo(
        () => [
            {
                header: "Shop",
                accessorKey: "name",
                cell: ({ row }) => {
                    const { name, logo, type, category, slug } = row.original;
                    const publicUrl = `https://africanmarkethub.ca/shops/${slug}`;

                    // Fallback to a local placeholder or a default remote icon
                    const displayLogo = logo || "/icon.svg";

                    return (
                        <div className="flex items-center gap-3">
                            {/* Logo Link */}
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <div className="w-10 h-10 relative rounded-full overflow-hidden border border-hub-primary/10 bg-gray-50">
                                    <Image
                                        src={displayLogo}
                                        alt={name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                            </a>

                            <div className="flex flex-col">
                                {/* External Shop Link */}
                                <a
                                    href={publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-900 font-medium leading-tight hover:text-blue-600 flex items-center gap-1"
                                >
                                    {name}
                                    <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>

                                <span className="text-xs text-gray-500 capitalize">
                                    {category?.name || "Uncategorized"} |{" "}
                                    <b>{row.original.products_count}</b> {type}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Vendor",
                accessorKey: "vendor.name",
                cell: ({ row }) => {
                    const vendor = row.original.vendor;
                    // Assuming the vendor ID is available as vendor.id
                    const vendorPath = `/vendors/${vendor?.id}`;

                    return (
                        <Link href={vendorPath} className="group block">
                            <div className="text-sm">
                                <div className="flex item-center gap-1 font-medium text-gray-900 group-hover:text-hub-secondary transition-colors">
                                    {vendor?.name} {vendor?.last_name}
                                    {/* Adding a small external link icon is helpful for Admins */}
                                    <svg
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                },
            },
            {
                header: "Identity Doc",
                accessorKey: "identification_document",
                cell: ({ row }) => {
                    const docLink = row.original.identification_document;
                    const docType = row.original.identification_type;

                    return (
                        <div className="flex flex-col text-sm">
                            <span className="text-gray-500 text-xs uppercase font-semibold">
                                {docType || "N/A"}
                            </span>
                            {docLink ? (
                                <a
                                    href={docLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                    View Document
                                    <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            ) : (
                                <span className="text-gray-400 italic text-xs">
                                    No file
                                </span>
                            )}
                        </div>
                    );
                },
            },
            {
                header: "Pickup Address",
                // Use an id since we are manually rendering the cell from row.original
                id: "pickup_address",
                cell: ({ row }) => {
                    const address = row.original?.address;

                    // 1. Handle null or undefined address
                    if (!address) {
                        return (
                            <span className="text-gray-400 italic text-xs">
                                No Address
                            </span>
                        );
                    }

                    // 2. Extract and filter out null/empty values
                    const addressParts = [address.city, address.state].filter(
                        Boolean,
                    );

                    // 3. Handle case where address object exists but is empty
                    if (addressParts.length === 0) {
                        return (
                            <span className="text-gray-400 italic text-xs">
                                Address Incomplete
                            </span>
                        );
                    }

                    return (
                        <span className="text-gray-600 text-sm">
                            {addressParts.join(", ")}
                        </span>
                    );
                },
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
            },
            {
                header: "Created",
                accessorKey: "created_at",
                cell: ({ row }) => (
                    <span className="text-sm text-gray-500">
                        {formatHumanReadableDate(row.original.created_at)}
                    </span>
                ),
            },
            {
                header: "Action",
                cell: ({ row }) => (
                    <button
                        onClick={() => {
                            setShopToTakeAction(row.original); // Pass full object
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-hub-primary text-hub-secondary rounded hover:bg-gray-50 transition cursor-pointer"
                    >
                        Take Action
                        <ClipboardDocumentCheckIcon className="w-4 h-4" />
                    </button>
                ),
            },
        ],
        [],
    );

    const pageSizeOptions = [10, 20, 30, 50].map((size) => ({
        label: `${size} / page`,
        value: String(size),
    }));

    const currentPageSize =
        pageSizeOptions.find(
            (opt) => Number(opt.value) === pagination.pageSize,
        ) || pageSizeOptions[0];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
                    <p className="text-gray-600 text-sm">
                        Manage your vendor shops here.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search shops..."
                        className="w-full px-10 py-2 border border-hub-primary/10 rounded-md text-gray-900 focus:outline-none focus:border-hub-primary/50 focus:ring-0"
                        value={search}
                        onChange={(e) => {
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 0,
                            }));
                            setSearch(e.target.value);
                        }}
                    />
                    <SelectDropdown
                        options={pageSizeOptions}
                        value={currentPageSize}
                        onChange={(option) => {
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 0,
                                pageSize: Number(option.value),
                            }));
                        }}
                    />

                    <SelectDropdown
                        options={typeOptions}
                        value={selectedType}
                        onChange={(option) => {
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: 0,
                            }));
                            setSelectedType(option);
                        }}
                    />
                </div>
            </div>

            <MetricCard />

            <AnalysisAreaChart />

            <TanStackTable
                data={data}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: total,
                }}
                onPaginationChange={setPagination}
            />
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setShopToTakeAction(null);
                    setIsRejecting(false);
                    setRejectionReason("");
                }}
                title={
                    isRejecting
                        ? `Rejecting: ${shopToTakeAction?.name}`
                        : "Review Shop Verification"
                }
            >
                <div className="space-y-4">
                    {shopToTakeAction && !isRejecting && (
                        <div className="mt-2">
                            {/* 1. Clear Guidance Text */}
                            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    {shopToTakeAction.identification_document
                                        ? `Please verify that the ${shopToTakeAction.identification_type || "document"} matches the shop details for "${shopToTakeAction.name}".`
                                        : `Warning: This shop has not uploaded any identification documents.`}
                                </p>
                            </div>

                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                {shopToTakeAction.identification_type ||
                                    "Verification Document"}
                            </p>

                            {/* 2. Visual Document State */}
                            <div className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                                {shopToTakeAction.identification_document ? (
                                    <Image
                                        src={
                                            shopToTakeAction.identification_document
                                        }
                                        alt="Identity Document"
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="text-center px-6">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-400 font-medium">
                                            No document provided by vendor
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3. Improved Rejection Flow */}
                    {isRejecting && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm text-gray-600 mb-3">
                                Explain why this shop is being rejected. This
                                message will be sent to{" "}
                                <strong>
                                    {shopToTakeAction?.vendor?.email ||
                                        "the vendor"}
                                </strong>{" "}
                                to help them correct the issue.
                            </p>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Rejection Reason
                            </label>
                            <textarea
                                rows={4}
                                autoFocus
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm shadow-sm"
                                placeholder="e.g., The ID provided is expired. Please upload a valid Government Issued ID."
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                            />
                        </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                        {!isRejecting ? (
                            <>
                                <button
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="rounded-md bg-white border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                    onClick={() => setIsRejecting(true)}
                                >
                                    Reject Shop
                                </button>
                                <button
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 shadow-sm transition-colors disabled:opacity-50"
                                    onClick={() => hanleShopAction("approved")}
                                    disabled={actioning}
                                >
                                    {actioning
                                        ? "Processing..."
                                        : "Approve & Activate"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsRejecting(false)}
                                    disabled={actioning}
                                >
                                    Go Back
                                </button>
                                <button
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => hanleShopAction("rejected")}
                                    disabled={
                                        actioning || !rejectionReason.trim()
                                    }
                                >
                                    {actioning
                                        ? "Sending Notice..."
                                        : "Send Rejection Notice"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </ConfirmationModal>
        </div>
    );
}
