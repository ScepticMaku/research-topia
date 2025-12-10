import { NavMain } from '@/components/nav-main';
import { NavFilters } from '@/components/nav-filters';
import { NavTags } from '@/components/nav-tags';

import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, } from '@/types';
import { Link } from '@inertiajs/react';
import { Bookmark, BookOpen, Folder, LayoutGrid, TestTube } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'All Research Items',
        href: '/research-items',
        icon: Bookmark,
    },
];

const filterNavItems: NavItem[] = [
];

const tagsNavItems: NavItem[] = [
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('research-items')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavFilters items={filterNavItems} />
                <NavTags items={tagsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
