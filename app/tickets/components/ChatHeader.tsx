"use client";

import { LuChevronLeft, LuShield, LuExternalLink } from "react-icons/lu";
import Image from "next/image";

interface ChatHeaderProps {
    participants: {
        customer: { full_name: string; profile_photo: string };
        provider: { full_name: string; profile_photo: string };
    } | null;
    onBack?: () => void;
    ticketId: string;
    bookingStatus: string;
    serviceSlug?: string; // Added serviceSlug
}

export default function ChatHeader({
    participants,
    onBack,
    ticketId,
    bookingStatus,
    serviceSlug,
}: ChatHeaderProps) {
    if (!participants)
        return <div className="h-17.5 bg-white border-b border-gray-100" />;

    return (
        <header className="p-3 md:p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 w-full">
            <div className="flex items-center gap-3 overflow-hidden">
                <button
                    onClick={onBack}
                    className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <LuChevronLeft size={24} />
                </button>

                {/* Dual Avatars */}
                <div className="flex items-center -space-x-3 shrink-0">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white bg-gray-100 z-10 shadow-sm">
                        <Image
                            src={
                                participants.customer?.profile_photo ||
                                "/placeholder.png"
                            }
                            alt="Customer"
                            width={40}
                            height={40}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white bg-gray-200 z-0">
                        <Image
                            src={
                                participants.provider?.profile_photo ||
                                "/placeholder.png"
                            }
                            alt="Provider"
                            width={40}
                            height={40}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-bold leading-tight truncate text-gray-900 flex items-center gap-1">
                        <span className="truncate">
                            {participants.customer?.full_name}
                        </span>
                        <span className="text-gray-300 font-normal">&</span>
                        <span className="truncate">
                            {participants.provider?.full_name}
                        </span>
                    </h2>

                    <div className="flex items-center gap-2 mt-1.5">
                        {serviceSlug ? (
                            <a
                                href={`https://africanmarkethub.ca/items/${serviceSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] font-bold text-hub-secondary bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1 hover:bg-hub-primary/10 transition-colors"
                            >
                                View Service <LuExternalLink size={10} />
                            </a>
                        ) : (
                            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1 rounded uppercase">
                                Ticket: {ticketId?.split("-").pop()}
                            </span>
                        )}

                        <span className="text-[9px] text-gray-400 font-medium uppercase">
                            • {bookingStatus || "Under Review"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden animate-pulse sm:flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-hub-primary rounded-full border border-hub-primary/10 shrink-0">
                <LuShield size={14} className="text-hub-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    READ-ONLY View
                </span>
            </div>
        </header>
    );
}
