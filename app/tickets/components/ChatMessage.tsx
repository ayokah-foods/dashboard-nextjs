"use client";

import { useEffect, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ChatMessagesSkeleton from "./ChatMessagesSkeleton";
import { Message } from "@/types/Ticket";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatDate";
import { LuCheck, LuCheckCheck } from "react-icons/lu";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatMessagesProps {
    messages: Message[];
    isloadingChatMessage: boolean;
}

export default function ChatMessages({
    messages,
    isloadingChatMessage,
}: ChatMessagesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isloadingChatMessage && messages.length > 0) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isloadingChatMessage]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-hub-primary/10 custom-scrollbar">
            {isloadingChatMessage ? (
                <ChatMessagesSkeleton />
            ) : messages.length > 0 ? (
                messages.map((msg: any, i: number) => {
                    const isCustomer = msg.sender_type === "customer";
                    const isRead = msg.is_read_by_recipient === true;

                    return (
                        <div
                            key={msg.id || i}
                            className={cn(
                                "flex w-full flex-col",
                                isCustomer ? "items-start" : "items-end",
                            )}
                        >
                            <span className="text-[10px] font-bold uppercase text-gray-400 mb-1 px-1 tracking-tight">
                                {isCustomer ? "Customer" : "Service Provider"}
                            </span>

                            <div
                                className={cn(
                                    "relative max-w-[85%] md:max-w-[70%] px-4 py-2.5 text-sm shadow-sm transition-all",
                                    // Shared bubble styles
                                    "after:content-[''] after:absolute after:top-0 after:w-0 after:h-0 after:border-[10px] after:border-transparent",
                                    isCustomer
                                        ? [
                                              "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none",
                                              "after:-left-2.5 after:border-t-white after:border-r-white", // The white tail
                                          ]
                                        : [
                                              "bg-hub-secondary text-white rounded-2xl rounded-tr-none",
                                              "after:-right-2.5 after:border-t-hub-secondary after:border-l-hub-secondary", // The primary color tail
                                          ],
                                )}
                            >
                                {/* Image Attachment */}
                                {msg.file && (
                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/5 bg-gray-100">
                                        <a
                                            href={msg.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block"
                                        >
                                            <Image
                                                src={msg.file}
                                                alt="Attachment"
                                                className="object-cover w-full h-auto max-h-60 hover:opacity-90 transition-opacity"
                                                width={300}
                                                height={200}
                                                unoptimized
                                            />
                                        </a>
                                    </div>
                                )}

                                <p className="whitespace-pre-wrap break-words leading-relaxed relative z-10">
                                    {msg.text}
                                </p>

                                {/* Metadata & Read Status - Pushed to bottom right like WhatsApp */}
                                <div
                                    className={cn(
                                        "flex items-center justify-end gap-1 mt-1 text-[9px] font-medium leading-none",
                                        isCustomer
                                            ? "text-gray-400"
                                            : "text-hub-primary/80",
                                    )}
                                >
                                    <span>
                                        {formatHumanReadableDate(msg.timestamp)}
                                    </span>

                                    <span className="flex items-center">
                                        {isRead ? (
                                            <LuCheckCheck
                                                className={cn(
                                                    "w-3.5 h-3.5",
                                                    isCustomer
                                                        ? "text-hub-secondary"
                                                        : "text-white",
                                                )}
                                            />
                                        ) : (
                                            <LuCheck className="w-3.5 h-3.5 opacity-60" />
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm italic py-20">
                    <div className="p-4 bg-gray-100 rounded-full mb-3">
                        <Image
                            src="/placeholder.png"
                            width={40}
                            height={40}
                            alt="empty"
                            className="opacity-20"
                        />
                    </div>
                    No messages in this dispute log.
                </div>
            )}
            <div ref={scrollRef} className="h-2 w-full shrink-0" />
        </div>
    );
}
