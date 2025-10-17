'use client';

import React from 'react';
import { CommissionRevenueItem } from '@/types/CommissionRevenueType';
import ConfirmationModal from '@/app/components/commons/ConfirmationModal';
import { formatAmount } from '@/utils/formatCurrency';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';
import Image from 'next/image';

interface ViewRevenuesModalProps {
    isOpen: boolean;
    onClose: () => void;
    revenue: CommissionRevenueItem;
}

export default function ViewRevenuesModal({
    isOpen,
    onClose,
    revenue,
}: ViewRevenuesModalProps) {
    const transaction = revenue.transaction;
    const { transaction_data, type, status, description, created_at } = transaction;
    const isWithdrawal = type === 'withdrawal';
    const isProduct = type === 'product';

    const user = isWithdrawal
        ? transaction_data?.vendor
        : transaction.customer;

    return (
        <ConfirmationModal isOpen={isOpen} onClose={onClose} title="Commission Revenue Details">
            <div className="space-y-6">

                {/* Summary */}
                <div className="bg-gray-100 rounded-xl p-4 text-gray-800 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Source:</span>
                        <span className="capitalize">{revenue.source}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Status:</span>
                        <span className="capitalize">{status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Commission Amount:</span>
                        <span className="text-amber-600 font-bold">{formatAmount(revenue.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Transaction Total:</span>
                        <span className="text-gray-800">{formatAmount(transaction.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Created At:</span>
                        <span>{formatHumanReadableDate(created_at)}</span>
                    </div>
                </div>

                {user && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-gray-500 space-y-2">
                        <p className="font-medium text-gray-600 mb-4 capitalize">{user.role} Info</p>

                        <div className="flex items-center gap-4 mb-4">
                            <Image
                                width={64}
                                height={64}
                                src={user.profile_photo}
                                alt="User Avatar"
                                className="w-16 h-16 rounded-full border object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-800">{user.name} {user.last_name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-500">{user.phone}</p>
                                <p className="text-xs text-gray-500">{user.city} {user.state} {user.country}</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Account Info */}
                {isWithdrawal && transaction.settlement_account && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-gray-500 space-y-2">
                        <p className="font-medium text-gray-600 mb-2">Settlement Account</p>
                        <div className="flex justify-between text-sm">
                            <span>Account Name:</span>
                            <span>{transaction.settlement_account.account_name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Account Number:</span>
                            <span>{transaction.settlement_account.account_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Transit Number:</span>
                            <span>{transaction.settlement_account.transit_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Institution Number:</span>
                            <span>{transaction.settlement_account.institution_number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Bank:</span>
                            <span>{transaction.settlement_account.name}</span>
                        </div>
                    </div>
                )}

                {/* Product Order Info */}
                {isProduct && transaction_data && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-gray-500">
                        <p className="font-medium text-gray-600 mb-2">Order Info</p>
                        <div className="flex justify-between text-sm">
                            <span>Order Total:</span>
                            <span>{formatAmount(transaction_data.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping Fee:</span>
                            <span>{formatAmount(transaction_data.shipping_fee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping Method:</span>
                            <span className="capitalize">{transaction_data.shipping_method}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping Status:</span>
                            <span className="capitalize">{transaction_data.shipping_status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Payment Status:</span>
                            <span className="capitalize">{transaction_data.payment_status}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Payment Date:</span>
                            <span>{formatHumanReadableDate(transaction_data.payment_date)}</span>
                        </div>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <div className="text-sm text-gray-500 italic">
                        {description}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </ConfirmationModal>
    );
}
