import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from 'date-fns';
import { Mail, Phone, Users, CheckCircle2, Clock, ShieldInfo } from 'lucide-react';

interface PreRegistration {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    subjects: string[] | null;
    experience_years: number | null;
    provider: string;
    status: string;
    created_at: string;
}

interface Props {
    preRegistrations: PreRegistration[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Teacher Pre-registrations',
        href: '/admin/teacher-pre-registrations',
    },
];

export default function Index({ preRegistrations }: Props) {
    const totalRegistrations = preRegistrations.length;
    const emailRegistrations = preRegistrations.filter(r => r.provider === 'email').length;
    const socialRegistrations = preRegistrations.filter(r => r.provider !== 'email').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Pre-registrations" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Teacher Pre-registrations</h1>
                    <p className="text-muted-foreground text-lg">
                        Overview of teachers waiting for platform access.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
                            <Users className="w-4 h-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRegistrations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Teachers pre-registered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Email Signups</CardTitle>
                            <Mail className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{emailRegistrations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Direct website registration</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Social Auth</CardTitle>
                            <ShieldInfo className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{socialRegistrations}</div>
                            <p className="text-xs text-muted-foreground mt-1">Google & Facebook</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Waitlist Entries</CardTitle>
                            <CardDescription>Recent registrations from potential teachers.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow>
                                    <TableHead className="py-4 pl-6">Teacher Name</TableHead>
                                    <TableHead>Contact Information</TableHead>
                                    <TableHead>Experience & Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Date Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preRegistrations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Clock className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                                <p className="text-lg font-medium">No registrations yet</p>
                                                <p className="text-sm">New teachers will appear here once they sign up.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    preRegistrations.map((reg) => (
                                        <TableRow key={reg.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <TableCell className="py-4 pl-6">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100 italic">
                                                    {reg.first_name} {reg.last_name}
                                                </div>
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
                                                    Source: {reg.provider}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {reg.email}
                                                    </div>
                                                    {reg.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Phone className="w-3.5 h-3.5" />
                                                            {reg.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-sm font-medium">
                                                        {reg.experience_years !== null ? (
                                                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-100 dark:border-blue-800">
                                                                {reg.experience_years} years exp.
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground italic text-xs">No experience specified</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {reg.subjects && reg.subjects.length > 0 ? (
                                                            reg.subjects.map((s) => (
                                                                <Badge key={s} variant="outline" className="text-[10px] bg-white dark:bg-gray-950 font-normal">
                                                                    {s}
                                                                </Badge>
                                                            ))
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={reg.status === 'draft' ? "secondary" : "default"}
                                                    className={`capitalize font-medium ${reg.status === 'draft' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'}`}
                                                >
                                                    {reg.status === 'draft' ? 'Interested' : reg.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="text-sm font-medium">{format(new Date(reg.created_at), 'MMM d, yyyy')}</div>
                                                <div className="text-[10px] text-muted-foreground">{format(new Date(reg.created_at), 'h:mm a')}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
