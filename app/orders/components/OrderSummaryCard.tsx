import { formatAmount } from "@/utils/formatCurrency";

export default function OrderSummaryCard({
    orderMeta,
    product,
    onSettleVendor,
}: {
    orderMeta: any;
    product: any;
    onSettleVendor: () => void;
}) {
    const shippingService = orderMeta.shipping_service_code?.[0] ?? null;
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium uppercase mb-2">
                Order Summary
            </p>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-semibold">
                        {formatAmount(
                            Number(orderMeta.total) -
                                Number(orderMeta.shipping_fee)
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm">Shipping</span>
                    <span className="font-semibold">
                        {formatAmount(Number(orderMeta.shipping_fee || 0))}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <span className="text-lg font-bold">
                        {formatAmount(Number(orderMeta.total))}
                    </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase mb-2">
                        Payment
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="font-medium">
                                {orderMeta.payment_method ?? "—"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Ref: {orderMeta.payment_reference ?? "—"}
                            </p>
                        </div>
                        <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                orderMeta.payment_status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : orderMeta.payment_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {orderMeta.payment_status}
                        </span>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase mb-2">
                        Vendor
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="font-medium">
                                {product.shop?.name ?? "—"}
                            </p>
                            <p className="text-xs text-gray-500">
                                Loation: {product.shop?.city ?? "—"}{" "}
                                {product.shop?.state ?? "—"} {" "}
                                {product.shop?.country ?? "—"}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                    orderMeta.vendor_payment_settlement_status ===
                                    "paid"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {orderMeta.vendor_payment_settlement_status ??
                                    "unpaid"}
                            </span> 
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase mb-2">
                        Shipping
                    </p>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">
                                    {orderMeta.shipping_method ??
                                        shippingService?.carrier ??
                                        "—"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Method / Service:{" "}
                                    {shippingService?.service_code ?? "—"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold">
                                    {formatAmount(
                                        Number(
                                            shippingService?.total ??
                                                orderMeta.shipping_fee ??
                                                0
                                        )
                                    )}{" "}
                                    {shippingService?.currency ?? ""}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Est.{" "}
                                    {shippingService?.estimated_delivery ??
                                        orderMeta.delivery_date ??
                                        "—"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 mr-2">
                                Tracking:
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="font-mono text-sm">
                                    {orderMeta.tracking_number ?? "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
