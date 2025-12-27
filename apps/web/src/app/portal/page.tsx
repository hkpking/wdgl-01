/**
 * 门户首页
 * 应用入口，显示应用中心
 */
import { PortalLayout } from '@/components/portal/PortalLayout';
import { PortalDashboard } from '@/components/portal/PortalDashboard';

export default function PortalPage() {
    return (
        <PortalLayout>
            <PortalDashboard />
        </PortalLayout>
    );
}
