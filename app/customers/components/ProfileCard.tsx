"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import clsx from "clsx";
import { UserDetailResponse } from "@/types/UserType";
import { changeUserStatus, deleteUser } from "@/app/api_/users";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";
import ConfirmationModal from "@/app/components/commons/ConfirmationModal";

interface ProfileCardProps {
    user: UserDetailResponse | null;
    loading: boolean;
}

export default function ProfileCard({ user: initialUser, loading }: ProfileCardProps) {
    const [user, setUser] = useState<UserDetailResponse | null>(initialUser);
    const [updating, setUpdating] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const [selectedStatus, setSelectedStatus] = useState({
        label: initialUser?.is_active ? "Active" : "Inactive",
        value: initialUser?.is_active ? "true" : "false",
    });

    const handleStatusChange = async (option: { label: string; value: string }) => {
        if (!user?.id) return;

        setSelectedStatus(option);
        setUpdating(true);

        try {
            const isActiveBoolean = option.value === "true";
            await changeUserStatus(user.id.toString(), isActiveBoolean);

            setUser((prev) =>
                prev ? { ...prev, is_active: isActiveBoolean } : prev
            );

            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Failed to update user status", error);
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const statusOptions = [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
    ];


    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <div className="relative h-24 bg-gradient-to-r from-orange-400 to-yellow-400" />

            <div className="relative -mt-10 px-6 pb-24">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {loading ? (
                        <Skeleton circle width={80} height={80} />
                    ) : (
                        <div className="w-20 h-20 relative border-4 border-white rounded-full overflow-hidden shadow-md">
                            <Image
                                fill
                                src={user?.profile_photo ?? "/placeholder.jpg"}
                                alt={user?.name ?? "User"}
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="flex-1 mt-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            {loading ? <Skeleton width={120} /> : `${user?.name} ${user?.last_name}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {loading ? <Skeleton width={160} /> : user?.email}
                        </p>

                        <div className="flex gap-2 mt-2 items-center">
                            {loading ? (
                                <Skeleton width={100} height={30} />
                            ) : (
                                <span
                                    className={clsx(
                                        "px-2 py-0.5 text-xs rounded-full font-semibold",
                                        user?.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    )}
                                >
                                    {user?.is_active ? "Active" : "Inactive"}
                                </span>
                            )}
                            {loading ? (
                                <Skeleton width={80} />
                            ) : (
                                <span
                                    className={clsx(
                                        "px-2 py-0.5 text-xs rounded-full font-semibold",
                                        user?.email_verified_at ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                                    )}
                                >
                                    {user?.email_verified_at ? "Email Verified" : "Email Unverified"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                        <p className="text-gray-400 font-semibold uppercase text-xs mb-1">Personal Info</p>
                        <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {loading ? <Skeleton width={100} /> : user?.phone ?? "N/A"}
                        </p>
                        <p>
                            <span className="font-medium">Member Since:</span>{" "}
                            {loading ? (
                                <Skeleton width={120} />
                            ) : user?.created_at ? (
                                new Date(user.created_at).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })
                            ) : (
                                "N/A"
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400 font-semibold uppercase text-xs mb-1">Shipping Address</p>
                        {loading ? (
                            <Skeleton width={180} />
                        ) : user?.address ? (
                            <p className="text-gray-700">
                                {[user.address.street_address, user.address.city, user.address.state, user.address.country]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        ) : (
                            <p className="text-gray-500">Not provided</p>
                        )}
                    </div>

                    <div>
                        <p className="text-gray-400 font-semibold uppercase text-xs mb-1">User Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-40">
                                {selectedStatus && (
                                    <SelectDropdown
                                        options={statusOptions}
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        disabled={updating}
                                    />
                                )}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                            >
                                Delete
                            </button>

                            <ConfirmationModal
                                isOpen={isDeleteModalOpen}
                                onClose={() => {
                                    setIsDeleteModalOpen(false);
                                    setConfirmText("");
                                }}
                                title="Delete User"
                            >
                                <p className="text-sm text-gray-600">
                                    To confirm, please type <span className="font-semibold text-red-600">DELETE</span> below.
                                </p>

                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mt-2"
                                />

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={confirmText !== "DELETE"}
                                        onClick={async () => {
                                            try {
                                                await deleteUser(user?.id?.toString() ?? "");
                                                toast.success("User deleted successfully");
                                                setIsDeleteModalOpen(false);
                                                window.location.href = "/users";
                                            } catch (error) {
                                                console.error("Failed to delete user", error);
                                                toast.error("Failed to delete user");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md text-white transition ${confirmText === "DELETE"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-red-300 cursor-not-allowed"
                                            }`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </ConfirmationModal>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
