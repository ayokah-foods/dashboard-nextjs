"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { changeOrderPaymentStatus, changeOrderStatus } from "@/lib/api_/orders"; // ← if you have booking endpoints, replace these
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import PrintableOrderTable from "../components/PrintableOrderTable";
import { getBookingDetail } from "@/lib/api_/bookings";
import { formatAmount } from "@/utils/formatCurrency";
import { User } from "@/types/UserType";

// --- options (keep as before) ---
const statusOptions = [
    { label: "Processing", value: "processing" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Returned", value: "returned" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
];

const paymentStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Cancel", value: "cancelled" },
    { label: "Completed", value: "completed" },
    { label: "Refund", value: "refunded" },
];

// --- small local types to avoid TS issues (adjust or import your real types) ---
type BookingService = {
    title?: string;
    image?: string;
};

type User = {
    name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    profile_photo?: string;
    created_at?: string;
    address?: string;
};

type BookingShop = {
    name?: string | null;
    logo?: string | null;
};

type BookingMeta = {
    id: number;
    shipping_status?: string; // keep old naming for compatibility, map if needed
    payment_status?: string;
};

type BookingResponse = {
    booking: {
        id: number;
        amount: string | number;
        delivery_status?: string;
        payment_status?: string;
        delivery_method?: string;
        start_date?: string;
        end_date?: string;
        created_at?: string;
        service?: BookingService;
        customer?: User;
        vendor?: { name?: string; email?: string };
        shop?: BookingShop;
        address?: string;
    };
    stats?: {
        total_bookings?: number;
        total_completed?: number;
        total_cancelled?: number;
        total_revenue?: string | number;
    };
};

// ---------- Customer summary component ----------
function CustomerSummary({
    customer,
    address,
    stats,
}: {
    customer: User;
    address: any | null;
    stats?: BookingResponse["stats"];
}) {
    if (!customer) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-sm text-gray-700">
                <p className="text-gray-500">
                    Customer information not available.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 flex items-center justify-between shadow-sm border border-gray-200 text-sm text-gray-700">
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="relative w-14 h-14 rounded-full border-4 border-orange-500 overflow-hidden bg-gray-100">
                    <Image
                        src={
                            customer.profile_photo ||
                            "/images/avatar-placeholder.png"
                        }
                        alt={`${customer.name ?? "User"}'s profile`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium text-gray-800">
                        {customer.name} {customer.last_name || ""}
                    </p>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                </div>
            </div>

            <div className="w-px h-16 bg-gray-200 mx-6" />

            <div className="space-y-1 min-w-[200px]">
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                    Personal Information
                </p>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone no</span>
                    <span className="text-gray-600">
                        {customer.phone ?? "—"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                        Member Since
                    </span>
                    <span className="text-gray-600">
                        {customer.created_at
                            ? dayjs(customer.created_at).format("DD MMM. YYYY")
                            : "—"}
                    </span>
                </div>
            </div>

            <div className="w-px h-16 bg-gray-200 mx-6" />

            <div className="flex flex-col gap-2 min-w-[300px]">
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                        Contact Address
                    </p>
                    {customer.address ? (
                        <p className="text-gray-700">
                            {[customer.address].filter(Boolean).join(", ")}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">Not provided</p>
                    )}
                </div>

                <div className="flex gap-12 mt-1 text-center text-xl text-gray-900">
                    <div>
                        <p className="font-bold ">
                            {formatAmount(Number(stats?.total_revenue ?? 0))}
                        </p>
                        <p className="text-xs text-gray-500">Overall spent</p>
                    </div>
                    <div>
                        <p className="font-bold ">
                            {stats?.total_bookings ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">
                            Overall bookings
                        </p>
                    </div>
                    <div>
                        <p className="font-bold ">
                            {stats?.total_completed ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">
                            Overall completed
                        </p>
                    </div>
                    <div>
                        <p className="font-bold ">
                            {stats?.total_cancelled ?? 0}
                        </p>
                        <p className="text-xs text-gray-500">
                            Overall canceled
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------- Main component ----------
export default function BookingDetail() {
    const params = useParams();
    const bookingId = params?.id as string | undefined;
    const [bookingResponse, setBookingResponse] =
        useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // selected statuses
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(
        paymentStatusOptions[0]
    );

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            setLoading(true);

            try {
                const response = await getBookingDetail(bookingId);
                // expected shape: { status: 'success', data: { booking: {...}, stats: {...} } }
                if (response?.data) {
                    setBookingResponse(response.data as BookingResponse);
                    // set selected statuses from returned booking (if present)
                    const b = response.data.booking;
                    if (b?.delivery_status) {
                        const found = statusOptions.find(
                            (s) => s.value === b.delivery_status
                        );
                        if (found) setSelectedStatus(found);
                    }
                    if (b?.payment_status) {
                        const foundP = paymentStatusOptions.find(
                            (s) => s.value === b.payment_status
                        );
                        if (foundP) setSelectedPaymentStatus(foundP);
                    }
                } else {
                    console.error("Unexpected response shape", response);
                }
            } catch (err) {
                console.error("Failed to load booking detail", err);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) return <Skeleton count={6} />;

    if (!bookingResponse) {
        return <div className="p-6">No booking data available.</div>;
    }

    const booking = bookingResponse.booking;
    const stats = bookingResponse.stats ?? null;

    // Map booking->product-like shape used in PrintableOrderTable
    // PrintableOrderTable previously expected { product, quantity, price, subtotal, orderMeta, shop }
    // We create a compatible shape:
    const product = {
        title: booking.service?.title ?? "Service",
        images: booking.service?.image ? [booking.service.image] : [],
        shop: booking.shop ?? {
            name: booking.vendor?.name ?? "N/A",
            logo: booking.shop?.logo ?? null,
        },
    };

    const quantity = 1; // bookings usually single service
    const price = Number(booking.amount ?? 0);
    const subtotal = price * quantity;

    const bookingMeta = {
        id: booking.id,
        shipping_status: booking.delivery_status ?? "processing",
        payment_status: booking.payment_status ?? "pending",
        // keep any other old keys used by PrintableOrderTable if necessary
        customer: booking.customer,
        address: booking.address ?? null,
    };

    // Handlers - using changeOrderStatus/changeOrderPaymentStatus a.k.a existing API helpers.
    // If you have booking-specific endpoints, replace these with them.
    const handleStatusChange = async (status: {
        label: string;
        value: string;
    }) => {
        if (!booking) return;
        setSelectedStatus(status);
        setUpdating(true);

        try {
            // note: changeOrderStatus expects an id; we pass booking id
            const response = await changeOrderStatus(booking.id, status.value);
            if (response?.success || response?.status === "success") {
                toast.success("Delivery status updated");
            } else {
                toast.error("Could not update status");
                console.error("Unexpected response:", response);
            }
        } catch (err) {
            console.error("Failed to update status", err);
            toast.error("Failed to update status");
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
            const response = await changeOrderPaymentStatus(
                booking.id,
                status.value
            );
            if (response?.success || response?.status === "success") {
                toast.success("Payment status updated");
            } else {
                toast.error("Could not update payment status");
                console.error("Unexpected response:", response);
            }
        } catch (err) {
            console.error("Failed to update payment status", err);
            toast.error("Failed to update payment status");
        } finally {
            setUpdating(false);
        }
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
                customer={booking.customer ?? null}
                address={booking.address ?? null}
                stats={stats}
            />

            <PrintableOrderTable
                product={product}
                quantity={quantity}
                price={price}
                subtotal={subtotal}
                orderMeta={bookingMeta}
                shop={product.shop}
            />
        </div>
    );
}
