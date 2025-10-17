"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { changeOrderPaymentStatus, changeOrderStatus, getOrderDetail } from "@/app/api_/orders";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { OrderItem, OrderResponse } from "@/types/OrderType";
import { User } from "@/types/UserType";
import dayjs from "dayjs";
import Address from "@/types/AddressType";
import { formatAmount } from "@/utils/formatCurrency";
import PrintableOrderTable from "../components/PrintableOrderTable";
import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import toast from "react-hot-toast";

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

function CustomerSummary({ customer, address, stats }: { customer: User; address: Address; stats?: OrderResponse["data"]["stats"] }) {
    return (
        <div className="bg-white rounded-xl p-6 flex items-center justify-between shadow-sm  border border-gray-200 text-sm text-gray-700">
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className="relative w-14 h-14 rounded-full border-4 border-orange-500 overflow-hidden">
                    <Image
                        src={customer.profile_photo}
                        alt={`${customer.name}'s profile`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <p className="font-medium text-gray-800">
                        {customer.name} {customer.last_name}
                    </p>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                </div>
            </div>

            <div className="w-px h-16 bg-gray-200 mx-6" />

            <div className="space-y-1 min-w-[200px]">
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Personal Information</p>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Phone no</span>
                    <span className="text-gray-600">{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Member Since</span>
                    <span className="text-gray-600"> {dayjs(customer.created_at).format("DD MMM. YYYY")}</span>
                </div>
            </div>

            <div className="w-px h-16 bg-gray-200 mx-6" />

            <div className="flex flex-col gap-2 min-w-[300px]">
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase mb-1">Shipping Address</p>
                    {address ? (
                        <p className="text-gray-700">
                            {[address.street_address, address.zip_code, address.state, address.city, address.country]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">Not provided</p>
                    )}
                </div>
                <div className="flex gap-12 mt-1 text-center text-xl text-gray-900">
                    <div>
                        <p className="font-bold ">
                            {formatAmount(stats?.total_revenue || 0)}
                        </p>
                        <p className="text-xs text-gray-500">Overall spent</p>
                    </div>
                    <div>
                        <p className="font-bold ">{stats?.total_orders || 0}</p>
                        <p className="text-xs text-gray-500">Overall orders</p>
                    </div>
                    <div>
                        <p className="font-bold ">{stats?.total_completed || 0}</p>
                        <p className="text-xs text-gray-500">Overall completed</p>
                    </div>
                    <div>
                        <p className="font-bold ">{stats?.total_cancelled || 0}</p>
                        <p className="text-xs text-gray-500">Overall canceled</p>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default function OrderDetail() {
    const params = useParams();
    const orderId = params?.id as string | undefined;
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<OrderResponse["data"]["stats"] | null>(null);

    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(statusOptions[0]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;

            try {
                const response = await getOrderDetail(orderId);
                setStats(response.data.stats);
                setOrder(response.data.order_item);
            } catch (err) {
                console.error("Failed to load order detail", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading || !order) return <Skeleton count={10} />;

    const { product, quantity, price, subtotal, order: orderMeta } = order;
    const { shop } = product;
    const customer = orderMeta.customer;
    const address = orderMeta.address;




    const handleStatusChange = async (status: { label: string; value: string }) => {
        if (!order) return;

        setSelectedStatus(status);
        setUpdating(true);

        try {
            const response = await changeOrderStatus(order?.order?.id, status.value);

            if (response?.success || response?.status === "success") {
                setOrder((prev) =>
                    prev
                        ? {
                            ...prev,
                            order: {
                                ...prev.order,
                                shipping_status: status.value,
                            },
                        }
                        : prev
                );
                toast.success("Shipping status updated successfully");
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    };
    const handlePaymentStatusChange = async (status: { label: string; value: string }) => {
        if (!order) return;

        setSelectedPaymentStatus(status);
        setUpdating(true);

        try {
            const response = await changeOrderPaymentStatus(order?.order?.id, status.value);

            if (response?.success || response?.status === "success") {
                setOrder((prev) =>
                    prev
                        ? {
                            ...prev,
                            order: {
                                ...prev.order,
                                payment_status: status.value,
                            },
                        }
                        : prev
                );
                toast.success("Payment status updated successfully");
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Failed to update payment status", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="p-6 text-gray-600 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    Order Details - #{orderMeta.id}
                </h1>
                <div className="flex items-center gap-2">
                    {orderMeta.shipping_status === "pending" && orderMeta.payment_status === "pending" && (
                        <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md text-sm font-medium">
                            Cancel Order
                        </button>
                    )}

                    <div className="flex items-center gap-2">
                        <p className="text-gray-500 text-sm">Shipping status</p>
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

            <CustomerSummary customer={customer} address={address} stats={stats} />

            <PrintableOrderTable
                product={product}
                quantity={quantity}
                price={price}
                subtotal={subtotal}
                orderMeta={orderMeta}
                shop={shop}
            />

        </div>
    );
}
