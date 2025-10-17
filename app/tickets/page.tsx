'use client';
import { useState, useEffect, useCallback } from "react";
import Ticket from "@/types/Ticket";
import Image from "next/image";
import { formatDate } from "@/utils/formatHumanReadableDate";
import Link from "next/link";
import { getTickets } from "../api_/tickets";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import { InboxIcon, TagIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";

const statusTabs = [
    {
        label: "Open",
        value: "open",
        icon: InboxIcon,
    },
    {
        label: "Ongoing",
        value: "ongoing",
        icon: TagIcon,
    },
    {
        label: "Close",
        value: "close",
        icon: UserGroupIcon,
    },
];

const priorityLevel = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
];

export default function Tickets() {
    const [status, setStatus] = useState("open");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [searchTerm, setSearchTerm] = useState("");
    const [priority, setPriority] = useState<string | undefined>();

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getTickets(
                status,
                searchTerm,
                priority,
                pagination.pageSize,
                pagination.pageIndex * pagination.pageSize
            );
            setTickets(response.data || []);
            setTotalTickets(response.total || 0);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    }, [status, searchTerm, priority, pagination]);


    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return (
        <div className="flex flex-col h-screen bg-white rounded-xl">

            {/* Search and Filter */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 text-gray-800">
                <input
                    type="text"
                    placeholder="Search by title or reporter"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-xl text-sm mr-3 outline-none"
                />
                <div className="w-48">
                    <SelectDropdown
                        options={priorityLevel}
                        value={priorityLevel.find((opt) => opt.value === priority) || priorityLevel[0]}
                        onChange={(opt) => {
                            setPriority(opt?.value);
                            setPagination({ ...pagination, pageIndex: 0 });
                        }}
                    />

                </div>
            </div>

            {/* Top Tabs */}
            <div className="flex justify-start items-center px-6 py-4 border-b border-gray-200 space-x-6">
                {statusTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = status === tab.value;

                    return (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setStatus(tab.value);
                                setPagination({ ...pagination, pageIndex: 0 });
                            }}
                            className={`inline-flex items-center gap-2 px-12 py-2 text-sm font-medium border-b-2 ${isActive
                                ? "border-hub-cinnabar-500 text-hub-cinnabar-600"
                                : "border-transparent text-gray-500 hover:text-hub-cinnabar-600 hover:border-hub-cinnabar-300"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>


            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    [...Array(8)].map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="flex items-center px-6 py-4 border-b"
                        >
                            {/* Avatar Skeleton */}
                            <div className="mr-4">
                                <Skeleton circle height={32} width={32} />
                            </div>

                            {/* Reporter Name */}
                            <div className="flex-1">
                                <Skeleton height={14} width="70%" />
                            </div>

                            {/* Subject and Description */}
                            <div className="flex-[2]">
                                <Skeleton height={14} width="95%" className="mb-1" />
                                <Skeleton height={12} width="60%" />
                            </div>

                            {/* Date */}
                            <div className="w-24 text-right pr-2">
                                <Skeleton height={12} width={40} />
                            </div>
                        </div>
                    ))
                ) : tickets.length === 0 ? (
                    <div className="text-center text-hub-cinnabar-500 py-10 text-sm">
                        No {status} {priority} tickets found.
                    </div>
                ) : (

                    tickets
                        .filter((t) => {
                            const title = t.title?.toLowerCase() || "";
                            const name = t.reporter?.name?.toLowerCase() || "";
                            return (
                                title.includes(searchTerm.toLowerCase()) ||
                                name.includes(searchTerm.toLowerCase())
                            );
                        })
                        .map((ticket) => (
                            <Link
                                href={`/tickets/${ticket.ticket_id}`}
                                key={ticket.id}
                                className="flex items-center px-8 py-4 hover:bg-gray-100 border-b transition text-sm"
                            >
                                <div className="mr-4">
                                    <Image
                                        src={ticket.reporter?.profile_photo || "/placeholder.png"}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full size-8 object-cover border border-gray-300"
                                    />
                                </div>

                                <div className="flex-1 truncate font-medium text-gray-800">
                                    {ticket.reporter?.name}  {ticket.reporter?.last_name}
                                </div>

                                <div className="truncate text-gray-700">
                                    <span className="font-medium">{ticket.title}</span>
                                    <span className="ml-1 text-gray-500 text-sm">
                                        – {ticket.subject?.slice(0, 60) || "No description"}
                                    </span>
                                </div>

                                <div className="w-24 text-xs text-gray-500 text-right pr-2">
                                    {formatDate(ticket.created_at)}
                                </div>
                            </Link>
                        ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-600 border-t border-gray-100">
                <span>
                    Showing{" "}
                    <strong>
                        {tickets.length === 0
                            ? 0
                            : pagination.pageIndex * pagination.pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong>
                        {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalTickets)}
                    </strong>{" "}
                    of <strong>{totalTickets}</strong> tickets
                </span>

                <div className="space-x-2">
                    <button
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: Math.max(prev.pageIndex - 1, 0),
                            }))
                        }
                        disabled={pagination.pageIndex === 0}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex:
                                    (pagination.pageIndex + 1) * pagination.pageSize < totalTickets
                                        ? prev.pageIndex + 1
                                        : prev.pageIndex,
                            }))
                        }
                        disabled={(pagination.pageIndex + 1) * pagination.pageSize >= totalTickets}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
