import { AccountDashboard } from '@/components/account/AccountDashboard';

export const metadata = {
    title: 'Account - WePro',
    description: 'View your VIP benefits and order history',
};

export default function AccountPageEn() {
    return <AccountDashboard lang="en" />;
}
