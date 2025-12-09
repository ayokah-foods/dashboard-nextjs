import SelectDropdown from "@/app/components/commons/Fields/SelectDropdown";
import { FaEnvelope } from "react-icons/fa";

export default function OrderControls({
    statusOptions,
    paymentStatusOptions,
    selectedStatus,
    selectedPaymentStatus,
    onStatusChange,
    onPaymentStatusChange,
    updating,
    canCancel,
    onCancelOrder,
    customerEmail,
}: any) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Shipping status</p>
                    <div className="w-56">
                        <SelectDropdown
                            options={statusOptions}
                            value={selectedStatus ?? statusOptions[0]}
                            onChange={onStatusChange}
                            disabled={updating}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Payment status</p>
                    <div className="w-56">
                        <SelectDropdown
                            options={paymentStatusOptions}
                            value={
                                selectedPaymentStatus ?? paymentStatusOptions[0]
                            }
                            onChange={onPaymentStatusChange}
                            disabled={updating}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {canCancel && (
                    <button
                        onClick={onCancelOrder}
                        className="btn btn-gray text-red-600! text-sm"
                    >
                        Cancel Order
                    </button>
                )}
                <a
                    className="inline-flex items-center btn btn-primary text-sm gap-2"
                    href={`mailto:${customerEmail}`}
                >
                    <FaEnvelope /> Contact
                </a>
            </div>
        </div>
    );
}
