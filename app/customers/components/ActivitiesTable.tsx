"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Avatar from "@/utils/Avatar";
import { ColumnDef } from "@tanstack/react-table";
import TanStackTable from "@/app/components/commons/TanStackTable";
import { Activities } from "@/types/UserType";
import { getUserActivities } from "@/app/api_/users";

interface ActivitiesTableProps {
    limit: number;
    role: string;
}

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ limit = 10, role }) => {
    const [activities, setActivities] = useState<Activities[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: limit,
    });
    const [totalActivities, setTotalActivities] = useState(0);

    const columns: ColumnDef<Activities>[] = useMemo(
        () => [
            {
                header: "Name",
                accessorKey: "user.name",
                cell: ({ row }) => {
                    const user = row.original.user;
                    return (
                        <div className="flex items-center space-x-2">
                            <Avatar src={user.profile_photo} alt={user.name} />
                            <span>{user.name}</span>
                        </div>
                    );
                },
            },
            {
                header: "Activity",
                accessorKey: "activity",
            },
            {
                header: "Location",
                accessorKey: "location",
            },
            {
                header: "Device",
                accessorKey: "device",
                cell: ({ getValue }) => {
                    const value = getValue() as string;
                    return <span className="text-gray-700">{value.replace(/"/g, "")}</span>;
                },
            },
            {
                header: "Last Seen",
                accessorKey: "login_time",
                cell: ({ getValue }) => formatHumanReadableDate(getValue() as string),
            },
        ],
        []
    );

    const fetchUserActivities = useCallback(async (pageIndex: number, role: string) => {
        try {
            setLoading(true);
            const offset = pageIndex * pagination.pageSize;
            const response = await getUserActivities(pagination.pageSize, offset, role);
            setActivities(response.data || []);
            setTotalActivities(response.total || 0);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching activities.");
        } finally {
            setLoading(false);
        }
    }, [pagination.pageSize]);

    useEffect(() => {
        fetchUserActivities(pagination.pageIndex, role);
    }, [fetchUserActivities, pagination.pageIndex, role]);

    return (
        <div className="mt-6">
            <TanStackTable
                data={activities}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalActivities,
                }}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPagination({ pageIndex, pageSize });
                }}
            />
        </div>
    );
};

export default ActivitiesTable;
