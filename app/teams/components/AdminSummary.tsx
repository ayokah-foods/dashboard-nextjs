import { Stats } from "@/types/TeamType";
import {
    CubeIcon,
    CheckCircleIcon,
    XCircleIcon, 
} from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";

interface AdminSummaryProps {
    loading: boolean;
    stats: Stats;
}

export default function AdminSummary({ loading, stats }: AdminSummaryProps) {
    const summaries = [
        {
            label: "Total Admin",
            value: stats.total,
            icon: <CubeIcon className="w-6 h-6 text-blue-600" />,
        },
        {
            label: "Active Admin",
            value: stats.active,
            icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
        },
        {
            label: "Inactive Admin",
            value: stats.inactive,
            icon: <XCircleIcon className="w-6 h-6 text-red-600" />,
        }, 
    ];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaries.map(({ label, value, icon }) => (
                    <div
                        key={label}
                        className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
                    >
                        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
                        <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {loading ? <Skeleton width={40} /> : value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
