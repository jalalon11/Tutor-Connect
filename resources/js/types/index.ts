export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type AppSettings = {
    name: string;
    icon: string | null;
};

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    appSettings: AppSettings;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
};
