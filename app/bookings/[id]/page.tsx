"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { changeOrderPaymentStatus, changeOrderStatus } from "@/lib/api/orders";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { formatAmount } from "@/utils/formatCurrency";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";
import { getBookingDetail } from "@/lib/api/bookings";
// Reverted to React Icons
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiShield,
    FiUser,
    FiMail,
    FiPhone,
} from "react-icons/fi";

const statusOptions = [
    { label: "Processing", value: "processing" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
];

const paymentStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Refunded", value: "refunded" },
];

function CustomerSummary({ customer, stats }: { customer: any; stats: any }) {
    return (
        <div className="flex flex-wrap items-center justify-between p-6 text-sm bg-white border shadow-sm rounded-xl border-gray-50">
            <div className="flex items-center gap-4 min-w-[250px]">
                <div className="relative w-16 h-16 overflow-hidden border-2 rounded-full border-ayokah-primary">
                    <Image
                        src={customer.profile_photo}
                        alt={customer.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="flex items-center gap-1 text-base font-bold text-gray-800">
                        <FiUser className="text-gray-400" /> {customer.name}
                    </p>
                    <p className="flex items-center gap-1 text-gray-500">
                        <FiMail /> {customer.email}
                    </p>
                    <p className="flex items-center gap-1 text-gray-500">
                        <FiPhone /> {customer.phone}
                    </p>
                </div>
            </div>

            <div className="hidden w-px h-16 bg-gray-100 md:block" />

            <div className="space-y-2 min-w-[200px]">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <FiMapPin /> Service Address
                </p>
                <p className="text-gray-700 leading-relaxed max-w-[200px]">
                    {customer.address || "No address provided"}
                </p>
            </div>

            <div className="hidden w-px h-16 bg-gray-100 md:block" />

            <div className="flex gap-8 p-4 text-center rounded-lg bg-gray-50">
                <div>
                    <p className="font-bold text-gray-900">
                        {stats?.total_bookings || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">
                        Bookings
                    </p>
                </div>
                <div>
                    <p className="font-bold text-ayokah-secondary">
                        {formatAmount(stats?.total_revenue || 0)}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">Spent</p>
                </div>
                <div>
                    <p className="font-bold text-ayokah-primary">
                        {stats?.total_completed || 0}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">
                        Completed
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OrderDetail() {
    const params = useParams();
    const orderId = params?.id as string | undefined;

    const [booking, setBooking] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const response = await getBookingDetail(orderId);
                setStats(response.data.stats);
                setBooking(response.data.booking);
            } catch (err) {
                console.error("Failed to load booking", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading || !booking)
        return (
            <div className="p-6">
                <Skeleton height={40} count={5} />
            </div>
        );

    const handleStatusChange = async (val: any, type: "order" | "payment") => {
        setUpdating(true);
        try {
            if (type === "order")
                await changeOrderStatus(booking.id, val.value);
            else await changeOrderPaymentStatus(booking.id, val.value);

            setBooking((prev: any) => ({
                ...prev,
                [type === "order" ? "delivery_status" : "payment_status"]:
                    val.value,
            }));
            toast.success("Status updated successfully");
        } catch {
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };
    const getCountdown = (startDate: string, endDate: string) => {
        const now = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (now.isAfter(end))
            return { text: "Service Delivered", color: "text-gray-400" };
        if (now.isAfter(start) && now.isBefore(end))
            return { text: "Currently In Progress", color: "text-ayokah-primary" };

        const diffDays = start.diff(now, "day");
        const diffHours = start.diff(now, "hour");

        if (diffDays > 0) {
            return {
                text: `${diffDays} ${diffDays === 1 ? "day" : "days"} remaining`,
                color: "text-ayokah-secondary",
            };
        }
        return {
            text: `${diffHours} ${diffHours === 1 ? "hour" : "hours"} remaining`,
            color: "text-ayokah-secondary/20",
        };
    };

    const countdown = getCountdown(booking.start_date, booking.end_date);

    return (
        <div className="p-6 mx-auto space-y-6 text-gray-600 bg-white rounded-md max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Booking Details - #{booking.id}
                    </h1>
                    <p className="mt-1 text-sm text-gray-400">
                        Service Method:{" "}
                        <span className="font-semibold uppercase text-ayokah-secondary">
                            {booking.delivery_method}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 p-3 bg-white border shadow-sm rounded-xl border-gray-50">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                            Service Status
                        </span>
                        <SelectDropdown
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    (o) => o.value === booking.delivery_status,
                                ) || statusOptions[0]
                            }
                            onChange={(val) => handleStatusChange(val, "order")}
                            disabled={updating}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                            Payment Status
                        </span>
                        <SelectDropdown
                            options={paymentStatusOptions}
                            value={
                                paymentStatusOptions.find(
                                    (o) => o.value === booking.payment_status,
                                ) || paymentStatusOptions[0]
                            }
                            onChange={(val) =>
                                handleStatusChange(val, "payment")
                            }
                            disabled={updating}
                        />
                    </div>
                </div>
            </div>

            <CustomerSummary customer={booking.customer} stats={stats} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Service Card */}
                <div className="overflow-hidden bg-white border shadow-sm lg:col-span-2 rounded-xl border-gray-50">
                    <div className="flex items-center gap-2 p-4 font-bold text-gray-700 border-b bg-gray-50">
                        <FiShield className="text-ayokah-primary" /> Booked Service
                        Information
                    </div>
                    <div className="flex flex-col gap-6 p-6 md:flex-row">
                        <div className="relative w-full h-40 overflow-hidden rounded-lg md:w-40">
                            <Image
                                src={booking.service.image}
                                alt="service"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900">
                                {booking.service.title}
                            </h2>
                            <p className="mb-4 text-sm font-medium text-ayokah-secondary">
                                By {booking.shop.name}
                            </p>

                            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-dashed sm:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-ayokah-primary/10 text-ayokah-secondary">
                                        <FiCalendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                                            Start Date
                                        </p>
                                        <p className="text-sm font-bold">
                                            {dayjs(booking.start_date).format(
                                                "DD MMM, YYYY",
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-ayokah-primary/10 text-ayokah-secondary">
                                        <FiClock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                                            Time Window
                                        </p>
                                        <p className="text-sm font-bold">
                                            {dayjs(booking.start_date).format(
                                                "hh:mm A",
                                            )}{" "}
                                            -{" "}
                                            {dayjs(booking.end_date).format(
                                                "hh:mm A",
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* New Countdown Section */}
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                                    <div
                                        className={`p-2 rounded-lg bg-gray-50 ${countdown.color}`}
                                    >
                                        <FiClock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                                            Countdown
                                        </p>
                                        <p
                                            className={`text-sm font-black ${countdown.color}`}
                                        >
                                            {countdown.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Sidebar */}
                <div className="p-6 space-y-6 bg-white border shadow-sm rounded-xl border-gray-50">
                    <h3 className="pb-2 font-bold text-gray-800 border-b">
                        Financial Details
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Service Fee</span>
                            <span className="font-semibold text-gray-800">
                                {formatAmount(booking.amount)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                            <span className="font-bold text-gray-900">
                                Total Payable
                            </span>
                            <span className="text-xl font-black text-ayokah-secondary">
                                {formatAmount(booking.amount)}
                            </span>
                        </div>
                    </div>
                    <div className="bg-ayokah-primary/10 p-3 rounded-lg text-[11px] text-ayokah-secondary not-[]:leading-relaxed border border-ayokah-primary/50">
                        * This booking is for a{" "}
                        <strong>{booking.delivery_method}</strong> session.
                        Ensure the customer is available during the selected
                        time slot.
                    </div>
                </div>
            </div>
        </div>
    );
}
