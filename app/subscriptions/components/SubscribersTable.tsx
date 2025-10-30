"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { listSubscribers } from "@/app/api_/subscriptions";  
import TanStackTable from "@/app/components/commons/TanStackTable";
import { formatAmount } from "@/utils/formatCurrency";

interface SubscriberType {
  id: number;
  name: string; // Shop name
  vendor: {
    id: number;
    name: string;
    email: string;
  };
  subscription: {
    id: number;
    name: string;
    monthly_price: number;
    yearly_price: number;
  };
  status: string;
  created_at: string;
}

type Props = {
  limit: number;
};

export default function SubscribersTable({ limit }: Props) {
  const [subscribers, setSubscribers] = useState<SubscriberType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });

  // Table columns
  const columns: ColumnDef<SubscriberType>[] = useMemo(
    () => [
      {
        header: "Shop Name",
        accessorKey: "name",
      },
      {
        header: "Vendor",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-800">{row.original.vendor?.name || "—"}</p>
            <p className="text-xs text-gray-500">{row.original.vendor?.email || "—"}</p>
          </div>
        ),
      },
      {
        header: "Subscription Plan",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-gray-700">{row.original.subscription?.name || "—"}</p>
            <p className="text-xs text-gray-500">
              Monthly: {formatAmount(row.original.subscription?.monthly_price || 0)}
            </p>
          </div>
        ),
      },
      {
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {row.original.status || "—"}
          </span>
        ),
      },
      {
        header: "Joined On",
        accessorFn: (row) => new Date(row.created_at).toLocaleDateString(),
      },
    ],
    []
  );

  // Fetch data
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await listSubscribers();
      setSubscribers(response.data || []);
      setTotal(response.data.length || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-6">
      <TanStackTable
        data={subscribers}
        columns={columns}
        loading={loading}
        error={error}
        pagination={{
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalRows: total,
        }}
        onPaginationChange={(newPagination) => setPagination(newPagination)}
      />
    </div>
  );
}
