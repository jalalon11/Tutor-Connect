import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import {
    Users,
    Clock,
    CheckCircle2,
    GraduationCap,
    ArrowRight,
    Mail,
    UserCheck,
    Settings,
} from 'lucide-react';

interface Stats {
    totalApplications: number;
    pendingApplications: number;
    approvedTeachers: number;
    rejectedApplications: number;
    totalStudents: number;
    totalPreRegistrations: number;
    verifiedPreRegistrations: number;
    pendingPreRegistrations: number;
}

interface RecentApplication {
    id: number;
    name: string;
    email: string;
    status: string;
    applied_at: string;
}

interface Props {
    stats: Stats;
    recentApplications: RecentApplication[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ stats, recentApplications }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-blue-500 text-white">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome back! Here's an overview of your platform.
                    </p>
                </div>

                {/* Pre-Registration Stats */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Pre-Registrations</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Pre-Registrations</CardTitle>
                                <Mail className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalPreRegistrations}</div>
                                <p className="text-xs text-muted-foreground mt-1">Users interested in joining</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.verifiedPreRegistrations}</div>
                                <p className="text-xs text-muted-foreground mt-1">Email confirmed</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                                <Clock className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.pendingPreRegistrations}</div>
                                <p className="text-xs text-muted-foreground mt-1">Awaiting email confirmation</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Teacher & Student Stats */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Users & Applications</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                                <Users className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalApplications}</div>
                                <p className="text-xs text-muted-foreground mt-1">Teacher applications</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                                <Clock className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.pendingApplications}</div>
                                <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Approved Tutors</CardTitle>
                                <UserCheck className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.approvedTeachers}</div>
                                <p className="text-xs text-muted-foreground mt-1">Active on platform</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.totalStudents}</div>
                                <p className="text-xs text-muted-foreground mt-1">Registered learners</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Applications */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Teacher Applications</CardTitle>
                            <CardDescription>Latest applications awaiting review</CardDescription>
                        </div>
                        <Link href="/admin/teacher-applications">
                            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
                                View All
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentApplications.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No applications yet</p>
                                <p className="text-sm">New teacher applications will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentApplications.map((app) => (
                                    <div
                                        key={app.id}
                                        className="flex items-center justify-between p-4 rounded-none bg-gray-50 dark:bg-gray-800/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {app.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{app.name}</p>
                                                <p className="text-sm text-muted-foreground">{app.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {getStatusBadge(app.status)}
                                            <span className="text-sm text-muted-foreground">
                                                {app.applied_at ? format(new Date(app.applied_at), 'MMM d, yyyy') : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/teacher-applications" className="block">
                        <Card className="h-full hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Review Applications</h3>
                                    <p className="text-sm text-muted-foreground">Manage teacher applications</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/settings" className="block">
                        <Card className="h-full hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">App Settings</h3>
                                    <p className="text-sm text-muted-foreground">Configure your platform</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/" className="block">
                        <Card className="h-full hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">View Website</h3>
                                    <p className="text-sm text-muted-foreground">See your public site</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
