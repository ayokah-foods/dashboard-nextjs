'use client';

import React from 'react';
import { Transaction } from '@/types/TransactionType';
import ConfirmationModal from '@/app/components/commons/ConfirmationModal';
import { formatAmount } from '@/utils/formatCurrency';
import { formatHumanReadableDate } from '@/utils/formatHumanReadableDate';

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function ViewTransactionModal({
  isOpen,
  onClose,
  transaction,
}: ViewTransactionModalProps) {
  const { transaction_data, type, customer, settlement_account } = transaction;

  const isWithdrawal = type === 'withdrawal';
  const isProduct = type === 'product';

  const vendorOrCustomer = isWithdrawal
    ? transaction_data.vendor
    : customer;

  return (
    <ConfirmationModal isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="space-y-6">

        {/* Header Section */}
        <div className="bg-gray-100 rounded-xl p-4 text-gray-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Transaction Type:</span>
            <span className="capitalize">{type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Status:</span>
            <span className="capitalize">{transaction.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Amount:</span>
            <span className="text-amber-600 font-bold">{formatAmount(transaction.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Created At:</span>
            <span>{formatHumanReadableDate(transaction.created_at)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-gray-500 space-y-2">
          <p className="font-medium text-gray-600 mb-2">User Info</p>
          <div className="flex justify-between text-sm">
            <span>Name:</span>
            <span>{vendorOrCustomer?.name} {vendorOrCustomer?.last_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Email:</span>
            <span>{vendorOrCustomer?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phone:</span>
            <span>{vendorOrCustomer?.phone}</span>
          </div>
        </div>

        {/* Type-specific content */}
        {isWithdrawal && settlement_account && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-gray-500 space-y-2">
            <p className="font-medium text-gray-600 mb-2">Settlement Account</p>
            <div className="flex justify-between text-sm">
              <span>Account Name:</span>
              <span>{settlement_account.account_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Account Number:</span>
              <span>{settlement_account.account_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transit Number:</span>
              <span>{settlement_account.transit_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Institution Number:</span>
              <span>{settlement_account.institution_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bank:</span>
              <span>{settlement_account.name}</span>
            </div>
          </div>
        )}

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
        <div className="text-sm text-gray-500 italic">
          {transaction.description}
        </div>

        {/* Footer Buttons */}
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
