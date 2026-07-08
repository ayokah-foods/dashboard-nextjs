import Image from "next/image";
import { formatAmount } from "@/utils/formatCurrency";
export default function CustomerSummary({
    customer,
    address,
    stats,
}: {
    customer: any;
    address: any | null;
    stats?: any;
}) {
    return (
        <div className="w-full max-w-full bg-white rounded-xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-sm border border-gray-200 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-4 min-w-[220px]">
                <div className="relative w-14 h-14 rounded-full border-4 border-hub-secondary/80 overflow-hidden shrink-0">
                    <Image
                        src={customer.profile_photo}
                        alt={`${customer.name}'s profile`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium text-gray-800">
                        {customer.name} {customer.last_name}
                    </p>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                    <p className="text-gray-500 text-sm">
                        Phone:{" "}
                        <span className="font-medium text-gray-700">
                            {customer.phone || "—"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-px h-0 lg:h-16 bg-gray-200 lg:mx-6" />

            <div className="flex-1 min-w-[220px]">
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                    Shipping Address
                </p>
                {address ? (
                    <p className="text-gray-700">
                        {[
                            address.street_address,
                            address.city,
                            address.state,
                            address.zip_code,
                            address.country,
                        ]
                            .filter(Boolean)
                            .join(", ")}
                    </p>
                ) : (
                    <p className="text-gray-500 italic">Not provided</p>
                )}

                <div className="flex gap-6 mt-4 text-center">
                    <div>
                        <p className="font-bold">
                            {formatAmount(Number(stats?.total_revenue || 0))}
                        </p>
                        <p className="text-xs text-gray-500">Overall spent</p>
                    </div>
                    <div>
                        <p className="font-bold">{stats?.total_orders ?? 0}</p>
                        <p className="text-xs text-gray-500">Overall orders</p>
                    </div>
                    <div>
                        <p className="font-bold">
                            {stats?.total_completed ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">
                            Overall completed
                        </p>
                    </div>
                    <div>
                        <p className="font-bold">
                            {stats?.total_cancelled ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">
                            Overall canceled
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
