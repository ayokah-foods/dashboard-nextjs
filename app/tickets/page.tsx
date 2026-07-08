"use client";

import { useState, useEffect, use, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatClientWrapper from "./components/ChatClientWrapper";
import { getServiceChat, listServiceChats } from "@/lib/api/services";
// NOTE: Ensure these point to your ADMIN endpoints in your API file

interface ServiceChatPageProps {
    searchParams: Promise<{ item?: string }>;
}

export default function ServiceChatPage({
    searchParams,
}: ServiceChatPageProps) {
    const resolvedParams = use(searchParams);
    const nextSearchParams = useSearchParams();

    // The 'item' is likely the ticket_id or service_id you want to focus on
    const itemId = resolvedParams?.item || nextSearchParams.get("item");

    const isInitializing = useRef(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (isInitializing.current) return;

        const initFetch = async () => {
            isInitializing.current = true;
            try {
                const res = await listServiceChats();
                // Handle the Admin response structure (res.data.data)
                const chats = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || [];

                const targetId = itemId ? String(itemId).trim() : null;

                // Find the active ticket based on the URL param
                let activeTicket = targetId
                    ? chats.find(
                          (t: any) =>
                              String(t.ticket_id) === targetId ||
                              String(t.service_id) === targetId,
                      )
                    : null;

                // Default to the first chat if none selected
                if (!activeTicket && chats.length > 0) {
                    activeTicket = chats[0];
                }

                let initialMessages = [];
                let initialParticipants = null; // Renamed to plural for Admin
                let bookingStatus = null;

                if (activeTicket) {
                    try {
                        const detail = await getServiceChat(
                            activeTicket.ticket_id,
                        );
                        const payload = detail.data?.data || detail.data;

                        if (
                            detail.status === "success" ||
                            detail.data?.status === "success"
                        ) {
                            initialMessages = payload?.messages || [];
                            // This now contains customer AND provider objects
                            initialParticipants = payload?.participants || null;
                            bookingStatus = payload?.status || "";
                        }
                    } catch (err) {
                        console.error("Admin Detail fetch failed", err);
                    }

                    // Fallback if detail fetch fails
                    if (!initialParticipants) {
                        initialParticipants = {
                            customer: {
                                full_name: activeTicket.customer_name,
                                profile_photo: activeTicket.customer_photo,
                            },
                            provider: {
                                full_name: activeTicket.provider_name,
                                profile_photo: activeTicket.provider_photo,
                            },
                        };
                    }
                }

                setData({
                    chats,
                    activeChat: activeTicket,
                    messages: initialMessages,
                    participants: initialParticipants,
                    status: bookingStatus,
                });
            } catch (err) {
                console.error("Admin Main Fetch Error:", err);
            } finally {
                isInitializing.current = false;
            }
        };

        initFetch();
    }, [itemId]);

    if (!data) {
        return (
            <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-hub-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">
                    Loading Admin Console...
                </p>
            </div>
        );
    }

    return (
        <ChatClientWrapper
            initialChats={data.chats}
            bookingStatus={data.status}
            initialActiveChat={data.activeChat}
            initialMessages={data.messages}
            // Pass the dual participants object
            initialParticipant={data.participants}
        />
    );
}
