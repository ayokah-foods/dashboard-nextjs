"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { listBanners } from "@/app/api_/categories";
import { BannerType } from "@/types/CategoryType";
import { CubeIcon, TrashIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type BannerProps = {
    limit: number;
    onDelete: (category: BannerType) => void;
};

const BannersTable: React.FC<BannerProps> = ({ limit, onDelete }) => {
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });

    const columns: ColumnDef<BannerType>[] = useMemo(
        () => [
            {
                header: "Banner Type",
                accessorKey: "type",
                cell: ({ row }) => {
                    const type = row.original.type;
                    const isProduct = type === "products";
                    const Icon = isProduct ? CubeIcon : WrenchScrewdriverIcon;

                    return (
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                            <Icon className="w-4 h-4 text-amber-600" />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    );
                },
            },
            {
                header: "Banner Image",
                accessorKey: "banner",
                cell: ({ row }) => (
                    row.original.banner ? (
                        <div className="w-20 h-12 relative rounded overflow-hidden border border-gray-200 shadow-sm">
                            <Image
                                src={row.original.banner}
                                alt={row.original.type}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500 italic">No image</span>
                    )
                ),
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

    const fetchBanners = async (offset: number, pageSize: number) => {
        try {
            setLoading(true);
            const response = await listBanners(pageSize, offset);
            setBanners(response.data);
            console.log(response);
            setTotal(response.total);
        } catch (err) {
            console.error(err);
            setError("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    const { pageIndex, pageSize } = pagination;
    useEffect(() => {
        fetchBanners(pageIndex * pageSize, pageSize);
    }, [pageIndex, pageSize]);

    return (
        <div className="space-y-6">
            <TanStackTable
                data={banners}
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

export default BannersTable;
