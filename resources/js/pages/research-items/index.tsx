import AppLayout from '@/layouts/app-layout';
import { Separator } from "@/components/ui/separator"
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { EllipsisVertical, Album, SquarePen, Trash2, Eye, FileX, LibraryBig, Search, Star, ChevronDown, Plus, BookmarkX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Research Items',
        href: '/research-items',
    },
];

export default function Index({ researchItems, categories }: any) {

    console.log(researchItems);
    console.log(categories);

    const { delete: destroy } = useForm();
    const { data, setData, post, errors } = useForm({
        title: '',
        description: '',
        note: '',
        category: '',
        url: '',
        name: '',
    });
    const { data: renameData, setData: setRenameData, put } = useForm({
        name: '',
        id: null,
    });

    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleCategoryNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('category.store'));
    }

    const handleCategoryRename = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('category.update'));
    }

    const handleCategoryDelete = (id: number) => {
        destroy(route('category.destroy', id));
    }

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
            <div className="grid h-full">
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
                                                    <SheetHeader>Edit research item</SheetHeader>
                                                    <div className="m-4 grid gap-4">
                                                        <div>
                                                            <SheetDescription>Title</SheetDescription>
                                                            <Input className="mt-2" type="text" placeholder="Research item title here..."
                                                                value={item.url.title} onChange={(e) => setData('title', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Description</SheetDescription>
                                                            <Input className="mt-2" type="text" placeholder="Enter description..."
                                                                value={item.url.description} onChange={(e) => setData('description', e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Note</SheetDescription>
                                                            <Textarea className="mt-2"
                                                                value={item.note} onChange={(e) => setData('note', e.target.value)}
                                                            ></Textarea>
                                                        </div>
                                                        <div>
                                                            <SheetDescription>Category</SheetDescription>
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <Button variant="outline" className="w-[161px] cursor-pointer flex justify-between">{item.category.name} <ChevronDown /></Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Select Category</DialogTitle>
                                                                        <div className="mt-2 flex content-center gap-2">
                                                                            <div className="w-full relative">
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
                                                                            <Dialog>
                                                                                <DialogTrigger>
                                                                                    <Button size="sm" className="cursor-pointer"><Plus />Add</Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent>
                                                                                    <form onSubmit={handleCategoryNameSubmit}>
                                                                                        <DialogHeader>
                                                                                            <DialogTitle>Add a category</DialogTitle>
                                                                                        </DialogHeader>
                                                                                        <div className="mt-4">
                                                                                            <DialogDescription>Name:</DialogDescription>
                                                                                            <Input className="mt-1"
                                                                                                type="text"
                                                                                                placeholder="e.g. Assignments"
                                                                                                value={data.name} onChange={(e) => setData('name', e.target.value)}
                                                                                            />
                                                                                        </div>
                                                                                        <Separator />
                                                                                        <DialogFooter className="mt-4">
                                                                                            <DialogClose asChild>
                                                                                                <Button variant="outline">Cancel</Button>
                                                                                            </DialogClose>
                                                                                            <DialogClose asChild>
                                                                                                <Button type="submit" className="cursor-pointer">Submit</Button>
                                                                                            </DialogClose>
                                                                                        </DialogFooter>
                                                                                    </form>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                            <div>
                                                                            </div>
                                                                        </div>
                                                                        {(item.category_id) == 1 && (
                                                                            <Item className="hover:bg-muted cursor-pointer" variant="muted">
                                                                                <ItemMedia>
                                                                                    <LibraryBig className="size-5" />
                                                                                </ItemMedia>
                                                                                <ItemContent>
                                                                                    <ItemTitle>Unsorted</ItemTitle>
                                                                                </ItemContent>

                                                                            </Item>
                                                                        )}
                                                                        {(item.category_id) != 1 && (
                                                                            <Item className="hover:bg-muted cursor-pointer" >
                                                                                <ItemMedia>
                                                                                    <LibraryBig className="size-5" />
                                                                                </ItemMedia>
                                                                                <ItemContent>
                                                                                    <ItemTitle>Unsorted</ItemTitle>
                                                                                </ItemContent>
                                                                            </Item>
                                                                        )}
                                                                        <ItemDescription>Categories</ItemDescription>
                                                                        {categories.length > 1 && categories.slice(1).map((category: any) => (
                                                                            <Item className="hover:bg-muted cursor-pointer">
                                                                                <ItemMedia>
                                                                                    <Album className="size-5" />
                                                                                </ItemMedia>
                                                                                <ItemContent>
                                                                                    <ItemTitle>{category.name}</ItemTitle>
                                                                                </ItemContent>
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger>
                                                                                        <Button variant="ghost" size="sm" className="cursor-pointer hover:bg-primary" ><EllipsisVertical /></Button>
                                                                                    </DropdownMenuTrigger>
                                                                                    <DropdownMenuContent>
                                                                                        <DropdownMenuItem onSelect={() => setShowRenameDialog(true)}>Rename</DropdownMenuItem>
                                                                                        <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)}>Delete</DropdownMenuItem>
                                                                                    </DropdownMenuContent>
                                                                                </DropdownMenu>
                                                                                <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                                                                                    <DialogContent>
                                                                                        <form onSubmit={handleCategoryNameSubmit}>
                                                                                            <DialogHeader>
                                                                                                <DialogTitle>Rename a category</DialogTitle>
                                                                                            </DialogHeader>
                                                                                            <div className="mt-4">
                                                                                                <DialogDescription>Name:</DialogDescription>
                                                                                                <Input className="mt-1"
                                                                                                    type="text"
                                                                                                    placeholder="e.g. Assignments"
                                                                                                    value={category.name} onChange={(e) => setRenameData('name', e.target.value)}
                                                                                                />
                                                                                            </div>
                                                                                            <Separator />
                                                                                            <DialogFooter className="mt-4">
                                                                                                <DialogClose asChild>
                                                                                                    <Button variant="outline">Cancel</Button>
                                                                                                </DialogClose>
                                                                                                <DialogClose asChild>
                                                                                                    <Button type="submit" className="cursor-pointer">Submit</Button>
                                                                                                </DialogClose>
                                                                                            </DialogFooter>
                                                                                        </form>
                                                                                    </DialogContent>
                                                                                </Dialog>
                                                                                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                                                                    <DialogContent>
                                                                                        <DialogHeader>
                                                                                            <DialogTitle>Confirm delete?</DialogTitle>
                                                                                            <DialogDescription>
                                                                                                Do you want to delete {category.name}? This action cannot be undone.
                                                                                            </DialogDescription>
                                                                                        </DialogHeader>
                                                                                        <DialogFooter>
                                                                                            <DialogClose>
                                                                                                <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>No</Button>
                                                                                            </DialogClose>
                                                                                            <Button variant="destructive" onClick={() => handleCategoryDelete(category.id)}>Yes</Button>
                                                                                        </DialogFooter>
                                                                                    </DialogContent>
                                                                                </Dialog>
                                                                            </Item>
                                                                        ))}
                                                                        {(categories.length == 1) && (
                                                                            <Empty>
                                                                                <EmptyHeader>
                                                                                    <EmptyMedia variant="icon">
                                                                                        <BookmarkX />
                                                                                    </EmptyMedia>
                                                                                    <EmptyTitle>Categories Empty</EmptyTitle>
                                                                                    <EmptyDescription>No categories found</EmptyDescription>
                                                                                </EmptyHeader>
                                                                            </Empty>
                                                                        )}
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
                                                            <Input type="text" placeholder="https://..." value={item.url.url} />
                                                        </div>
                                                        <SheetDescription>Saved Date: {formatTimestamp(item.created_at)}</SheetDescription>
                                                    </div>
                                                    <SheetFooter>
                                                        <Button variant="secondary" className="cursor-pointer"><Star /> Add to favorites</Button>
                                                        <Dialog>
                                                            <DialogTrigger>
                                                                <Button className="w-full cursor-pointer" variant="destructive">Delete</Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Confirm delete?</DialogTitle>
                                                                    <DialogDescription>
                                                                        Do you want to delete {item.url.title}? This action cannot be undone.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose>
                                                                        <Button variant="secondary">No</Button>
                                                                    </DialogClose>
                                                                    <Button variant="destructive" onClick={() => handleDelete(item.id)}>Yes</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button variant="ghost" className="hover:bg-destructive cursor-pointer"><Trash2 className="size-5" /></Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm delete?</DialogTitle>
                                                        <DialogDescription>
                                                            Do you want to delete {item.url.title}? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose>
                                                            <Button className="cursor-pointer" variant="secondary">No</Button>
                                                        </DialogClose>
                                                        <Button className="cursor-pointer" variant="destructive" onClick={() => handleDelete(item.id)}>Yes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
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
