'use client';

import Sidebar from '@/app/components/Sidebar';
import { useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex bg-white/95 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-50 hover:scrollbar-thumb-gray-100 scrollbar-track-transparent">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
            />
            <div className="flex flex-col flex-1 lg:pl-70">
                <main className="py-8 px-2 sm:px-4 lg:px-6">{children}</main>
            </div>
        </div>
    );
}
