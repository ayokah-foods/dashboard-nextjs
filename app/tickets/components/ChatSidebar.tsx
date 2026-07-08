"use client";

import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatDate";

interface ChatSidebarProps {
  chats: any[]; // Using any because Admin Ticket has customer_name/provider_name
  activeChatId: string | undefined;
  onSelectChat: (chat: any) => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats
    .filter(
      (chat, index, self) =>
        index === self.findIndex((t) => t.ticket_id === chat.ticket_id)
    )
    .filter(
      (chat) =>
        chat.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.provider_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
          Dispute Logs
        </h1>
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-hub-primary placeholder:text-gray-400 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            const isActive = activeChatId === chat.ticket_id;

            return (
                <div
                    key={chat.ticket_id}
                    onClick={() => onSelectChat(chat)}
                    className={`flex items-center gap-3 p-4 cursor-pointer border-l-4 transition-all ${
                        isActive
                            ? "bg-hub-primary/10 border-hub-primary rounded-md shadow-sm"
                            : "hover:bg-gray-50 border-transparent"
                    }`}
                >
                    {/* Dual Avatar for Admin */}
                    <div className="relative shrink-0 flex -space-x-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white bg-gray-200 z-10">
                            <Image
                                src={chat.customer_photo || "/placeholder.png"}
                                alt="Customer"
                                width={40}
                                height={40}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white bg-gray-300">
                            <Image
                                src={chat.provider_photo || "/placeholder.png"}
                                alt="Provider"
                                width={40}
                                height={40}
                                unoptimized
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            {/* Participant Names */}
                            <h3
                                className={`text-xs truncate font-bold ${isActive ? "text-hub-secondary" : "text-gray-900"}`}
                            >
                                {chat.customer_name} vs {chat.provider_name}
                            </h3>

                            {/* Timestamp */}
                            <span className="text-[9px] text-gray-400 shrink-0 ml-2">
                                {chat.last_message_time
                                    ? formatHumanReadableDate(
                                          chat.last_message_time,
                                      )
                                    : ""}
                            </span>
                        </div>

                        {/* Preview of the conversation */}
                        <p
                            className={`text-[11px] truncate mt-1 leading-relaxed ${
                                isActive
                                    ? "text-hub-secondary font-medium"
                                    : "text-gray-500"
                            }`}
                        >
                            {chat.last_message || "No messages yet"}
                        </p>
                    </div>
                </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-center opacity-50">
             <LuSearch size={30} className="mb-2" />
             <p className="text-xs font-bold">No disputes found</p>
          </div>
        )}
      </nav>
    </aside>
  );
}