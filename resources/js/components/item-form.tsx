import { Link, useForm } from '@inertiajs/react';
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
import { StarOff, Trash2, EllipsisVertical, Album, LibraryBig, Search, Star, ChevronDown, Plus, BookmarkX, Save, PlusIcon, X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import InputError from './input-error';
import CategoryDialog from '@/components/category-dialog';
import { Badge } from './ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function ItemForm({ item, categories }: any) {


    const { data: itemData, setData: setItemData, put: putItemData, errors: itemErrors, processing: itemProcessing } = useForm({
        id: item.id,
        title: item.url.title,
        description: item.url.description,
        note: item.note,
        category: item.category.name,
        url: item.url.url,
    });

    const { post: postFavorite, processing: favoriteProcessing } = useForm();

    const [showDeleteResearchItemDialog, setShowDeleteResearchItemDialog] = useState(false);
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [showTagPopover, setShowTagPopover] = useState(false);

    const [currentCategory, setCurrentCategory] = useState(itemData.category);

    const { delete: destroyResearchItem } = useForm();

    const { data: tagData, setData: setTagData, post: postTag, processing: processingTag, delete: destroyTag } = useForm({
        research_item_id: item.id,
        name: ''
    });

    const toggleFavorite = (id: number) => {
        postFavorite(route('research-item.toggleFavorite', id));
    }

    const handleResearchItemSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putItemData(route('research-item.update', item.id));
    }

    const handleDelete = (id: number) => {
        setShowDeleteResearchItemDialog(false);
        destroyResearchItem(route('research-item.destroy', id));
    }

    const handleCategoryChange = (newCategory: any) => {
        setCurrentCategory(newCategory);
        setShowCategoryDialog(false);
    }

    const handleTagSubmit = (e: any) => {
        e.preventDefault();
        postTag(route('research-item.addTag'));
        setTagData('name', '');
        setShowTagPopover(false);
    }

    const handleTagRemove = (id: number) => {
        destroyTag(route('research-item.removeTag', id));
    }

    function formatTimestamp(timestamp: string): string {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div>
            <form onSubmit={handleResearchItemSubmit}>
                <SheetHeader>Edit research item</SheetHeader>
                <div className="m-4 grid gap-4">
                    <div>
                        <SheetDescription>Title</SheetDescription>
                        <Input className="mt-2" type="text" placeholder="Research item title here..."
                            value={itemData.title} onChange={(e) => setItemData('title', e.target.value)}
                        />
                        <InputError className="mt-2 mb-2"
                            message={itemErrors.url}
                        />
                    </div>
                    <div>
                        <SheetDescription>Description</SheetDescription>
                        <Input className="mt-2" type="text" placeholder="Enter description..."
                            value={itemData.description} onChange={(e) => setItemData('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <SheetDescription>Note</SheetDescription>
                        <Textarea className="mt-2"
                            value={itemData.note} onChange={(e) => setItemData('note', e.target.value)}
                        ></Textarea>
                    </div>
                    <div>
                        <SheetDescription>Category</SheetDescription>
                        <Button type="button" variant="outline" className="mt-2 min-w-30 cursor-pointer flex justify-between" onClick={(e) => setShowCategoryDialog(true)}>{currentCategory} <ChevronDown /></Button>
                    </div>
                    <div>
                        <SheetDescription>Tags</SheetDescription>
                        <div className="mt-2 gap-2 flex flex-wrap">
                            {item.tag.map(tag => (
                                <Badge>{tag.name} <span className="cursor-pointer" onClick={() => handleTagRemove(tag.id)} ><X size="13" /></span></Badge>
                            ))}
                            <Popover open={showTagPopover} onOpenChange={setShowTagPopover}>
                                <PopoverTrigger>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setShowTagPopover(true)}><PlusIcon /></Badge>
                                </PopoverTrigger>
                                <PopoverContent className="flex gap-2">
                                    <Input type="text" value={tagData.name} onChange={(e) => setTagData('name', e.target.value)} />
                                    <Button type="button" className="cursor-pointer" onClick={(e) => handleTagSubmit(e)} disabled={processingTag}>Submit</Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div>
                        <SheetDescription>URL</SheetDescription>
                        <Input className="mt-2" type="text" placeholder="https://..." value={itemData.url} onChange={(e) => setItemData('url', e.target.value)} />
                    </div>
                    <SheetDescription>Saved Date: {formatTimestamp(item.created_at)}</SheetDescription>
                </div>
                <SheetFooter className="h-full flex">
                    <Button type="submit" className="w-full cursor-pointer" disabled={itemProcessing}><Save /> Submit changes</Button>
                    {item.is_favorite == 0 && (
                        <Button variant="secondary" className="cursor-pointer" onClick={() => toggleFavorite(item.id)} disabled={favoriteProcessing}><Star /> Add to favorites</Button>
                    )}
                    {item.is_favorite == 1 && (
                        <Button variant="secondary" className="cursor-pointer" onClick={() => toggleFavorite(item.id)} disabled={favoriteProcessing}><StarOff /> Remove from favorites</Button>
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
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogContent>
                    <CategoryDialog categories={categories} item={item} onCategoryChange={handleCategoryChange} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
