import React from "react";
import { FaPrint, FaDownload } from "react-icons/fa";
import dayjs from "dayjs";

export default function OrderHeader({
    orderMeta,
    onPrint,
    onDownloadLabel,
}: {
    orderMeta: any;
    onPrint: () => void;
    onDownloadLabel: () => void;
}) {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    Order Details
                </h1>
                <p className="text-sm text-gray-500">
                    #{orderMeta.id} • Created{" "}
                    {dayjs(orderMeta.created_at).format("DD MMM YYYY, HH:mm")}
                </p>
            </div>
            <div className="flex items-center gap-2"> 
                {orderMeta.tracking_url && (
                    <button
                        onClick={onDownloadLabel}
                        className="btn btn-primary inline-flex items-center gap-2 text-sm"
                    >
                        <FaDownload /> Download Label
                    </button>
                )}
            </div>
        </div>
    );
}
