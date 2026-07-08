"use client";

import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex bg-white/95 h-screen overflow-hidden">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
 
            <div className="flex flex-col flex-1 min-w-0 h-full lg:ml-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-50 hover:scrollbar-thumb-gray-100 scrollbar-track-transparent">
                <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
