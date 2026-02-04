import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { Settings, Image, Trash2, Upload, Mail, Server, Lock, Eye, EyeOff, Send } from 'lucide-react';

interface Settings {
    app_name: string;
    app_icon: string | null;
}

interface MailSettings {
    MAIL_MAILER: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USERNAME: string;
    MAIL_PASSWORD: string;
    MAIL_ENCRYPTION: string;
    MAIL_FROM_ADDRESS: string;
    MAIL_FROM_NAME: string;
}

interface Props {
    settings: Settings;
    mailSettings: MailSettings;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'App Settings',
        href: '/admin/settings',
    },
];

export default function AppSettingsIndex({ settings, mailSettings }: Props) {
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [testingSending, setTestingSending] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name,
        app_icon: null as File | null,
    });

    const mailForm = useForm({
        MAIL_MAILER: mailSettings.MAIL_MAILER,
        MAIL_HOST: mailSettings.MAIL_HOST,
        MAIL_PORT: mailSettings.MAIL_PORT,
        MAIL_USERNAME: mailSettings.MAIL_USERNAME,
        MAIL_PASSWORD: mailSettings.MAIL_PASSWORD,
        MAIL_ENCRYPTION: mailSettings.MAIL_ENCRYPTION,
        MAIL_FROM_ADDRESS: mailSettings.MAIL_FROM_ADDRESS,
        MAIL_FROM_NAME: mailSettings.MAIL_FROM_NAME,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
        });
    };

    const handleMailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mailForm.post('/admin/settings/mail');
    };

    const handleTestEmail = () => {
        if (!testEmail) return;
        setTestingSending(true);
        router.post('/admin/settings/mail/test', { test_email: testEmail }, {
            onFinish: () => setTestingSending(false),
        });
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('app_icon', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveIcon = () => {
        router.delete('/admin/settings/icon');
        setIconPreview(null);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="App Settings" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
                    <p className="text-muted-foreground text-lg">
                        Configure your platform settings and branding.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* General Settings */}
                    <Card className="border-blue-100 dark:border-blue-900/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>General Settings</CardTitle>
                                    <CardDescription>Configure your app name and branding</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="app_name">App Name</Label>
                                    <Input
                                        id="app_name"
                                        value={data.app_name}
                                        onChange={e => setData('app_name', e.target.value)}
                                        placeholder="TutorConnect"
                                        className="border-gray-200 dark:border-gray-800 focus:ring-blue-500"
                                    />
                                    <InputError message={errors.app_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label>App Icon</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-none bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            {iconPreview || settings.app_icon ? (
                                                <img
                                                    src={iconPreview || `/storage/${settings.app_icon}`}
                                                    alt="App Icon"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Image className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleIconChange}
                                                    className="hidden"
                                                />
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 text-sm font-medium transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    Upload
                                                </span>
                                            </label>
                                            {(settings.app_icon || iconPreview) && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveIcon}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <InputError message={errors.app_icon} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Save Settings
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Mail Server Settings */}
                    <Card className="border-blue-100 dark:border-blue-900/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle>Mail Server</CardTitle>
                                    <CardDescription>Configure SMTP for sending emails</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleMailSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="MAIL_MAILER">Mailer</Label>
                                        <Input
                                            id="MAIL_MAILER"
                                            value={mailForm.data.MAIL_MAILER}
                                            onChange={e => mailForm.setData('MAIL_MAILER', e.target.value)}
                                            placeholder="smtp"
                                            className="border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="MAIL_ENCRYPTION">Encryption</Label>
                                        <Input
                                            id="MAIL_ENCRYPTION"
                                            value={mailForm.data.MAIL_ENCRYPTION}
                                            onChange={e => mailForm.setData('MAIL_ENCRYPTION', e.target.value)}
                                            placeholder="tls"
                                            className="border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="MAIL_HOST">SMTP Host</Label>
                                        <div className="relative">
                                            <Server className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <Input
                                                id="MAIL_HOST"
                                                value={mailForm.data.MAIL_HOST}
                                                onChange={e => mailForm.setData('MAIL_HOST', e.target.value)}
                                                placeholder="smtp.gmail.com"
                                                className="pl-10 border-gray-200 dark:border-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="MAIL_PORT">Port</Label>
                                        <Input
                                            id="MAIL_PORT"
                                            value={mailForm.data.MAIL_PORT}
                                            onChange={e => mailForm.setData('MAIL_PORT', e.target.value)}
                                            placeholder="587"
                                            className="border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_USERNAME">Username</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="MAIL_USERNAME"
                                            value={mailForm.data.MAIL_USERNAME}
                                            onChange={e => mailForm.setData('MAIL_USERNAME', e.target.value)}
                                            placeholder="your-email@gmail.com"
                                            className="pl-10 border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_PASSWORD">Password / App Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="MAIL_PASSWORD"
                                            type={showPassword ? 'text' : 'password'}
                                            value={mailForm.data.MAIL_PASSWORD}
                                            onChange={e => mailForm.setData('MAIL_PASSWORD', e.target.value)}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 border-gray-200 dark:border-gray-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        For Gmail, use an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Password</a>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="MAIL_FROM_ADDRESS">From Address</Label>
                                        <Input
                                            id="MAIL_FROM_ADDRESS"
                                            type="email"
                                            value={mailForm.data.MAIL_FROM_ADDRESS}
                                            onChange={e => mailForm.setData('MAIL_FROM_ADDRESS', e.target.value)}
                                            placeholder="noreply@example.com"
                                            className="border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="MAIL_FROM_NAME">From Name</Label>
                                        <Input
                                            id="MAIL_FROM_NAME"
                                            value={mailForm.data.MAIL_FROM_NAME}
                                            onChange={e => mailForm.setData('MAIL_FROM_NAME', e.target.value)}
                                            placeholder="TutorConnect"
                                            className="border-gray-200 dark:border-gray-800"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={mailForm.processing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {mailForm.processing && <Spinner className="mr-2" />}
                                    Save Mail Settings
                                </Button>
                            </form>

                            {/* Test Email Section */}
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <Send className="w-4 h-4 text-blue-600" />
                                    <Label className="text-sm font-medium">Test Email Configuration</Label>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Send a test email to verify your mail settings are working correctly.
                                </p>
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        value={testEmail}
                                        onChange={e => setTestEmail(e.target.value)}
                                        placeholder="Enter email to test"
                                        className="flex-1 border-gray-200 dark:border-gray-800"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleTestEmail}
                                        disabled={testingSending || !testEmail}
                                        variant="outline"
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                    >
                                        {testingSending ? (
                                            <Spinner className="mr-2" />
                                        ) : (
                                            <Send className="w-4 h-4 mr-2" />
                                        )}
                                        Send Test
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

