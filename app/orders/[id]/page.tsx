"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    changeOrderPaymentStatus,
    changeOrderStatus,
    getOrderDetail,
} from "@/lib/api/orders";
import Skeleton from "react-loading-skeleton";
import { OrderItem, OrderResponse } from "@/types/OrderType";
import toast from "react-hot-toast";
import OrderControls from "../components/OrderControls";
import OrderHeader from "../components/OrderHeader";
import OrderSummaryCard from "../components/OrderSummaryCard";
import OrderTimeline from "../components/OrderTimeline";
import PrintableOrderTable from "../components/PrintableOrderTable";
import ProductCard from "../components/ProductCard";
import CustomerSummary from "../components/CustomerSummary";

const statusOptions = [
    { label: "Pending", value: "pending" },
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

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params?.id as string | undefined;

    const [order, setOrder] = useState<OrderItem | null>(null);
    const [stats, setStats] = useState<OrderResponse["data"]["stats"] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Controlled selects (always declared)
    const [selectedStatus, setSelectedStatus] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<{
        label: string;
        value: string;
    } | null>(null);

    // UI
    const [activeImage, setActiveImage] = useState<string | null>(null);

    // Derived shallow values (safe to compute even when order is null)
    const orderMeta = order?.order ?? null;
    const product = order?.product ?? null;
    const quantity = order?.quantity ?? 0;
    const price = order?.price ?? "0.00";
    const subtotal = order?.subtotal ?? "0.00";

    // TIMELINE: useMemo is declared unconditionally so hooks order never changes
    const timeline = useMemo(() => {
        if (!orderMeta) return [];
        return [
            { label: "Order created", ts: orderMeta.created_at, done: true },
            {
                label: "Payment",
                ts: orderMeta.payment_date ?? null,
                done: !!orderMeta.payment_date,
            },
            {
                label: "Shipped",
                ts: orderMeta.shipping_date ?? null,
                done:
                    orderMeta.shipping_status !== "pending" &&
                    !!orderMeta.shipping_date,
            },
            {
                label: "Delivered",
                ts: orderMeta.delivery_date ?? null,
                done:
                    orderMeta.shipping_status === "delivered" ||
                    !!orderMeta.delivery_date,
            },
        ];
    }, [orderMeta]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            setLoading(true);
            try {
                const res = await getOrderDetail(orderId);
                setOrder(res.data.order_item);
                setStats(res.data.stats);

                const shippingStatus =
                    res.data.order_item?.order?.shipping_status ?? "pending";
                const paymentStatus =
                    res.data.order_item?.order?.payment_status ?? "pending";
                const foundShipping =
                    statusOptions.find((s) => s.value === shippingStatus) ??
                    statusOptions[0];
                const foundPayment =
                    paymentStatusOptions.find(
                        (p) => p.value === paymentStatus,
                    ) ?? paymentStatusOptions[0];
                setSelectedStatus(foundShipping);
                setSelectedPaymentStatus(foundPayment);

                const imgs = res.data.order_item?.product?.images ?? [];
                setActiveImage(imgs.length ? imgs[0] : null);
            } catch (err) {
                console.error("Failed to load order detail", err);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const onStatusChange = async (status: { label: string; value: string }) => {
        if (!order || !order?.order) return;
        setSelectedStatus(status);
        setUpdating(true);
        try {
            const res = await changeOrderStatus(order.order.id, status.value);
            if (res?.success || res?.status === "success") {
                setOrder((prev) =>
                    prev
                        ? {
                              ...prev,
                              order: {
                                  ...prev.order,
                                  shipping_status: status.value,
                              },
                          }
                        : prev,
                );
                toast.success("Shipping status updated");
            } else {
                toast.error("Failed to update shipping status");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update shipping status");
        } finally {
            setUpdating(false);
        }
    };

    const onPaymentStatusChange = async (status: {
        label: string;
        value: string;
    }) => {
        if (!order || !order?.order) return;
        setSelectedPaymentStatus(status);
        setUpdating(true);
        try {
            const res = await changeOrderPaymentStatus(
                order.order.id,
                status.value,
            );
            if (res?.success || res?.status === "success") {
                setOrder((prev) =>
                    prev
                        ? {
                              ...prev,
                              order: {
                                  ...prev.order,
                                  payment_status: status.value,
                              },
                          }
                        : prev,
                );
                toast.success("Payment status updated");
            } else {
                toast.error("Failed to update payment status");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to update payment status");
        } finally {
            setUpdating(false);
        }
    };

    // Utility actions (handlers passed to child components)
    const handleCopyTracking = async () => {
        if (!orderMeta?.tracking_number) {
            toast.error("No tracking number");
            return;
        }
        try {
            await navigator.clipboard.writeText(orderMeta.tracking_number);
            toast.success("Copied");
        } catch {
            toast.error("Copy failed");
        }
    };
    const handleOpenTrackingUrl = () => {
        if (!orderMeta?.tracking_url) {
            toast.error("No tracking URL");
            return;
        }
        window.open(orderMeta.tracking_url, "_blank");
    };
    const handleDownloadLabel = () => {
        if (!orderMeta?.tracking_url) {
            toast.error("No label");
            return;
        }
        window.open(orderMeta.tracking_url, "_blank");
    };
    const handleCancelOrder = () => {
        if (!orderMeta) return;
        setSelectedStatus({ label: "Cancelled", value: "cancelled" });
        setOrder((prev) =>
            prev
                ? {
                      ...prev,
                      order: { ...prev.order, shipping_status: "cancelled" },
                  }
                : prev,
        );
        toast.success("Order marked cancelled (UI)");
    };

    // const handleSettleVendor = () => {
    //     if (!orderMeta) return;
    //     if (orderMeta.vendor_payment_settlement_status === "paid") {
    //         toast.error("Vendor already settled");
    //         return;
    //     }
    //     setOrder((prev) =>
    //         prev
    //             ? {
    //                 ...prev,
    //                 order: {
    //                     ...prev.order,
    //                     vendor_payment_settlement_status: "paid",
    //                 },
    //             }
    //             : prev
    //     );
    //     toast.success("Vendor marked settled (UI)");
    // };

    if (loading || !order || !product || !orderMeta)
        return <Skeleton height={160} count={4} />;

    return (
        <div className="p-0 text-gray-700 space-y-6">
            <OrderHeader
                orderMeta={orderMeta}
                onDownloadLabel={handleDownloadLabel}
            />
            <div className="flex w-full">
                <CustomerSummary
                    customer={orderMeta.customer}
                    address={orderMeta.address}
                    stats={stats ?? undefined}
                />
            </div>
            <div>
                <OrderSummaryCard orderMeta={orderMeta} product={product} />
            </div>

            <OrderControls
                statusOptions={statusOptions}
                paymentStatusOptions={paymentStatusOptions}
                selectedStatus={selectedStatus}
                selectedPaymentStatus={selectedPaymentStatus}
                onStatusChange={onStatusChange}
                onPaymentStatusChange={onPaymentStatusChange}
                updating={updating}
                canCancel={
                    orderMeta.shipping_status === "pending" &&
                    orderMeta.payment_status === "pending"
                }
                onCancelOrder={handleCancelOrder}
                customerEmail={orderMeta.customer?.email}
            />

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                    <ProductCard
                        product={product}
                        activeImage={activeImage}
                        setActiveImage={setActiveImage}
                        quantity={quantity}
                        unitPrice={price}
                    />
                </div>
                <div className="col-span-2">
                    <PrintableOrderTable
                        product={product}
                        quantity={quantity}
                        price={price}
                        subtotal={subtotal}
                        orderMeta={orderMeta}
                        shop={product.shop}
                    />
                </div>
            </div>

            <OrderTimeline
                timeline={timeline}
                onCopyTracking={handleCopyTracking}
                onOpenTracking={handleOpenTrackingUrl}
            />
        </div>
    );
}
