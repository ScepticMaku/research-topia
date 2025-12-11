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
import { Bookmark, Layers, LibraryBig, BookOpen, Folder, LayoutGrid, TestTube, Star, FileText, Link2, BookmarkX, Tag } from 'lucide-react';
import AppLogo from './app-logo';
import { NavCategories } from './nav-categories';

const mainNavItems: NavItem[] = [
    {
        title: 'All Research Items',
        href: '/research-items',
        icon: Bookmark,
    },
    {
        title: 'Unsorted',
        href: '/unsorted',
        icon: LibraryBig
    }
];

const categoriesNavItems: NavItem[] = [
    {
        title: 'Category 1',
        href: '/category-link',
        icon: Layers
    }
];

const filterNavItems: NavItem[] = [
    {
        title: 'Favorites',
        href: '/favorites-link',
        icon: Star
    },
    {
        title: 'Documents',
        href: '/documents-link',
        icon: FileText
    },
    {
        title: 'Links',
        href: '/links-link',
        icon: Link2
    },
    {
        title: 'No Tags',
        href: '/no-tags-link',
        icon: BookmarkX
    },
];

const tagsNavItems: NavItem[] = [
    {
        title: 'Tag Name',
        href: '/tag-link',
        icon: Tag
    }
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
                <NavCategories items={categoriesNavItems} />
                <NavFilters items={filterNavItems} />
                <NavTags items={tagsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
