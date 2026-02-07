import { Head, router } from '@inertiajs/react';
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import { Mail, Phone, Users, CheckCircle2, XCircle, Clock, UserCheck, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableDateFilter } from '@/components/ui/data-table-date-filter';
import { Input } from '@/components/ui/input';
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

interface PaginatedData {
    data: Application[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    applications: PaginatedData;
    filters: {
        search?: string;
        status_filter?: string;
        experience_filter?: string;
        date_from?: string;
        date_to?: string;
        sort_field: string;
        sort_direction: string;
        per_page: number;
    };
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

export default function TeacherApplicationsIndex({ applications, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState<string>(filters.status_filter || "all");
    const [experienceFilter, setExperienceFilter] = useState<string>(filters.experience_filter || "all");
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || "");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (filters.date_from || filters.date_to) {
            return {
                from: filters.date_from ? new Date(filters.date_from) : undefined,
                to: filters.date_to ? new Date(filters.date_to) : undefined,
            };
        }
        return undefined;
    });
    const [showStats, setShowStats] = useState(false);

    const totalApplications = applications.total;
    const pendingApplications = applications.data.filter(a => a.status === 'pending').length;
    const approvedApplications = applications.data.filter(a => a.status === 'approved').length;

    // Update URL when filters change
    const updateFilters = (newFilters: Record<string, any>) => {
        router.get('/admin/teacher-applications', {
            ...filters,
            ...newFilters,
            page: 1, // Reset to first page on filter change
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        updateFilters({ status_filter: value === 'all' ? undefined : value });
    };

    const handleExperienceFilterChange = (value: string) => {
        setExperienceFilter(value);
        updateFilters({ experience_filter: value === 'all' ? undefined : value });
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        updateFilters({
            date_from: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
            date_to: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
        });
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        updateFilters({ search: value || undefined });
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/teacher-applications/${id}/approve`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReject = (id: number) => {
        router.post(`/admin/teacher-applications/${id}/reject`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">Pending</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const columns: ColumnDef<Application>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Applicant" />
            ),
            cell: ({ row }) => {
                const app = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {app.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="font-medium">
                            {app.name}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Contact" />
            ),
            cell: ({ row }) => {
                const app = row.original;
                return (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            {app.email}
                        </div>
                        {app.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                {app.phone}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "experience_years",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Experience" />
            ),
            cell: ({ row }) => {
                const years = row.getValue("experience_years") as number | null;
                return years !== null ? (
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-sm font-medium">
                        {years} year{years !== 1 ? 's' : ''}
                    </span>
                ) : (
                    <span className="text-muted-foreground text-sm italic">Not specified</span>
                );
            },
        },
        {
            accessorKey: "subjects",
            header: "Subjects",
            cell: ({ row }) => {
                const subjects = row.getValue("subjects") as string[] | null;
                return (
                    <div className="flex flex-wrap gap-1">
                        {subjects && subjects.length > 0 ? (
                            <>
                                {subjects.slice(0, 2).map((s) => (
                                    <Badge key={s} variant="outline" className="text-xs">
                                        {s}
                                    </Badge>
                                ))}
                                {subjects.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{subjects.length - 2}
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => getStatusBadge(row.getValue("status")),
        },
        {
            accessorKey: "applied_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Applied" />
            ),
            cell: ({ row }) => {
                const date = row.getValue("applied_at") as string;
                return date ? (
                    <span className="text-sm">{format(new Date(date), 'MMM d, yyyy')}</span>
                ) : (
                    <span className="text-muted-foreground">N/A</span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const app = row.original;
                
                return (
                    <div className="flex items-center justify-end gap-2">
                        {app.status === 'pending' ? (
                            <>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApprove(app.id)}
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-gray-600"
                                    onClick={() => handleReject(app.id)}
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                </Button>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => navigator.clipboard.writeText(app.email)}
                                    >
                                        Copy email
                                    </DropdownMenuItem>
                                    {app.phone && (
                                        <DropdownMenuItem
                                            onClick={() => navigator.clipboard.writeText(app.phone!)}
                                        >
                                            Copy phone
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Applications" />

            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Teacher Applications</h1>
                        <p className="text-muted-foreground text-sm">
                            Review and manage tutor applications.
                        </p>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowStats(!showStats)}
                                    className="gap-2"
                                >
                                    {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    Stats
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{showStats ? 'Hide' : 'Show'} Stat Cards</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Stats Section */}
                {showStats && (
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
                )}

                {/* Data Table */}
                <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-4">
                            <div>
                                <CardTitle>Applications List</CardTitle>
                                <CardDescription>
                                    Review and approve tutor applications with advanced filtering
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="max-w-xs"
                                />
                                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={experienceFilter} onValueChange={handleExperienceFilterChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Experience</SelectItem>
                                        <SelectItem value="0-2">0-2 years</SelectItem>
                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                        <SelectItem value="6+">6+ years</SelectItem>
                                    </SelectContent>
                                </Select>
                                <DataTableDateFilter
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    placeholder="Filter by application date"
                                />
                                {(statusFilter !== "all" || experienceFilter !== "all" || dateRange || searchQuery) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setStatusFilter("all");
                                            setExperienceFilter("all");
                                            setDateRange(undefined);
                                            setSearchQuery("");
                                            updateFilters({
                                                status_filter: undefined,
                                                experience_filter: undefined,
                                                date_from: undefined,
                                                date_to: undefined,
                                                search: undefined,
                                            });
                                        }}
                                        className="h-8 px-2 lg:px-3"
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <DataTable
                            columns={columns}
                            data={applications.data}
                            pagination={applications}
                            emptyState={
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Clock className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                    <p className="text-lg font-medium">No applications found</p>
                                    <p className="text-sm">Try adjusting your filters</p>
                                </div>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
