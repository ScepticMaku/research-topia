import { useForm } from '@inertiajs/react';
import { Separator } from "@/components/ui/separator"
import { useState } from 'react'
import {
    SheetDescription,
    SheetFooter,
    SheetHeader,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarOff, Trash2, EllipsisVertical, Album, LibraryBig, Search, Star, ChevronDown, Plus, BookmarkX, Save } from 'lucide-react';
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
import InputError from './input-error';
import CategoryRenameForm from './category-rename-form';

export default function ItemForm({ item, categories }: any) {


    const { data, setData, put, errors } = useForm({
        id: item.id,
        title: item.url.title,
        description: item.url.description,
        note: item.note,
        category: item.category.name,
        url: item.url.url,
    });

    const { data: categoryData, setData: setCategoryData, post: postCategory, errors: categoryErrors } = useForm({
        name: '',
    });

    const { put: putFavorite } = useForm();

    const [categoryToEdit, setCategoryToEdit] = useState<number | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<number>(0);
    const [categoryName, setCategoryName] = useState<string | null>(null);

    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteResearchItemDialog, setShowDeleteResearchItemDialog] = useState(false);
    const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);

    const { delete: destroyResearchItem } = useForm();
    const { delete: destroyCategory } = useForm();

    const addFavorite = (id: number) => {
        putFavorite(route('research-item.addFavorite', id));
    }

    const removeFavorite = (id: number) => {
        putFavorite(route('research-item.removeFavorite', id));
    }

    const handleResearchItemSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('research-item.update', item.id));
    }

    const handleDelete = (id: number) => {
        setShowDeleteResearchItemDialog(false);
        destroyResearchItem(route('research-item.destroy', id));
    }

    const handleCategoryDelete = (id: number) => {
        setShowDeleteCategoryDialog(false);
        destroyCategory(route('category.destroy', id));
    }

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postCategory(route('category.store'));
        categoryData.name = '';
    }

    const handleCategorySelect = (id: number) => {
        setShowCategoryDialog(false);
        put(route('research-item.selectCategory', id));
    }

    function formatTimestamp(timestamp: string): string {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <form onSubmit={handleResearchItemSubmit}>
            <SheetHeader>Edit research item</SheetHeader>
            <div className="m-4 grid gap-4">
                <div>
                    <SheetDescription>Title</SheetDescription>
                    <Input className="mt-2" type="text" placeholder="Research item title here..."
                        value={data.title} onChange={(e) => setData('title', e.target.value)}
                    />
                    <InputError className="mt-2 mb-2"
                        message={errors.url}
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
                    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                        <DialogTrigger>
                            <Button type="button" variant="outline" className="w-[161px] cursor-pointer flex justify-between">{data.category} <ChevronDown /></Button>
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
                                            <form onSubmit={handleCategorySubmit}>
                                                <DialogHeader>
                                                    <DialogTitle>Add a category</DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4">
                                                    <DialogDescription>Name:</DialogDescription>
                                                    <Input className="mt-1"
                                                        type="text"
                                                        placeholder="e.g. Assignments"
                                                        value={categoryData.name} onChange={(e) => setCategoryData('name', e.target.value)}
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
                                <Item className='m-2 hover:bg-muted cursor-pointer' variant={`${item.category_id == 1 ? 'muted' : 'default'}`} onClick={() => handleCategorySelect(1)}>
                                    <ItemMedia>
                                        <LibraryBig className="size-5" />
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle>Unsorted</ItemTitle>
                                    </ItemContent>

                                </Item>
                                <ItemDescription>Categories</ItemDescription>
                                <ScrollArea className="h-100">
                                    {categories.length > 1 && categories.slice(1).map((category: any) => (
                                        <Item className='m-2 hover:bg-muted cursor-pointer' variant={`${category.id == item.category_id ? 'muted' : 'default'}`} onClick={() => handleCategorySelect(category.id)}>
                                            <ItemMedia>
                                                <Album className="size-5" />
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle>{category.name}</ItemTitle>
                                            </ItemContent>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button type="button" variant="ghost" size="sm" className="cursor-pointer hover:bg-primary"><EllipsisVertical /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onSelect={() => {
                                                        setShowRenameDialog(true);
                                                        setCategoryToEdit(category.id);
                                                    }}>
                                                        Rename</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => {
                                                        setShowDeleteCategoryDialog(true);
                                                        setCategoryToDelete(category.id);
                                                        setCategoryName(category.name);
                                                    }}>
                                                        Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
                                                <DialogContent>
                                                    <CategoryRenameForm category={categories.find((c => c.id == categoryToEdit))} />
                                                </DialogContent>
                                            </Dialog>
                                            <AlertDialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirm delete?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Do you want to delete {categoryName}? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="cursor-pointer">
                                                            No
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction className="cursor-pointer" onClick={() => handleCategoryDelete(categoryToDelete)}>
                                                            Yes
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                                </ScrollArea>
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
                {item.is_favorite == 0 && (
                    <Button variant="secondary" className="cursor-pointer" onClick={() => addFavorite(item.id)}><Star /> Add to favorites</Button>
                )}
                {item.is_favorite == 1 && (
                    <Button variant="secondary" className="cursor-pointer" onClick={() => removeFavorite(item.id)}><StarOff /> Remove from favorites</Button>
                )}
                <Button type="button" className="w-full cursor-pointer" variant="destructive" onClick={() => setShowDeleteResearchItemDialog(true)}>Delete</Button>
                <AlertDialog open={showDeleteResearchItemDialog} onOpenChange={setShowDeleteResearchItemDialog}>
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
            </SheetFooter>
        </form>
    );
}
