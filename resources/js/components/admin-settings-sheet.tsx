import { useForm, router, usePage } from '@inertiajs/react';
import { Settings, Image, Trash2, Upload, Mail, Server, Lock, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

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

interface SharedData {
    appSettings?: {
        name?: string;
        icon?: string;
    };
    mailSettings?: MailSettings;
    [key: string]: unknown;
}

export function AdminSettingsSheet() {
    const { appSettings, mailSettings } = usePage<SharedData>().props;
    const { appearance, updateAppearance } = useAppearance();
    const [open, setOpen] = useState(false);
    const [iconPreview, setIconPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'mail'>('general');

    const appName = appSettings?.name || 'TutorConnect';
    const appIcon = appSettings?.icon;

    const { data, setData, post, processing, errors } = useForm({
        app_name: appName,
        app_icon: null as File | null,
    });

    const mailForm = useForm({
        MAIL_MAILER: mailSettings?.MAIL_MAILER || 'smtp',
        MAIL_HOST: mailSettings?.MAIL_HOST || '',
        MAIL_PORT: mailSettings?.MAIL_PORT || '587',
        MAIL_USERNAME: mailSettings?.MAIL_USERNAME || '',
        MAIL_PASSWORD: mailSettings?.MAIL_PASSWORD || '',
        MAIL_ENCRYPTION: mailSettings?.MAIL_ENCRYPTION || 'tls',
        MAIL_FROM_ADDRESS: mailSettings?.MAIL_FROM_ADDRESS || '',
        MAIL_FROM_NAME: mailSettings?.MAIL_FROM_NAME || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            onSuccess: () => setOpen(false),
        });
    };

    const handleMailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mailForm.post('/admin/settings/mail');
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

    const appearanceOptions: { value: Appearance; label: string; icon: React.ReactNode }[] = [
        { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
        { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
        { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="sr-only">Settings</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <SheetHeader className="text-left">
                        <SheetTitle className="flex items-center gap-3 text-lg">
                            <div className="w-9 h-9 rounded-none bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-blue-600" />
                            </div>
                            App Settings
                        </SheetTitle>
                        <SheetDescription className="text-sm">
                            Configure your platform settings and mail server.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-none">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-none transition-colors ${activeTab === 'general'
                                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('mail')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-none transition-colors ${activeTab === 'mail'
                                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Mail Server
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* General Settings Tab */}
                    {activeTab === 'general' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="app_name" className="text-sm font-medium">App Name</Label>
                                <Input
                                    id="app_name"
                                    value={data.app_name}
                                    onChange={e => setData('app_name', e.target.value)}
                                    placeholder="TutorConnect"
                                />
                                <InputError message={errors.app_name} />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">App Icon</Label>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-none bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 flex-shrink-0">
                                        {iconPreview || appIcon ? (
                                            <img
                                                src={iconPreview || `/storage/${appIcon}`}
                                                alt="App Icon"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="cursor-pointer inline-block">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleIconChange}
                                                className="hidden"
                                            />
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium transition-colors">
                                                <Upload className="w-4 h-4" />
                                                Upload
                                            </span>
                                        </label>
                                        {(appIcon || iconPreview) && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveIcon}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, SVG up to 2MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Appearance Settings */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Appearance</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {appearanceOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateAppearance(option.value)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-none border-2 transition-all ${appearance === option.value
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {option.icon}
                                            <span className="text-xs font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {processing && <Spinner className="mr-2" />}
                                Save Settings
                            </Button>
                        </form>
                    )}

                    {/* Mail Settings Tab */}
                    {activeTab === 'mail' && (
                        <form onSubmit={handleMailSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_MAILER" className="text-sm font-medium">Mailer</Label>
                                    <Input
                                        id="MAIL_MAILER"
                                        value={mailForm.data.MAIL_MAILER}
                                        onChange={e => mailForm.setData('MAIL_MAILER', e.target.value)}
                                        placeholder="smtp"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_ENCRYPTION" className="text-sm font-medium">Encryption</Label>
                                    <Input
                                        id="MAIL_ENCRYPTION"
                                        value={mailForm.data.MAIL_ENCRYPTION}
                                        onChange={e => mailForm.setData('MAIL_ENCRYPTION', e.target.value)}
                                        placeholder="tls"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-3 space-y-2">
                                    <Label htmlFor="MAIL_HOST" className="text-sm font-medium">SMTP Host</Label>
                                    <div className="relative">
                                        <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="MAIL_HOST"
                                            value={mailForm.data.MAIL_HOST}
                                            onChange={e => mailForm.setData('MAIL_HOST', e.target.value)}
                                            placeholder="smtp.gmail.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_PORT" className="text-sm font-medium">Port</Label>
                                    <Input
                                        id="MAIL_PORT"
                                        value={mailForm.data.MAIL_PORT}
                                        onChange={e => mailForm.setData('MAIL_PORT', e.target.value)}
                                        placeholder="587"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="MAIL_USERNAME" className="text-sm font-medium">Username</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="MAIL_USERNAME"
                                        value={mailForm.data.MAIL_USERNAME}
                                        onChange={e => mailForm.setData('MAIL_USERNAME', e.target.value)}
                                        placeholder="your-email@gmail.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="MAIL_PASSWORD" className="text-sm font-medium">Password / App Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="MAIL_PASSWORD"
                                        type={showPassword ? 'text' : 'password'}
                                        value={mailForm.data.MAIL_PASSWORD}
                                        onChange={e => mailForm.setData('MAIL_PASSWORD', e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                    <Label htmlFor="MAIL_FROM_ADDRESS" className="text-sm font-medium">From Address</Label>
                                    <Input
                                        id="MAIL_FROM_ADDRESS"
                                        type="email"
                                        value={mailForm.data.MAIL_FROM_ADDRESS}
                                        onChange={e => mailForm.setData('MAIL_FROM_ADDRESS', e.target.value)}
                                        placeholder="noreply@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="MAIL_FROM_NAME" className="text-sm font-medium">From Name</Label>
                                    <Input
                                        id="MAIL_FROM_NAME"
                                        value={mailForm.data.MAIL_FROM_NAME}
                                        onChange={e => mailForm.setData('MAIL_FROM_NAME', e.target.value)}
                                        placeholder="TutorConnect"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={mailForm.processing}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {mailForm.processing && <Spinner className="mr-2" />}
                                Save Mail Settings
                            </Button>
                        </form>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
