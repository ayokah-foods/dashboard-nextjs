'use client';

import { useEffect, useState } from 'react';
import {
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import { getFinanceOverview } from '@/app/api_/finance';
import { FinanceOverviewType } from '@/types/FinanceType';
import { formatAmount } from '@/utils/formatCurrency';

interface OverviewProps {
  selectedPeriod: string;
}

export function Overview({ selectedPeriod }: OverviewProps) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<FinanceOverviewType['data'] | null>(null);

  useEffect(() => {
    setLoading(true);
    getFinanceOverview({ start_date: selectedPeriod })
      .then((data) => setMetrics(data.data))
      .catch((err) => console.error('Failed to load finance overview', err))
      .finally(() => setLoading(false));
  }, [selectedPeriod]); 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-800">
      <MetricCard
        title="Total Orders"
        icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
        value={metrics?.sales_summary.total_orders}
        loading={loading}
        color="blue"
      />

      <MetricCard
        title="Completed"
        icon={<CheckCircleIcon className="w-6 h-6" />}
        value={metrics?.sales_summary.completed_orders}
        loading={loading}
        color="green"
      />

      <MetricCard
        title="Revenue"
        icon={<CurrencyDollarIcon className="w-6 h-6" />}
        value={formatAmount(metrics?.sales_summary.total_platform_revenue)}
        loading={loading}
        color="yellow"
      />

      <MetricCard
        title="Pending Payments"
        icon={<ClockIcon className="w-6 h-6" />}
        value={formatAmount(metrics?.sales_summary.customer_pending_payments)}
        loading={loading}
        color="red"
      />

      <MetricCard
        title="Unpaid Vendor Earnings"
        icon={<CurrencyDollarIcon className="w-6 h-6" />}
        value={formatAmount(metrics?.vendor_summary.unpaid_vendor_earnings)}
        loading={loading}
        color="orange"
      />

      <MetricCard
        title="Total Vendors"
        icon={<UsersIcon className="w-6 h-6" />}
        value={metrics?.vendor_summary.total_vendors}
        loading={loading}
        color="indigo"
      />

      <MetricCard
        title="Earnings Recorded"
        icon={<BanknotesIcon className="w-6 h-6" />}
        value={formatAmount(metrics?.wallet_summary.total_earnings_recorded)}
        loading={loading}
        color="orange"
      />

      <MetricCard
        title="Available to Withdraw"
        icon={<BanknotesIcon className="w-6 h-6" />}
        value={formatAmount(metrics?.wallet_summary.total_available_to_withdraw)}
        loading={loading}
        color="purple"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
}

export function MetricCard({ title, value, icon, loading, color }: MetricCardProps) {
  const bg = `bg-${color}-100`;
  const text = `text-${color}-600`;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center gap-4">
      <div className={`${bg} ${text} p-2 rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">
          {loading ? <Skeleton width={70} height={28} /> : value ?? 0}
        </p>
      </div>
    </div>
  );
}
