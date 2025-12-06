import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Bookmarks',
        href: '/bookmarks',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <h1>DUDE I FORGOT GREP EXISTS SD;ALFKJASD;KLFJS</h1>
        </AppLayout>
    );
}
