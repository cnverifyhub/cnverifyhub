import { AccountDashboard } from '@/components/account/AccountDashboard';

export const metadata = {
    title: '个人中心 - WePro',
    description: '查看您的VIP特权与历史订单',
};

export default function AccountPage() {
    return <AccountDashboard lang="zh" />;
}
