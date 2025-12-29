import { useForm } from '@inertiajs/react';
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from 'react'
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
import CategoryRenameForm from '@/components/category-rename-form';


export default function CategoryDialog({ categories, item, onCategoryChange }: any) {

    const categoryList = categories.slice(1);

    const [categoryToEdit, setCategoryToEdit] = useState<number | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<number>(0);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string | ''>('');
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);

    const { delete: destroyCategory, processing: categoryDeleteProcessing } = useForm({
        id: item.id,
    });

    const { put } = useForm({
        id: item.id
    });

    const { data: categoryData, setData: setCategoryData, post: postCategory, errors: categoryErrors, processing: categoryProcessing } = useForm({
        name: '',
    });

    const filteredCategoryList = categoryList.filter(category => category.name.toLowerCase().includes(searchValue.toLowerCase()));

    const handleInputChange = (e: any) => {
        const value = e.target.value;
        setSearchValue(value);
    }

    const handleCategoryDelete = (id: number, e: any) => {
        setShowDeleteCategoryDialog(false);
        destroyCategory(route('category.destroy', id));
        e.stopPropagation();
    }

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postCategory(route('category.store'));
        categoryData.name = '';
    }

    const handleCategorySelect = (id: number, name: string) => {
        if (onCategoryChange) {
            onCategoryChange(name);
            setShowCategoryDialog(false);
            put(route('research-item.selectCategory', id));
        }
    }

    return (
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
                        value={searchValue} onChange={handleInputChange}
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
                                    <Button type="submit" className="cursor-pointer" disabled={categoryProcessing}>Submit</Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <div>
                </div>
            </div>
            <Item className='m-2 hover:bg-muted cursor-pointer' variant={`${item.category_id == 1 ? 'muted' : 'default'}`} onClick={() => handleCategorySelect(1, "Unsorted")}>
                <ItemMedia>
                    <LibraryBig className="size-5" />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>Unsorted</ItemTitle>
                </ItemContent>

            </Item>
            <ItemDescription>Categories</ItemDescription>
            <ScrollArea className="h-100">
                {categories.length > 1 && filteredCategoryList.map((category: any) => (
                    <Item className='m-2 hover:bg-muted cursor-pointer' variant={`${category.id == item.category_id ? 'muted' : 'default'}`} onClick={() => handleCategorySelect(category.id, category.name)}>
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
                                <DropdownMenuItem onClick={(e) => {
                                    setShowRenameDialog(true);
                                    setCategoryToEdit(category.id);
                                    e.stopPropagation();
                                }}>
                                    Rename</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
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
                                    <AlertDialogAction disabled={categoryDeleteProcessing} className="cursor-pointer" onClick={(e) => handleCategoryDelete(categoryToDelete, e)} >
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
    );
}
