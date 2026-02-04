import { usePage } from '@inertiajs/react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import AdminLayout from '@/layouts/admin-layout';
import type { AppLayoutProps, SharedData } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage<SharedData>().props;

    // Use AdminLayout for admin users
    if (auth?.user?.is_admin) {
        return (
            <AdminLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AdminLayout>
        );
    }

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
