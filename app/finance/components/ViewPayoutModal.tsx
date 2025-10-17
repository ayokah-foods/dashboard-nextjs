'use client';

import React, { useState } from 'react';
import { PayoutItem } from '@/types/FinanceType';
import SelectDropdown from '@/app/components/commons/Fields/SelectDropdown';
import ConfirmationModal from '@/app/components/commons/ConfirmationModal';
import { formatAmount } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import { updatePayoutStatus } from '@/app/api_/finance';

interface ViewPayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    payout: PayoutItem;
    onStatusUpdated: () => void;
}

const options = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approve', value: 'approved' },
    { label: 'Decline', value: 'declined' },
];

export default function ViewPayoutModal({
    isOpen,
    onClose,
    payout,
    onStatusUpdated,
}: ViewPayoutModalProps) {
    const [decision, setDecision] = useState(options[0]);

    const account = payout.settlement_account;

    return (
        <ConfirmationModal isOpen={isOpen} onClose={onClose} title="Vendor Settlement Info">
            <div className="bg-gradient-to-tr from-gray-700 to-gray-900 text-white rounded-xl p-5 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Account Name</span>
                    <span className="font-medium">{account.account_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Account Number</span>
                    <span className="font-medium">{account.account_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Transit Number</span>
                    <span>{account.transit_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Institution Number</span>
                    <span>{account.institution_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Bank</span>
                    <span>{account.name}</span>
                </div>
            </div>

            <div className="mt-5 space-y-4">
                <div className="text-right text-sm text-gray-700">
                    <span className="font-semibold">Amount:</span>{' '}
                    <span className="text-amber-600 font-bold">
                        {formatAmount(payout.amount)}
                    </span>
                </div>

                <SelectDropdown
                    options={options}
                    value={decision}
                    onChange={(val) => setDecision(val)}
                />

                <div className="flex justify-end">
                    <button
                        className="rounded-md bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm text-white"
                        onClick={async () => {
                            const status = decision.value;
                            if (status === 'pending') {
                                toast.error('Please select Approve or Decline');
                                return;
                            }

                            try {
                                await updatePayoutStatus(payout.id, status);
                                toast.success(`Payout ${status} successfully`);
                                onClose();
                                onStatusUpdated();
                            } catch (err: unknown) {
                                console.error(err);
                                toast.error('Failed to update payout status');
                            }
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </ConfirmationModal>
    );
}
