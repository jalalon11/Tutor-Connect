import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin-sidebar-header';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';

export default function AdminLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AdminSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster position="top-right" />
        </AppShell>
    );
}

