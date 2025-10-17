"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeftIcon,
    TrashIcon,
    PaperClipIcon,
} from "@heroicons/react/24/outline";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Image from "next/image";
import GlobalSkeleton from "@/app/components/Skeletons/GlobalSkeleton";
import TicketType from "@/types/TicketType";
import MessageEntry from "@/types/MessageEntry";
import {
    deleteTicket,
    getTicketDetail,
    replyTicket,
} from "@/app/api_/tickets";
import router from "next/router";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { updateTicketStatus } from "@/app/api_/tickets";

const statusOptions = [
    { label: "Open", value: "open" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Closed", value: "close" },
];


export default function TicketDetailPage() {
    const params = useParams();
    const ticketId = params?.ticketId as string;
    const [ticket, setTicket] = useState<TicketType | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        try {
            const data = await getTicketDetail(ticketId);
            setTicket(data);
        } catch (error) {
            console.error("Failed to fetch ticket detail:", error);
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        if (ticketId) {
            fetchDetail();
        }
    }, [ticketId, fetchDetail]);
    useEffect(() => {
        if (ticket?.response_status) {
            setStatus({ label: ticket.response_status, value: ticket.response_status });
        }
    }, [ticket?.response_status]);

    const [status, setStatus] = useState<{ label: string; value: string }>({
        label: ticket?.response_status || "Open",
        value: ticket?.response_status || "Open",
    });

    const parsedMessages = useMemo(() => {
        if (!ticket?.description) return [];

        try {
            const parsed = JSON.parse(ticket.description);
            return Array.isArray(parsed) ? parsed : Object.values(parsed);
        } catch (err) {
            console.error("Failed to parse ticket.description", err);
            return [];
        }
    }, [ticket]);

    const handleDelete = async (id: string) => {
        try {
            await deleteTicket(id);
            toast.success("Ticket deleted successfully.");
            router.push("/tickets");
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete ticket.");
        }
    };

    if (loading) {
        return <GlobalSkeleton />;
    }

    if (!ticket) {
        return (
            <div className="text-center p-10 text-red-500">Ticket not found.</div>
        );
    }



    const handleStatusChange = async (newStatus: { label: string; value: string }) => {
        try {
            setStatus(newStatus);
            await updateTicketStatus(ticket.ticket_id, newStatus.value);
            toast.success("Status updated");
            fetchDetail();
        } catch (error) {
            toast.error("Failed to update status");
            console.error("Status update error:", error);
        }
    };


    return (
        <div className="p-6 bg-white h-screen rounded-xl w-full shadow">
            <div className="flex items-center justify-between mb-6">
                <button
                    className="text-white  hover:text-black bg-amber-500 rounded-full p-2 cursor-pointer"
                    onClick={() => history.back()}
                >
                    <ArrowLeftIcon className="h-5 w-5 font-bold" />
                </button>
                <div className="flex gap-4 text-gray-500">
                    <button
                        onClick={() => setConfirmDeleteId(ticket.ticket_id)}
                        title="Delete Ticket"
                    >
                        <TrashIcon className="cursor-pointer hover:text-red-500 text-red-500 bg-red-100 p-2 rounded-full size-9 " />
                    </button>
                    <SelectDropdown
                        options={statusOptions}
                        value={status}
                        onChange={handleStatusChange}
                        className="w-36"
                    />
                </div>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-gray-100">
                <h2 className="text-lg font-semibold text-black">
                    {ticket.title}
                </h2>
                <p className="text-sm text-gray-500 flex items-center">
                    <Image
                        src={ticket.reporter?.profile_photo || "/default.jpg"}
                        alt="Avatar"
                        width={25}
                        height={25}
                        className="rounded-full mr-1"
                    />
                    {ticket.reporter?.name} &lt;{ticket.reporter?.email}&gt;
                    {ticket.file && (
                        <div className="flex items-center gap-1 ml-4">
                            <PaperClipIcon className="w-4 h-4" />
                            <a
                                href={ticket.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-xs text-blue-600 hover:underline"
                            >
                                {ticket.file.split("/").pop()}
                            </a>
                        </div>
                    )}
                </p>
            </div>

            <div className="border-b mb-4" />

            <div className="text-gray-700 mb-8 leading-relaxed space-y-6 overflow-y-auto h-140">
                {parsedMessages.map((entry: MessageEntry, index: number) => {
                    const isAgent = entry.sender === "agent";
                    const sender = isAgent ? ticket.agent : ticket.reporter;

                    return (
                        <div
                            key={`${entry.timestamp}-${index}`}
                            className={`flex items-start gap-3 max-w-[80%] ${isAgent ? "ml-auto flex-row-reverse text-right" : "mr-auto"
                                }`}
                        >
                            <Image
                                src={sender?.profile_photo || "/default.jpg"}
                                alt={sender?.name || "User"}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                            <div
                                className={`p-4 rounded-b-2xl text-sm ${isAgent
                                    ? "bg-gray-100 border border-orange-300 rounded-l-xl"
                                    : "bg-orange-50 border border-orange-200 rounded-r-xl"
                                    }`}
                            >
                                <div className="font-semibold mb-1">{sender?.name}</div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: entry.message }}
                                    className="whitespace-pre-line"
                                />
                                <div className="text-[8px] text-gray-500">
                                    {formatHumanReadableDate(entry.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <TicketReply
                ticketId={ticket.ticket_id}
                agentId={String(ticket.agent?.id)}
                onMessageSent={fetchDetail}
            />


            {/* MODAL INSIDE COMPONENT */}
            <ConfirmationModal
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                title="Confirm Deletion"
            >
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this ticket? This action cannot be
                    undone.
                </p>

                <div className="flex justify-end gap-3 text-gray-500">
                    <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={async () => {
                            if (confirmDeleteId !== null) {
                                await handleDelete(confirmDeleteId);
                                setConfirmDeleteId(null);
                            }
                        }}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </ConfirmationModal>
        </div>
    );
}

function TicketReply({
    ticketId,
    agentId,
    onMessageSent,
}: {
    ticketId: string;
    agentId: string;
    onMessageSent: () => void;
}) {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setSending(true);

        const newMessage = {
            0: {
                sender: "agent",
                message: message.trim(),
                timestamp: new Date().toISOString(),
            },
        };

        const formData = new FormData();
        formData.append("ticket_id", ticketId);
        formData.append("agent_id", agentId);
        formData.append("description", JSON.stringify(newMessage));

        try {
            const res = await replyTicket(formData);
            if (res.status !== "success") throw new Error("Failed to send message");
            setMessage("");
            onMessageSent();
        } catch (error) {
            console.error("Send failed:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="pt-0">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                    className="flex-1 border border-gray-300 text-gray-800 rounded-full px-4 py-5 text-sm focus:outline-none"
                />
                <PaperClipIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}
