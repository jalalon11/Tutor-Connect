import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Users,
    CheckCircle2,
    Clock,
    Send,
    Mail,
    Rocket,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
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
import { EnvelopeLoader } from '@/components/ui/envelope-loader';
import { Spinner } from '@/components/ui/spinner';
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

export default function PreRegistrationsIndex({ preRegistrations, stats }: Props) {
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

    // Only verified users (not pending) can be selected for emails
    const selectableUsers = preRegistrations.data.filter(reg => reg.email_verified_at !== null);

    const allSelectableSelected = selectableUsers.length > 0 &&
        selectableUsers.every(reg => selectedIds.includes(reg.id));

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // Only select verified users
            setSelectedIds(selectableUsers.map(reg => reg.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        }
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

    const handlePageChange = (page: number) => {
        router.get('/admin/pre-registrations', { page }, { preserveState: true });
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

    // Check if user can be selected (must be verified)
    const canSelect = (reg: PreRegistration) => reg.email_verified_at !== null;

    // Get IDs of only verified users who haven't completed setup (eligible for email)
    const eligibleForEmail = preRegistrations.data.filter(
        reg => reg.email_verified_at && !reg.setup_completed_at
    );
    const selectedEligible = selectedIds.filter(id =>
        eligibleForEmail.some(reg => reg.id === id)
    );

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Pre-Registrations" />

            {/* Send to Selected Dialog */}
            <Dialog open={showSelectedDialog} onOpenChange={setShowSelectedDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
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
                            <Mail className="w-4 h-4 mr-2" />
                            Send Emails
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send to All Verified Dialog */}
            <Dialog open={showAllDialog} onOpenChange={setShowAllDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Rocket className="w-5 h-5 text-blue-600" />
                            </div>
                            <DialogTitle>Send to All Verified Users</DialogTitle>
                        </div>
                        <DialogDescription className="text-left">
                            You are about to send <strong>Account Creation Emails</strong> to <strong>all {stats.pending_setup} verified users</strong> who haven't received an account setup email yet.
                            <br /><br />
                            <strong>Note:</strong> Users with "Pending" status (unverified email) will NOT receive emails.
                            <br /><br />
                            This email contains a link for users to set up their password and complete their registration.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAllDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendToAll} className="bg-blue-600 hover:bg-blue-700">
                            <Rocket className="w-4 h-4 mr-2" />
                            Send to All Verified
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sending Overlay Dialog */}
            <Dialog open={showSendingOverlay}>
                <DialogContent className="sm:max-w-md" hideCloseButton>
                    <div className="flex flex-col items-center justify-center py-8">
                        <EnvelopeLoader size="md" />
                        <div className="mt-12 text-center space-y-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Sending Account Creation Emails
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Sending emails to {sendingCount} user{sendingCount !== 1 ? 's' : ''}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Please wait, this may take a moment.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <DialogTitle>Delete Pre-Registration</DialogTitle>
                        </div>
                        <DialogDescription className="text-left">
                            {getDeletingUser() && (
                                <>
                                    Are you sure you want to delete the pre-registration for <strong>{getDeletingUser()?.first_name} {getDeletingUser()?.last_name}</strong> ({getDeletingUser()?.email})?
                                    <br /><br />
                                    This action cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} variant="destructive" disabled={deleting}>
                            {deleting ? (
                                <><Spinner className="mr-2 w-4 h-4" />Deleting...</>
                            ) : (
                                <><Trash2 className="w-4 h-4 mr-2" />Delete</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Pre-Registrations</h1>
                    <p className="text-muted-foreground text-lg">
                        Manage pre-registered users and send account creation emails.
                    </p>
                </div>

                {/* Stats Section */}
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

                {/* Actions Bar */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
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
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>Sends <strong>Account Creation Emails</strong> to verified users only. Users with "Pending" status cannot receive emails until they verify.</span>
                    </p>
                </div>

                {/* Data Table */}
                <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                    <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div>
                            <CardTitle>Pre-Registered Users</CardTitle>
                            <CardDescription>
                                Showing {preRegistrations.from || 0} to {preRegistrations.to || 0} of {preRegistrations.total} users (sorted A-Z, pending last)
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                                <TableRow>
                                    <TableHead className="w-12 pl-6">
                                        <Checkbox
                                            checked={allSelectableSelected && selectableUsers.length > 0}
                                            onCheckedChange={handleSelectAll}
                                            disabled={selectableUsers.length === 0}
                                        />
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead>Email Sent</TableHead>
                                    <TableHead className="w-20 text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {preRegistrations.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Users className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                                <p className="text-lg font-medium">No pre-registrations yet</p>
                                                <p className="text-sm">Pre-registered users will appear here.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    preRegistrations.data.map((reg) => (
                                        <TableRow
                                            key={reg.id}
                                            className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${!canSelect(reg) ? 'opacity-60' : ''}`}
                                        >
                                            <TableCell className="pl-6">
                                                <Checkbox
                                                    checked={selectedIds.includes(reg.id)}
                                                    onCheckedChange={(checked) => handleSelectOne(reg.id, checked as boolean)}
                                                    disabled={!canSelect(reg)}
                                                    title={!canSelect(reg) ? 'Cannot send email to unverified users' : undefined}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 flex items-center justify-center ${canSelect(reg) ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                                        <span className={`font-semibold text-sm ${canSelect(reg) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                                            {reg.first_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {reg.first_name} {reg.last_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 dark:text-gray-300">{reg.email}</span>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(reg)}
                                            </TableCell>
                                            <TableCell>
                                                {reg.role ? (
                                                    <Badge variant="outline" className="capitalize">{reg.role}</Badge>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {format(new Date(reg.created_at), 'MMM d, yyyy')}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {reg.setup_email_sent_at ? (
                                                    <span className="text-sm text-green-600 dark:text-green-400">
                                                        {format(new Date(reg.setup_email_sent_at), 'MMM d, yyyy')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {!reg.setup_completed_at && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(reg.id)}
                                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        title="Delete pre-registration"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {preRegistrations.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-sm text-gray-500">
                                    Page {preRegistrations.current_page} of {preRegistrations.last_page}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(preRegistrations.current_page - 1)}
                                        disabled={preRegistrations.current_page === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(preRegistrations.current_page + 1)}
                                        disabled={preRegistrations.current_page === preRegistrations.last_page}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
