import AppLayout from '@/layouts/app-layout';
import { Separator } from "@/components/ui/separator"
import { type BreadcrumbItem } from '@/types';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { EllipsisVertical, Album, SquarePen, Trash2, Eye, FileX, LibraryBig, Search, Star, ChevronDown, Plus, BookmarkX, Save } from 'lucide-react';
import ItemForm from '@/components/item-form';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Research Items',
        href: '/research-items',
    },
];

export default function Index({ researchItems, categories }: any) {

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        destroy(route('research-item.destroy', id));
    }

    function formatTimestamp(timestamp: string): string {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function extractDomain(url: string): string {
        return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
    }

    if (researchItems.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="All Research Items" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FileX />
                        </EmptyMedia>
                        <EmptyTitle>Research Items Empty</EmptyTitle>
                        <EmptyDescription>No research items found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Research Items" />
            <div className="flex flex-col h-full">
                {researchItems.map((item: any) =>
                    <div className="m-2">
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <Item variant="outline" className="hover:bg-secondary">
                                    <div className="w-full flex justify-between">
                                        <a className="w-full" href={item.url.url} target="_blank">
                                            <ItemHeader><strong>{item.url.title}</strong></ItemHeader>
                                            <ItemContent>
                                                <ItemTitle>{item.note}</ItemTitle>
                                                <ItemTitle>Tags Placeholder</ItemTitle>
                                            </ItemContent>
                                            <ItemFooter className="mt-4 w-full">
                                                <div className="flex h-2 items-center space-x-4 ">
                                                    <ItemDescription className="flex"><LibraryBig className="size-5 mr-2" />{item.category ? item.category.name : ''}</ItemDescription>
                                                    <Separator orientation="vertical" />
                                                    <ItemDescription>{extractDomain(item.url.url)}</ItemDescription>
                                                    <Separator orientation="vertical" />
                                                    <ItemDescription>{formatTimestamp(item.created_at)}</ItemDescription>
                                                </div>
                                            </ItemFooter>
                                        </a>
                                        <div className="flex gap-4">
                                            <Sheet>
                                                <SheetTrigger>
                                                    <Button variant="ghost" className="hover:bg-primary cursor-pointer"><Eye className="size-5" /></Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>This is where the document webview will show up</SheetTitle>
                                                    </SheetHeader>
                                                </SheetContent>
                                            </Sheet>
                                            <Sheet>
                                                <SheetTrigger>
                                                    <Button variant="ghost" className="hover:bg-primary cursor-pointer"><SquarePen className="size-5" /></Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <ItemForm item={item} categories={categories} />
                                                </SheetContent>
                                            </Sheet>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <Button variant="ghost" className="hover:bg-destructive cursor-pointer"><Trash2 className="size-5" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Do you want to delete {item.url.title}? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="cursor-pointer">
                                                            No
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction className="cursor-pointer" onClick={() => handleDelete(item.id)}>
                                                            Yes
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </Item>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem>Open in new tab</ContextMenuItem>
                                <ContextMenuItem>Copy link to clipboard</ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem>Add to favorites</ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem>Edit</ContextMenuItem>
                                <ContextMenuItem>Delete</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </div>
                )}
            </div>
            <small className="flex justify-center"># of Bookmarks</small>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </AppLayout >
    );
}
