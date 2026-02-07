import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  HardDrive,
  Mail,
  Activity,
  Server,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ActivityLog {
  id: number;
  user: User | null;
  action: string;
  description: string;
  properties: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

interface PaginatedData {
  data: ActivityLog[];
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

interface DatabaseSize {
  size_mb: number;
  size_formatted: string;
  error?: string;
}

interface StorageSize {
  size_bytes: number;
  size_formatted: string;
  error?: string;
}

interface EmailStats {
  pending: number;
  failed: number;
  queue_running: boolean;
  message: string;
  error?: string;
}

interface SystemInfo {
  php_version: string;
  laravel_version: string;
  server: string;
  os: string;
}

interface SystemStatusProps {
  databaseSize: DatabaseSize;
  storageSize: StorageSize;
  activityLogs: PaginatedData;
  emailStats: EmailStats;
  systemInfo: SystemInfo;
  filters: {
    search?: string;
    sort_field: string;
    sort_direction: string;
    per_page: number;
  };
}

export default function SystemStatus({
  databaseSize,
  storageSize,
  activityLogs,
  emailStats,
  systemInfo,
  filters,
}: SystemStatusProps) {
  const [showStatsCards, setShowStatsCards] = useState(false);
  const [clearLogsDialog, setClearLogsDialog] = useState(false);
  const [daysToKeep, setDaysToKeep] = useState('30');
  const [isClearing, setIsClearing] = useState(false);

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: 'created_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date & Time" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return (
          <div className="whitespace-nowrap">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      accessorKey: 'user',
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const user = row.getValue('user') as User | null;
        return user ? (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">System</span>
        );
      },
      filterFn: (row, id, value) => {
        const user = row.getValue(id) as User | null;
        if (!user) return 'system'.includes(value.toLowerCase());
        return (
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      accessorKey: 'action',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => {
        const action = row.getValue('action') as string;
        const variant = action.includes('delete') || action.includes('clear')
          ? 'destructive'
          : action.includes('create') || action.includes('send')
          ? 'default'
          : 'secondary';
        
        return <Badge variant={variant}>{action.replace(/_/g, ' ').toUpperCase()}</Badge>;
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        return <div className="max-w-md">{description}</div>;
      },
    },
    {
      accessorKey: 'ip_address',
      header: ({ column }) => <DataTableColumnHeader column={column} title="IP Address" />,
      cell: ({ row }) => {
        const ip = row.getValue('ip_address') as string | null;
        return <span className="font-mono text-xs">{ip || 'N/A'}</span>;
      },
    },
  ];

  const handleClearLogs = () => {
    setIsClearing(true);
    router.post(
      '/admin/system-status/clear-logs',
      { days: parseInt(daysToKeep) },
      {
        onSuccess: () => {
          setClearLogsDialog(false);
          setIsClearing(false);
        },
        onError: () => {
          setIsClearing(false);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <Head title="System Status" />

      <div className="flex h-full flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">System Status</h1>
            <p className="text-muted-foreground text-sm">
              Monitor your system resources and activity logs
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStatsCards(!showStatsCards)}
                  className="gap-2"
                >
                  {showStatsCards ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Stats
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showStatsCards ? 'Hide' : 'Show'} Stat Cards</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats Cards */}
        {showStatsCards && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Database Size */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Size</CardTitle>
                <Database className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseSize.size_formatted}</div>
                {databaseSize.error ? (
                  <p className="text-xs text-red-500 mt-1">{databaseSize.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Current database size</p>
                )}
              </CardContent>
            </Card>

            {/* Storage Size */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storageSize.size_formatted}</div>
                {storageSize.error ? (
                  <p className="text-xs text-red-500 mt-1">{storageSize.error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Files in public storage</p>
                )}
              </CardContent>
            </Card>

            {/* Email Queue */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Queue</CardTitle>
                <Mail className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emailStats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {emailStats.failed} failed · {emailStats.pending > 0 ? 'Pending delivery' : 'No emails queued'}
                </p>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Info</CardTitle>
                <Server className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PHP {systemInfo.php_version.split('.')[0]}.{systemInfo.php_version.split('.')[1]}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Laravel {systemInfo.laravel_version}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Activity Logs */}
        <Card className="border-none shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Logs
                </CardTitle>
                <CardDescription>Recent admin activities and system events</CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setClearLogsDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Old Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <DataTable columns={columns} data={activityLogs.data} pagination={activityLogs} />
          </CardContent>
        </Card>
      </div>

      {/* Clear Logs Dialog */}
      <Dialog open={clearLogsDialog} onOpenChange={setClearLogsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Activity Logs</DialogTitle>
            <DialogDescription>
              Delete activity logs older than a specified number of days. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="days">Keep logs from the last (days)</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                value={daysToKeep}
                onChange={(e) => setDaysToKeep(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Logs older than {daysToKeep} days will be deleted
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearLogsDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearLogs} disabled={isClearing}>
              {isClearing ? 'Clearing...' : 'Clear Logs'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
