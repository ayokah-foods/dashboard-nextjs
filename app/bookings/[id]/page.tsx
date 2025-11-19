"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
    getBookingDetail,
    changeBookingPaymentStatus,
    changeBookingStatus,
} from "@/lib/api_/bookings";
import { BookingItem, BookingResponse } from "@/types/BookingType";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import CustomerSummary from "../components/CustomerSummary"; // ✅ assuming you’ve modularized it

const statusOptions = [
    { label: "Processing", value: "processing" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Returned", value: "returned" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
];

const paymentStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Completed", value: "completed" },
    { label: "Refunded", value: "refunded" },
];

export default function BookingDetail() {
    const params = useParams();
    const bookingId = params?.id as string | undefined;

    const [booking, setBooking] = useState<BookingItem | null>(null);
    const [stats, setStats] = useState<BookingResponse["data"]["stats"] | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
        paymentStatusOptions[0]
    );

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            try {
                const response = await getBookingDetail(bookingId);
                setBooking(response.data.booking);
                setStats(response.data.stats);

                // 🟢 Set dropdowns to current values
                const delivery = statusOptions.find(
                    (opt) => opt.value === response.data.booking.delivery_status
                );
                const payment = paymentStatusOptions.find(
                    (opt) => opt.value === response.data.booking.payment_status
                );

                if (delivery) setSelectedStatus(delivery);
                if (payment) setSelectedPaymentStatus(payment);
            } catch (err) {
                console.error("Failed to load booking detail", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    if (loading || !booking) return <Skeleton count={10} />;

    const handleStatusChange = async (status: {
        label: string;
        value: string;
    }) => {
        if (!booking) return;
        setSelectedStatus(status);
        setUpdating(true);
        try {
            const response = await changeBookingStatus(
                booking.id,
                status.value
            );
            if (response?.status === "success") {
                setBooking((prev) =>
                    prev ? { ...prev, delivery_status: status.value } : prev
                );
                toast.success("Delivery status updated successfully");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentStatusChange = async (status: {
        label: string;
        value: string;
    }) => {
        if (!booking) return;
        setSelectedPaymentStatus(status);
        setUpdating(true);
        try {
            const response = await changeBookingPaymentStatus(
                booking.id,
                status.value
            );
            if (response?.status === "success") {
                setBooking((prev) =>
                    prev ? { ...prev, payment_status: status.value } : prev
                );
                toast.success("Payment status updated successfully");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    // 🧩 Map booking data for PrintableOrderTable compatibility
    const product = {
        title: booking.service.title,
        image: booking.service.image,
        shop: booking.shop,
    };
    const quantity = 1;
    const price = parseFloat(booking.amount);
    const subtotal = parseFloat(booking.amount);
    const bookingMeta = {
        id: booking.id,
        shipping_status: booking.delivery_status,
        payment_status: booking.payment_status,
        created_at: booking.created_at,
        start_date: booking.start_date,
        end_date: booking.end_date,
        service: booking.service,
        customer: booking.customer,
        vendor: booking.vendor,
        shop: booking.shop,
    };

    return (
        <div className="p-6 text-gray-600 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Booking Details - #{booking.id}
                </h1>

                <div className="flex items-center gap-2">
                    {bookingMeta.shipping_status === "pending" &&
                        bookingMeta.payment_status === "pending" && (
                            <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md text-sm font-medium">
                                Cancel Booking
                            </button>
                        )}

                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-sm">Delivery status</p>
                        <SelectDropdown
                            options={statusOptions}
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            disabled={updating}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-sm">Payment status</p>
                        <SelectDropdown
                            options={paymentStatusOptions}
                            value={selectedPaymentStatus}
                            onChange={handlePaymentStatusChange}
                            disabled={updating}
                        />
                    </div>
                </div>
            </div>

            <CustomerSummary
                customer={booking.customer}
                address={
                    booking.customer?.address
                        ? { street_address: booking.customer.address }
                        : null
                }
                stats={stats}
            />
        </div>
    );
}
