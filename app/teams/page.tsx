'use client';
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "../components/commons/Drawer";
import InviteForm from "./components/InviteForm";
import AdminsTable from "./components/AdminsTable";

export default function InviteTeamMember() {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="space-y-6 text-gray-800">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
                    <p className="text-sm text-gray-600">Manage your team members here.</p>
                </div>

                <div className="flex gap-3 items-center">

                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Team Member
                    </button>
                </div>
            </div>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Invite Team Member"
            >
                <InviteForm onClose={() => setDrawerOpen(false)} />
            </Drawer>

            <AdminsTable />
        </div>
    )
}

