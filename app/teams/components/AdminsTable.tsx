import { useState, useEffect, useMemo, useCallback } from "react";
import { deleteAdmin, listInvites } from "@/app/api_/team";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { Stats, Team } from "@/types/TeamType";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import StatusBadge from "@/utils/StatusBadge";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { debounce } from "lodash";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";
import { UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"; // Staff / Admin icons
import AdminSummary from "./AdminSummary";

export default function AdminsTable() {
    const [admins, setAdmins] = useState<Team[]>([]);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        active: 0,
        inactive: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const columns: ColumnDef<Team>[] = useMemo(
        () => [
            { header: "Name", accessorKey: "name", cell: ({ row }) => <span>{row.original.name} {row.original.last_name}</span> },
            { header: "Email", accessorKey: "email", cell: ({ row }) => <span>{row.original.email}</span> },
            { header: "Phone", accessorKey: "phone", cell: ({ row }) => <span>{row.original.phone}</span> },
            {
                header: "Role",
                accessorKey: "role",
                cell: ({ row }) => {
                    const role = row.original.role?.toLowerCase();
                    return (
                        <span className="flex items-center gap-2">
                            {role === "admin" ? (
                                <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
                            ) : (
                                <UserIcon className="w-4 h-4 text-gray-600" />
                            )}
                            {row.original.role}
                        </span>
                    );
                }
            }, { header: "Status", accessorKey: "status", cell: ({ getValue }) => <StatusBadge status={getValue() as "active" | "inactive"} /> },
            { header: "Last login", accessorKey: "last_login", cell: ({ getValue }) => <span>{formatHumanReadableDate(getValue() as string)}</span> },
            { header: "Acceptance", accessorKey: "password_changed_at", cell: ({ getValue }) => <StatusBadge status={getValue() ? "Yes" : "No"} /> },
            {
                header: "Action",
                accessorKey: "id",
                cell: ({ row }) => (
                    <button
                        onClick={() => setConfirmDeleteId(row.original.id)}
                        className=" flex items-center bg-yellow-500 text-white p-1.5 rounded hover:bg-yellow-600"
                    >
                        <TrashIcon className="w-4 h-4 mr-1" /> Revoke
                    </button>
                ),
            },
        ],
        []
    );

    const fetchTeamMembers = useCallback(
        async (pageIndex?: number, searchTerm?: string) => {
            try {
                setLoading(true);
                const response = await listInvites({
                    limit: pagination.pageSize,
                    offset: (pageIndex ?? pagination.pageIndex),
                    search: searchTerm ?? search,
                });
                setAdmins(response.data);
                setTotalAdmins(response.total);
                setStats(response.stats);
            } catch (err) {
                console.error(err);
                setError("Failed to load admins");
            } finally {
                setLoading(false);
            }
        },
        [pagination.pageSize, pagination.pageIndex, search]
    );

    const debouncedFetch = useMemo(
        () => debounce(fetchTeamMembers, 300),
        [fetchTeamMembers]
    );

    useEffect(() => {
        debouncedFetch(pagination.pageIndex, search);
        return () => {
            debouncedFetch.cancel();
        };
    }, [pagination.pageIndex, search, debouncedFetch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteAdmin(id);
            toast.success("Admin deleted successfully");
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete admin");
        }
    };

    return (
        <div className="space-y-6">
            <AdminSummary loading={loading} stats={stats} />
            <input
                type="text"
                placeholder="Search by admin name or email..."
                value={search}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border rounded-md border-amber-600 text-gray-900"
            />

            <TanStackTable
                data={admins}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalAdmins,
                }}
                onPaginationChange={(updatedPagination) => {
                    setPagination({
                        pageIndex: updatedPagination.pageIndex,
                        pageSize: updatedPagination.pageSize,
                    });
                }}
            />

            <ConfirmationModal
                isOpen={confirmDeleteId !== null}
                onClose={() => setConfirmDeleteId(null)}
                title="Confirm Deletion"
            >
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this admin? This action cannot be undone.
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
