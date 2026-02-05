import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Mail, Phone, Users, CheckCircle2, XCircle, Clock, UserCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface Application {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subjects: string[] | null;
    experience_years: number | null;
    bio: string | null;
    status: string;
    applied_at: string;
    created_at: string;
}

interface Props {
    applications: Application[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Teacher Applications',
        href: '/admin/teacher-applications',
    },
];

export default function TeacherApplicationsIndex({ applications }: Props) {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const approvedApplications = applications.filter(a => a.status === 'approved').length;

    const handleApprove = (id: number) => {
        router.post(`/admin/teacher-applications/${id}/approve`);
    };

    const handleReject = (id: number) => {
        router.post(`/admin/teacher-applications/${id}/reject`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-blue-500 text-white border-blue-500">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Applications" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Applications</h1>
                    <p className="text-muted-foreground text-lg">
                        Review and manage tutor applications.
                    </p>
                </div>

                {/* Stats Section - All Blue */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <Users className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalApplications}</div>
                            <p className="text-xs text-muted-foreground mt-1">All time applications</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingApplications}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting decision</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <UserCheck className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{approvedApplications}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active tutors</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Applications List</CardTitle>
                            <CardDescription>Review and approve tutor applications.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow>
                                    <TableHead className="py-4 pl-6">Applicant</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Experience & Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Clock className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                                <p className="text-lg font-medium">No applications yet</p>
                                                <p className="text-sm">New tutor applications will appear here.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    applications.map((app) => (
                                        <TableRow key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <TableCell className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                            {app.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {app.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {app.email}
                                                    </div>
                                                    {app.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            {app.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-medium">
                                                        {app.experience_years !== null ? (
                                                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-none border border-blue-100 dark:border-blue-800">
                                                                {app.experience_years} years exp.
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground italic text-xs">No experience specified</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.subjects && app.subjects.length > 0 ? (
                                                            app.subjects.slice(0, 3).map((s) => (
                                                                <Badge key={s} variant="outline" className="text-[10px] bg-white dark:bg-gray-950 font-normal">
                                                                    {s}
                                                                </Badge>
                                                            ))
                                                        ) : null}
                                                        {app.subjects && app.subjects.length > 3 && (
                                                            <Badge variant="outline" className="text-[10px]">+{app.subjects.length - 3}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(app.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm font-medium">
                                                    {app.applied_at ? format(new Date(app.applied_at), 'MMM d, yyyy') : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {app.status === 'pending' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            onClick={() => handleApprove(app.id)}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                                            onClick={() => handleReject(app.id)}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
