"use client";
import React from "react";
import Image from "next/image";
import StatusBadge from "@/utils/StatusBadge";
import { formatAmount } from "@/utils/formatCurrency";

interface Props {
    product: {
        title: string;
        description: string;
        images?: string[];
    };
    quantity: number;
    price: number | string;
    subtotal: number | string;
    orderMeta: {
        shipping_status: string;
        shipping_fee: string | number;
        total: string | number;
        payment_status: string;
    };
    shop?: {
        name: string;
        logo: string;
    };
}

const PrintableOrderTable = ({
    product,
    quantity,
    price,
    orderMeta,
    shop,
}: Props) => {
    const productSubtotal = Number(price) * Number(quantity);
    const shippingFee = Number(orderMeta.shipping_fee);
    const grandTotal = productSubtotal + shippingFee;
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Order Items Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-separate border-spacing-y-2">
                    <thead className="text-sm text-gray-600">
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left">#</th>
                            <th className="py-3 px-4 text-left">Product</th>
                            <th className="py-3 px-4 text-left">Qty</th>
                            <th className="py-3 px-4 text-left">Vendor</th>
                            <th className="py-3 px-4 text-left">Unit Price</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Shipping Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        <tr className="bg-gray-50 hover:bg-gray-100 transition rounded-md">
                            <td className="py-3 px-4 align-top">1</td>
                            <td className="py-3 px-4 flex items-center gap-3">
                                <Image
                                    src={product.images?.[0] || "/no-image.png"}
                                    width={50}
                                    height={50}
                                    alt={product.title}
                                    className="rounded-md border object-cover w-12 h-12"
                                />
                                <p
                                    className="truncate text-sm text-gray-600 font-medium min-w-0"
                                    title="{product.title}"
                                >
                                    {product.title}
                                </p>
                            </td>

                            <td className="py-3 px-4 align-top">{quantity}</td>
                            <td className="py-3 px-4 align-top">{shop?.name || "N/A"}</td>
                            <td className="py-3 px-4 align-top font-medium">
                                {formatAmount(price)}
                            </td>
                            <td className="py-3 px-4 align-top font-semibold">
                                {formatAmount(productSubtotal)}
                            </td>
                            <td className="py-3 px-4 align-top">
                                <StatusBadge status={orderMeta.shipping_status} type="shipping" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals Summary */}
            <div className="border border-gray-200 rounded-lg p-4 max-w-md ml-auto space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                        {formatAmount(productSubtotal)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">
                        {formatAmount(shippingFee)}
                    </span>
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-base font-semibold">
                    <span>Grand Total</span>
                    <span>
                        {formatAmount(grandTotal)}
                    </span>
                </div>
            </div>


            {/* Payment Status */}
            <div className="flex justify-end">
                <span className="text-xs text-gray-500 items-center flex gap-2">Payment Status: </span>   <StatusBadge status={orderMeta.payment_status} type="payment" />
            </div>

        </div>
    );
};

export default PrintableOrderTable;
