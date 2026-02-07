<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SystemStatusController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 10);
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $search = $request->input('search');
        
        // Get database size
        $databaseSize = $this->getDatabaseSize();
        
        // Get storage size
        $storageSize = $this->getStorageSize();
        
        // Get activity logs with pagination
        $activityLogsQuery = ActivityLog::with('user');
        
        // Search in action, description, or user
        if ($search) {
            $activityLogsQuery->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        $activityLogsQuery->orderBy($sortField, $sortDirection);
        
        $activityLogs = $activityLogsQuery->paginate($perPage)->through(function ($log) {
            return [
                'id' => $log->id,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
                'action' => $log->action,
                'description' => $log->description,
                'properties' => $log->properties,
                'ip_address' => $log->ip_address,
                'created_at' => $log->created_at->toISOString(),
            ];
        });
        
        // Get email queue statistics
        $emailStats = $this->getEmailQueueStats();
        
        // Get system info
        $systemInfo = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'os' => PHP_OS,
        ];
        
        return Inertia::render('admin/system-status/index', [
            'databaseSize' => $databaseSize,
            'storageSize' => $storageSize,
            'activityLogs' => $activityLogs,
            'emailStats' => $emailStats,
            'systemInfo' => $systemInfo,
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    private function getDatabaseSize(): array
    {
        try {
            $connection = config('database.default');
            $driver = config("database.connections.{$connection}.driver");
            
            if ($driver === 'mysql') {
                $database = config("database.connections.{$connection}.database");
                $result = DB::selectOne("
                    SELECT 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
                    FROM information_schema.TABLES 
                    WHERE table_schema = ?
                ", [$database]);
                
                $sizeMb = $result->size_mb ?? 0;
            } elseif ($driver === 'sqlite') {
                $dbPath = database_path('database.sqlite');
                $sizeMb = file_exists($dbPath) ? round(filesize($dbPath) / 1024 / 1024, 2) : 0;
            } else {
                $sizeMb = 0;
            }
            
            return [
                'size_mb' => $sizeMb,
                'size_formatted' => $this->formatBytes($sizeMb * 1024 * 1024),
            ];
        } catch (\Exception $e) {
            return [
                'size_mb' => 0,
                'size_formatted' => '0 B',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function getStorageSize(): array
    {
        try {
            $publicPath = public_path('storage');
            $size = $this->getDirectorySize($publicPath);
            
            return [
                'size_bytes' => $size,
                'size_formatted' => $this->formatBytes($size),
            ];
        } catch (\Exception $e) {
            return [
                'size_bytes' => 0,
                'size_formatted' => '0 B',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function getDirectorySize(string $path): int
    {
        if (!is_dir($path)) {
            return 0;
        }
        
        $size = 0;
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS)
        );
        
        foreach ($files as $file) {
            if ($file->isFile()) {
                $size += $file->getSize();
            }
        }
        
        return $size;
    }

    private function getEmailQueueStats(): array
    {
        try {
            // Check if jobs table exists
            $hasJobsTable = DB::getSchemaBuilder()->hasTable('jobs');
            
            if (!$hasJobsTable) {
                return [
                    'pending' => 0,
                    'failed' => 0,
                    'queue_running' => false,
                    'message' => 'Queue table not found',
                ];
            }
            
            $pending = DB::table('jobs')->count();
            $failed = DB::table('failed_jobs')->count();
            
            // Check if queue worker is running (simplified check)
            // This is a fallback - the system will work even without queue:work running
            $queueRunning = $pending > 0 && DB::table('jobs')
                ->where('reserved_at', '!=', null)
                ->exists();
            
            return [
                'pending' => $pending,
                'failed' => $failed,
                'queue_running' => $queueRunning,
                'message' => $queueRunning ? 'Queue worker is running' : 'Queue worker may not be running',
            ];
        } catch (\Exception $e) {
            return [
                'pending' => 0,
                'failed' => 0,
                'queue_running' => false,
                'message' => 'Unable to fetch queue stats',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }

    public function clearActivityLogs(Request $request)
    {
        $request->validate([
            'days' => 'nullable|integer|min:1|max:365',
        ]);
        
        $days = $request->input('days', 30);
        
        $deleted = ActivityLog::where('created_at', '<', now()->subDays($days))->delete();
        
        ActivityLog::log(
            'activity_logs_cleared',
            "Cleared activity logs older than {$days} days ({$deleted} records deleted)",
            ['days' => $days, 'deleted_count' => $deleted]
        );
        
        return back()->with('success', "Deleted {$deleted} activity log(s) older than {$days} days.");
    }
}
