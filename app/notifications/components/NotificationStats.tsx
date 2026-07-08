import { MetricCard } from '@/app/finance/components/Overview';
import { NotificationResponse } from '@/types/NotificationsType';
import { BellIcon, PaperAirplaneIcon, InboxIcon, CheckCircleIcon, XCircleIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';

type Props = {
    stats: NotificationResponse['stats'] | null;
    loading: boolean;
};

export default function NotificationStats({ stats, loading }: Props) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
                title="Total Notifications"
                icon={<BellIcon className="w-6 h-6" />}
                value={stats.total}
                loading={loading}
                color="amber"
            />

            <MetricCard
                title="Email Sent"
                icon={<PaperAirplaneIcon className="w-6 h-6" />}
                value={stats.email}
                loading={loading}
                color="blue"
            />

            <MetricCard
                title="SMS Sent"
                icon={<InboxIcon className="w-6 h-6" />}
                value={stats.sms}
                loading={loading}
                color="cyan"
            /> 

            <MetricCard
                title="Pending"
                icon={<CheckCircleIcon className="w-6 h-6" />}
                value={stats.pending}
                loading={loading}
                color="yellow"
            /> 
 
        </div>
    );
}
