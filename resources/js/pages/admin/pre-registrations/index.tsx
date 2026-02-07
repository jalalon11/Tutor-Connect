import { Head, router } from '@inertiajs/react';
import { ColumnDef } from "@tanstack/react-table";
import { format } from 'date-fns';
import {
    Users,
    CheckCircle2,
    Clock,
    Send,
    Mail,
    Rocket,
    Trash2,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { DateRange } from "react-day-picker";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { EnvelopeLoader } from '@/components/ui/envelope-loader';
import { Spinner } from '@/components/ui/spinner';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface PreRegistration {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    setup_email_sent_at: string | null;
    setup_completed_at: string | null;
    role: string | null;
    created_at: string;
}

interface PaginatedData {
    data: PreRegistration[];
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

interface Stats {
    total: number;
    verified: number;
    pending_setup: number;
    emails_sent: number;
    completed: number;
}

interface Props {
    preRegistrations: PaginatedData;
    stats: Stats;
    filters: {
        search?: string;
        status_filter?: string;
        role_filter?: string;
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
        title: 'Pre-Registrations',
        href: '/admin/pre-registrations',
    },
];

export default function PreRegistrationsIndex({ preRegistrations, stats, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sendingSelected, setSendingSelected] = useState(false);
    const [sendingAll, setSendingAll] = useState(false);
    const [showSelectedDialog, setShowSelectedDialog] = useState(false);
    const [showAllDialog, setShowAllDialog] = useState(false);
    const [showSendingOverlay, setShowSendingOverlay] = useState(false);
    const [sendingCount, setSendingCount] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showStats, setShowStats] = useState(false);
    
    // Filters - now managed through URL params
    const [statusFilter, setStatusFilter] = useState<string>(filters.status_filter || "all");
    const [roleFilter, setRoleFilter] = useState<string>(filters.role_filter || "all");
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

    // Update URL when filters change
    const updateFilters = (newFilters: Record<string, any>) => {
        router.get('/admin/pre-registrations', {
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

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        updateFilters({ role_filter: value === 'all' ? undefined : value });
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

    const getStatusBadge = (reg: PreRegistration) => {
        if (reg.setup_completed_at) {
            return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">Completed</Badge>;
        }
        if (reg.setup_email_sent_at) {
            return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">Email Sent</Badge>;
        }
        if (reg.email_verified_at) {
            return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">Verified</Badge>;
        }
        return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">Pending</Badge>;
    };

    const getStatus = (reg: PreRegistration): string => {
        if (reg.setup_completed_at) return 'completed';
        if (reg.setup_email_sent_at) return 'email_sent';
        if (reg.email_verified_at) return 'verified';
        return 'pending';
    };

    const canSelect = (reg: PreRegistration) => reg.email_verified_at !== null;

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (!deletingId) return;

        setDeleting(true);
        router.delete(`/admin/pre-registrations/${deletingId}`, {
            onSuccess: () => {
                toast.success('Pre-registration deleted', {
                    description: 'The entry has been removed successfully.',
                });
                setSelectedIds(prev => prev.filter(id => id !== deletingId));
            },
            onError: () => {
                toast.error('Failed to delete', {
                    description: 'An error occurred while deleting. Please try again.',
                });
            },
            onFinish: () => {
                setDeleting(false);
                setShowDeleteDialog(false);
                setDeletingId(null);
            },
        });
    };

    const getDeletingUser = () => {
        if (!deletingId) return null;
        return preRegistrations.data.find(reg => reg.id === deletingId);
    };

    const handleSendToSelected = () => {
        setShowSelectedDialog(false);
        setSendingSelected(true);
        const count = selectedEligible.length;
        setSendingCount(count);
        setShowSendingOverlay(true);
        router.post('/admin/pre-registrations/send-emails', { ids: selectedIds }, {
            onSuccess: () => {
                toast.success('Emails sent successfully', {
                    description: `Account creation emails sent to ${count} user${count !== 1 ? 's' : ''}.`,
                });
            },
            onError: () => {
                toast.error('Failed to send emails', {
                    description: 'An error occurred while sending emails. Please try again.',
                });
            },
            onFinish: () => {
                setSendingSelected(false);
                setSelectedIds([]);
                setShowSendingOverlay(false);
            },
        });
    };

    const handleSendToAll = () => {
        setShowAllDialog(false);
        setSendingAll(true);
        const count = stats.pending_setup;
        setSendingCount(count);
        setShowSendingOverlay(true);
        router.post('/admin/pre-registrations/send-launch-emails', {}, {
            onSuccess: () => {
                toast.success('Emails sent successfully', {
                    description: `Account creation emails sent to ${count} verified user${count !== 1 ? 's' : ''}.`,
                });
            },
            onError: () => {
                toast.error('Failed to send emails', {
                    description: 'An error occurred while sending emails. Please try again.',
                });
            },
            onFinish: () => {
                setSendingAll(false);
                setShowSendingOverlay(false);
            },
        });
    };

    const eligibleForEmail = preRegistrations.data.filter(
        reg => reg.email_verified_at && !reg.setup_completed_at
    );
    const selectedEligible = selectedIds.filter(id =>
        eligibleForEmail.some(reg => reg.id === id)
    );

    const columns: ColumnDef<PreRegistration>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        if (value) {
                            setSelectedIds(preRegistrations.data.filter(canSelect).map(r => r.id));
                        } else {
                            setSelectedIds([]);
                        }
                    }}
                    aria-label="Select all"
                    disabled={preRegistrations.data.filter(canSelect).length === 0}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedIds.includes(row.original.id)}
                    onCheckedChange={(value) => {
                        if (value) {
                            setSelectedIds([...selectedIds, row.original.id]);
                        } else {
                            setSelectedIds(selectedIds.filter(id => id !== row.original.id));
                        }
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                    disabled={!canSelect(row.original)}
                    title={!canSelect(row.original) ? 'Cannot send email to unverified users' : undefined}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "first_name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const reg = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 flex items-center justify-center rounded-md ${canSelect(reg) ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                            <span className={`font-semibold text-sm ${canSelect(reg) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                {reg.first_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="font-medium">
                            {reg.first_name} {reg.last_name}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => getStatusBadge(row.original),
            filterFn: (row, id, value) => {
                return value.includes(getStatus(row.original));
            },
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
            cell: ({ row }) => {
                const role = row.getValue("role") as string | null;
                return role ? (
                    <Badge variant="outline" className="capitalize">{role}</Badge>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Registered" />
            ),
            cell: ({ row }) => {
                return <span className="text-sm">{format(new Date(row.getValue("created_at")), 'MMM d, yyyy')}</span>;
            },
        },
        {
            accessorKey: "setup_email_sent_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email Sent" />
            ),
            cell: ({ row }) => {
                const date = row.getValue("setup_email_sent_at") as string | null;
                return date ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                        {format(new Date(date), 'MMM d, yyyy')}
                    </span>
                ) : (
                    <span className="text-gray-400">—</span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const reg = row.original;
                
                return (
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
                                onClick={() => navigator.clipboard.writeText(reg.email)}
                            >
                                Copy email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!reg.setup_completed_at && (
                                <DropdownMenuItem
                                    onClick={() => handleDeleteClick(reg.id)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Pre-Registrations" />

            {/* Envelope Sending Overlay */}
            {showSendingOverlay && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <EnvelopeLoader size="md" />
                        <p className="text-white text-lg font-medium">
                            Sending emails to {sendingCount} user{sendingCount !== 1 ? 's' : ''}...
                        </p>
                    </div>
                </div>
            )}

            {/* Send to Selected Dialog */}
            <Dialog open={showSelectedDialog} onOpenChange={setShowSelectedDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-md">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <DialogTitle>Send Account Creation Emails</DialogTitle>
                        </div>
                        <DialogDescription className="text-left">
                            You are about to send <strong>Account Creation Emails</strong> to <strong>{selectedEligible.length}</strong> selected users.
                            <br /><br />
                            This email contains a link for users to set up their password and complete their registration.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSelectedDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendToSelected} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4 mr-2" />
                            Send Emails
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send to All Dialog */}
            <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-md">
                                <Rocket className="w-5 h-5 text-blue-600" />
                            </div>
                            <DialogTitle>Send to All Verified Users</DialogTitle>
                        </div>
                        <DialogDescription className="text-left">
                            You are about to send <strong>Account Creation Emails</strong> to <strong>{stats.pending_setup}</strong> verified users who haven't received the email yet.
                            <br /><br />
                            This is typically used during the <strong>launch phase</strong> to invite all verified pre-registrations to create their accounts.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAllDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendToAll} className="bg-blue-600 hover:bg-blue-700">
                            <Rocket className="w-4 h-4 mr-2" />
                            Send to All
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Pre-Registration</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the pre-registration for <strong>{getDeletingUser()?.email}</strong>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <><Spinner className="mr-2 w-4 h-4" />Deleting...</>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">Pre-Registrations</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage pre-registered users and send account creation emails.
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
                    <div className="grid gap-4 md:grid-cols-5">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total</CardTitle>
                                <Users className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.verified}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Awaiting Setup</CardTitle>
                                <Clock className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending_setup}</div>
                                <p className="text-xs text-muted-foreground">Verified, no email sent</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                                <Send className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.emails_sent}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completed}</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={() => setShowSelectedDialog(true)}
                            disabled={sendingSelected || selectedEligible.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {sendingSelected ? (
                                <><Spinner className="mr-2 w-4 h-4" />Sending...</>
                            ) : (
                                <><Mail className="w-4 h-4 mr-2" />Send to Selected ({selectedEligible.length})</>
                            )}
                        </Button>
                        <Button
                            onClick={() => setShowAllDialog(true)}
                            disabled={sendingAll || stats.pending_setup === 0}
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                        >
                            {sendingAll ? (
                                <><Spinner className="mr-2 w-4 h-4" />Sending...</>
                            ) : (
                                <><Rocket className="w-4 h-4 mr-2" />Send to All Verified ({stats.pending_setup})</>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Sends <strong>Account Creation Emails</strong> to verified users only. Users with "Pending" status cannot receive emails until they verify.</span>
                    </p>
                </div>

                {/* Data Table */}
                <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-4">
                            <div>
                                <CardTitle>Pre-Registered Users</CardTitle>
                                <CardDescription>
                                    View and manage pre-registered users with advanced filtering
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
                                        <SelectItem value="verified">Verified</SelectItem>
                                        <SelectItem value="email_sent">Email Sent</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectContent>
                                </Select>
                                <DataTableDateFilter
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    placeholder="Filter by date range"
                                />
                                {(statusFilter !== "all" || roleFilter !== "all" || dateRange || searchQuery) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setStatusFilter("all");
                                            setRoleFilter("all");
                                            setDateRange(undefined);
                                            setSearchQuery("");
                                            updateFilters({
                                                status_filter: undefined,
                                                role_filter: undefined,
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
                            data={preRegistrations.data}
                            pagination={preRegistrations}
                            emptyState={
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Users className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                    <p className="text-lg font-medium">No pre-registrations found</p>
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
