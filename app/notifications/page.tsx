'use client';

import { useEffect, useMemo, useState } from "react";
import SelectDropdown from "../components/commons/Fields/SelectDropdown";
import { getNotifications } from "../api_/notifications";
import { NotificationResponse, NotificationType } from "@/types/NotificationsType";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import { ColumnDef } from "@tanstack/react-table";
import TanStackTable from "../components/commons/TanStackTable";
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverPanel, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import Drawer from "../components/commons/Drawer";
import NotificationForm from "./components/NotificationForm";
import NotificationStats from "./components/NotificationStats";
import { receiverOptions } from "../setting";

 

export default function Notifications() {
    const [selectedReceiver, setselectedReceiver] = useState(receiverOptions[0]);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [totalRows, setTotalRows] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [notificationStats, setNotificationStats] = useState<NotificationResponse['stats'] | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchNotifications = async () => {
            try {
                const response = await getNotifications({
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize,
                    receiver: selectedReceiver.value,
                });

                setNotifications(response.data);
                setNotificationStats(response.stats);

                setTotalRows(Number(response.total));
            } catch {
                setError("Failed to fetch notifications");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [selectedReceiver, pagination.pageIndex, pagination.pageSize]);

    const columns: ColumnDef<NotificationType>[] = useMemo(() => [
        {
            header: 'Receiver',
            accessorFn: (row) => `${row.receiver}`,
            cell: ({ getValue }) => <span>{getValue() as string}</span>,
        },

        {
            header: "Body",
            accessorKey: "body",
            cell: ({ row }) => {
                const body = row.original.body;
                const truncated = body.length > 40 ? body.slice(0, 40) + "..." : body;

                return (
                    <Popover className="relative inline-block">
                        <PopoverButton className="text-sm text-gray-700 cursor-pointer hover:underline focus:outline-none truncate max-w-[200px]">
                            {truncated}
                        </PopoverButton>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-75"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <PopoverPanel
                                className="absolute z-10 mt-0 w-80 max-w-[20rem] p-4 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-800 break-words whitespace-pre-wrap"
                            >
                                {body}
                            </PopoverPanel>
                        </Transition>
                    </Popover>
                );
            },
        },

        {
            header: "Image",
            accessorKey: "image",
            cell: ({ getValue }) => {
                const imageUrl = getValue() as string;

                return (
                    <>
                        <div
                            className="w-12 h-12 relative rounded overflow-hidden border border-gray-200 cursor-pointer"
                            onClick={() => setPreviewImage(imageUrl)}
                        >
                            <Image
                                src={imageUrl || "/placeholder.png"}
                                alt="notification image"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <Transition appear show={previewImage !== null} as={Fragment}>
                            <Dialog as="div" className="relative z-50" onClose={() => setPreviewImage(null)}>
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                                </TransitionChild>

                                <div className="fixed inset-0 overflow-y-auto">
                                    <div className="flex min-h-full items-center justify-center p-4">
                                        <TransitionChild
                                            as={Fragment}
                                            enter="ease-out duration-200"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-150"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <DialogPanel className="relative bg-white rounded-xl p-4 shadow-xl max-w-3xl w-full">
                                                <Image
                                                    src={imageUrl || "/placeholder.png"}
                                                    alt="full image"
                                                    width={800}
                                                    height={600}
                                                    className="w-full h-auto object-contain rounded-md"
                                                />
                                                <button
                                                    onClick={() => setPreviewImage(null)}
                                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                                >
                                                    ✕
                                                </button>
                                            </DialogPanel>
                                        </TransitionChild>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </>
                );
            },
        },

        {
            header: 'CTA',
            accessorKey: 'cta',
            cell: ({ getValue }) => {
                const url = getValue() as string;
                return (
                    <Link href={url} popoverTarget="_blank" className="text-hub-cinnabar-300 underline" target="_blank" rel="noopener noreferrer">
                        {url}
                    </Link>
                );
            },
        },

        {
            header: 'Sent',
            accessorKey: 'created_at',
            cell: ({ getValue }) => formatHumanReadableDate(getValue() as string),
        },

    ], [setPreviewImage, previewImage]);

    return (
        <div className="space-y-6 text-gray-800">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notification</h1>
                    <p className="text-sm text-gray-500">Manage your notification overview here.</p>
                </div>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-amber-500 text-white hover:bg-amber-600"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Send New Notification
                    </button>

                    <div className="w-48">
                        <SelectDropdown
                            options={receiverOptions}
                            value={selectedReceiver}
                            onChange={setselectedReceiver}
                        />
                    </div>
                </div>

            </div>

            {notificationStats && (
                <NotificationStats stats={notificationStats} loading={loading} />
            )}

            <TanStackTable
                data={notifications}
                columns={columns}
                loading={loading}
                error={error}
                pagination={{
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalRows: totalRows,
                }}
                onPaginationChange={(updated) =>
                    setPagination({ pageIndex: updated.pageIndex, pageSize: updated.pageSize })
                }
            />
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Send Notification"
            >
                <NotificationForm onClose={() => setDrawerOpen(false)} />
            </Drawer>
        </div>
    );
}

