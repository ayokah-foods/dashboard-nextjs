"use client";

import { useState, useEffect } from "react";
import { LuShield } from "react-icons/lu";
import ChatMessages from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import { Message, Ticket } from "@/types/Ticket";
import { getServiceChat } from "@/lib/api/services";

interface ChatClientWrapperProps {
    initialChats: Ticket[];
    bookingStatus: string;
    initialActiveChat: Ticket | null;
    initialMessages: Message[];
    initialParticipant: any; // Now contains { customer, provider }
}

export default function ChatClientWrapper({
    initialChats,
    bookingStatus,
    initialActiveChat,
    initialMessages,
    initialParticipant,
}: ChatClientWrapperProps) {
    const [chats, setChats] = useState<Ticket[]>(initialChats);
    const [activeChat, setActiveChat] = useState<Ticket | null>(
        initialActiveChat,
    );
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [participants, setParticipants] = useState<any>(initialParticipant);
    const [showMobileChat, setShowMobileChat] = useState(!!initialActiveChat);
    const [isloadingChatMessage, setIsLoadingChatMessage] = useState(false);
    // Sync state with props when switching tickets
    useEffect(() => {
        setChats(initialChats);
        setActiveChat(initialActiveChat);
        setMessages(initialMessages);
        setParticipants(initialParticipant);
    }, [initialChats, initialActiveChat, initialMessages, initialParticipant]);

    // Observer Polling Logic
    useEffect(() => {
        if (!activeChat) return;
        setIsLoadingChatMessage(true); // Start loading
        const interval = setInterval(async () => {
            try {
                const res = await getServiceChat(activeChat.ticket_id);
                const serverData = res.data?.data || res.data;
                const newMessages = serverData.messages || [];

                if (newMessages.length !== messages.length) {
                    setMessages(newMessages);
                }
            } catch (err) {
                console.error("Admin polling failed", err);
            } finally {
                setIsLoadingChatMessage(false); // Stop loading
            }
        }, 5000); // Slower polling for admin to save resources

        return () => clearInterval(interval);
    }, [activeChat, messages.length]);

    return (
        <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] bg-gray-50 overflow-hidden md:rounded-2xl md:m-4 shadow-sm border border-gray-200">
            {/* Sidebar - Viewing all global tickets */}
            <div
                className={`${showMobileChat ? "hidden" : "block"} w-full md:block md:w-80 border-r border-gray-200 bg-white`}
            >
                <ChatSidebar
                    chats={chats}
                    activeChatId={activeChat?.ticket_id}
                    onSelectChat={(selectedTicket) => {
                        setActiveChat(selectedTicket);

                        // Update participants state immediately when selection changes
                        setParticipants({
                            customer: {
                                full_name: selectedTicket.customer_name,
                                profile_photo: selectedTicket.customer_photo,
                            },
                            provider: {
                                full_name: selectedTicket.provider_name,
                                profile_photo: selectedTicket.provider_photo,
                            },
                        });

                        setShowMobileChat(true);
                    }}
                />
            </div>

            {/* Main Chat Area */}
            <main
                className={`${showMobileChat ? "flex" : "hidden"} flex-1 flex-col bg-white w-full`}
            >
                {activeChat ? (
                    <>
                        <ChatHeader
                            participants={participants} // Updated for dual info
                            onBack={() => setShowMobileChat(false)}
                            ticketId={activeChat?.ticket_id}
                            bookingStatus={bookingStatus}
                            serviceSlug={activeChat?.service_slug} // Pass the slug here
                        /> 
                        <ChatMessages
                            messages={messages}
                            isloadingChatMessage={isloadingChatMessage}
                        />
                    </>
                ) : (
                    <div className="flex-1 hidden md:flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="p-6 bg-gray-100 rounded-full">
                            <LuShield size={48} className="text-gray-300" />
                        </div>
                        <p className="font-medium text-gray-500">
                            Select a support ticket to audit the conversation
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
