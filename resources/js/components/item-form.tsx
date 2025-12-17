import { useForm } from '@inertiajs/react';
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import {
    SheetDescription,
    SheetFooter,
    SheetHeader,
} from "@/components/ui/sheet"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EllipsisVertical, Album, SquarePen, Trash2, Eye, FileX, LibraryBig, Search, Star, ChevronDown, Plus, BookmarkX, Save } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Button } from '@/components/ui/button';
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

export default function ItemForm({ item, categories }: any) {

    console.log(item);
    console.log(categories);

    const { data, setData, post, errors } = useForm({
        title: item.url.title,
        description: item.url.description,
        note: item.note,
        category: item.category.name,
        url: item.url.url,
    });

    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        destroy(route('research-item.destroy', id));
    }

    const handleCategoryDelete = (id: number) => {
        destroy(route('category.destroy', id));
    }

    const handleCategoryNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postCategory(route('category.store'));
    }

    const handleCategoryRename = (e: React.FormEvent) => {
        e.preventDefault();
        putCategory(route('category.update'));
    }

    function formatTimestamp(timestamp: string): string {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <form>
            <SheetHeader>Edit research item</SheetHeader>
            <div className="m-4 grid gap-4">
                <div>
                    <SheetDescription>Title</SheetDescription>
                    <Input className="mt-2" type="text" placeholder="Research item title here..."
                        value={data.title} onChange={(e) => setData('title', e.target.value)}
                    />
                </div>
                <div>
                    <SheetDescription>Description</SheetDescription>
                    <Input className="mt-2" type="text" placeholder="Enter description..."
                        value={data.description} onChange={(e) => setData('description', e.target.value)}
                    />
                </div>
                <div>
                    <SheetDescription>Note</SheetDescription>
                    <Textarea className="mt-2"
                        value={data.note} onChange={(e) => setData('note', e.target.value)}
                    ></Textarea>
                </div>
                <div>
                    <SheetDescription>Category</SheetDescription>
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="outline" className="w-[161px] cursor-pointer flex justify-between">{data.category} <ChevronDown /></Button>
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
                    <Input type="text" placeholder="https://..." value={data.url} onChange={(e) => setData('url', e.target.value)} />
                </div>
                <SheetDescription>Saved Date: {formatTimestamp(item.created_at)}</SheetDescription>
            </div>
            <SheetFooter className="h-full flex">
                <Button type="submit" className="w-full cursor-pointer"><Save /> Submit changes</Button>
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
        </form>
    );
}
