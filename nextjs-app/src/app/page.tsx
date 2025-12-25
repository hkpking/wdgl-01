/**
 * 首页 - 门户入口
 * 
 * https://bpm-auto.com/ 显示统一门户
 */
import { PortalLayout } from '@/components/portal/PortalLayout';
import { PortalDashboard } from '@/components/portal/PortalDashboard';

export default function HomePage() {
  return (
    <PortalLayout>
      <PortalDashboard />
    </PortalLayout>
  );
}
