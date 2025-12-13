import AppLayout from '@/layouts/app-layout';
import { Separator } from "@/components/ui/separator"
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import {
    Empty,
    EmptyContent,
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
import { Album, SquarePen, Trash2, Eye, FileX, LibraryBig, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Research Items',
        href: '/research-items',
    },
];

export default function Index() {

    type researchItems = {
        title: string;
        note: string;
        tags: {
            name: string
        };
        research_info: {
            category_name: string;
            website: string;
            date_created: string;
        };
    };

    const researchItem: researchItems[] = [
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'test',
            note: '',
            tags: {
                name: 'test',
            },
            research_info: {
                category_name: 'Unsorted',
                website: 'test',
                date_created: 'test'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'test',
            note: '',
            tags: {
                name: 'test',
            },
            research_info: {
                category_name: 'test',
                website: 'test',
                date_created: 'test'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
        {
            title: 'title',
            note: 'note ',
            tags: {
                name: 'tag name',
            },
            research_info: {
                category_name: 'category',
                website: 'website.com',
                date_created: 'December 25'
            }
        },
    ];

    console.log(researchItem.map(r => r.note));

    const emptyItems = 0;

    if (researchItem.length == 0 || emptyItems) {
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
            <div className="grid h-full">
                {researchItem.map(item =>
                    <div className="m-2">
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <Item variant="outline" asChild>
                                    <a href="#">
                                        <ItemHeader><strong>{item.title}</strong></ItemHeader>
                                        <ItemContent>
                                            <ItemTitle>{item.note}</ItemTitle>
                                            <ItemTitle>{item.tags.name}</ItemTitle>
                                        </ItemContent>
                                        <div className="flex gap-4">
                                            <Sheet>
                                                <SheetTrigger>
                                                    <Button variant="ghost" className="cursor-pointer"><Eye className="size-5" /></Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>This is where the document webview will show up</SheetTitle>
                                                    </SheetHeader>
                                                </SheetContent>
                                            </Sheet>
                                            <Sheet>
                                                <SheetTrigger>
                                                    <Button variant="ghost" className="cursor-pointer"><SquarePen className="size-5" /></Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>Edit research item</SheetHeader>
                                                    <div className="m-4 grid gap-4">
                                                        <div>
                                                            <SheetDescription>Title</SheetDescription>
                                                            <Input className="mt-2" type="text" value="title" placeholder="Research item title here..." />
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Description</SheetDescription>
                                                            <Input className="mt-2" type="text" placeholder="Enter description..." />
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Note</SheetDescription>
                                                            <Textarea className="mt-2"></Textarea>
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Category</SheetDescription>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <Select>
                                                                        <SelectTrigger className="w-[161px] cursor-pointer">
                                                                            <SelectValue placeholder="Sort by" />
                                                                        </SelectTrigger>
                                                                    </Select>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Select Category</DialogTitle>
                                                                        <div className="mt-4 relative">
                                                                            <Label htmlFor="search" className="sr-only">
                                                                                Search
                                                                            </Label>
                                                                            <Input
                                                                                id="search"
                                                                                type="text"
                                                                                placeholder="Type to search..."
                                                                                className="h-8 pl-7"
                                                                            />
                                                                            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
                                                                        </div>
                                                                        <Item asChild>
                                                                            <a href="#">
                                                                                <ItemMedia>
                                                                                    <LibraryBig className="size-5" />
                                                                                </ItemMedia>
                                                                                <ItemContent>
                                                                                    <ItemTitle>Unsorted</ItemTitle>
                                                                                </ItemContent>
                                                                            </a>
                                                                        </Item>
                                                                        <ItemDescription>Categories</ItemDescription>
                                                                        <Item asChild>
                                                                            <a href="#">
                                                                                <ItemMedia>
                                                                                    <Album className="size-5" />
                                                                                </ItemMedia>
                                                                                <ItemContent>
                                                                                    <ItemTitle>Category</ItemTitle>
                                                                                </ItemContent>
                                                                            </a>
                                                                        </Item>
                                                                    </DialogHeader>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Tags</SheetDescription>
                                                            <Input type="text" placeholder="Add tags..." />
                                                        </div>
                                                        <div>
                                                            <SheetDescription>URL</SheetDescription>
                                                            <Input type="text" placeholder="https://..." />
                                                        </div>
                                                        <SheetDescription>Saved (Date & Time)</SheetDescription>
                                                    </div>
                                                    <SheetFooter>
                                                        <Button variant="secondary"><Star /> Add to favorites</Button>
                                                        <Button variant="destructive">Delete</Button>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>
                                            <Button variant="ghost" className="cursor-pointer"><Trash2 className="size-5" /></Button>
                                        </div>
                                        <ItemFooter>
                                            <div className="flex h-2 items-center space-x-4 ">
                                                <ItemDescription className="flex"><LibraryBig className="size-5 mr-2" /> {item.research_info.category_name}</ItemDescription>
                                                <Separator orientation="vertical" />
                                                <ItemDescription>{item.research_info.website}</ItemDescription>
                                                <Separator orientation="vertical" />
                                                <ItemDescription>{item.research_info.date_created}</ItemDescription>
                                            </div>
                                        </ItemFooter>
                                    </a>
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
