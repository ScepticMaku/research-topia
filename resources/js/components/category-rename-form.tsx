import { Separator } from "@/components/ui/separator"
import { Input } from '@/components/ui/input';
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
import { useForm } from '@inertiajs/react';

export default function CategoryRenameForm({ category }: any) {

    console.log("id: ", category.id);

    const { data, setData, put, errors } = useForm({
        name: category.name,
    })

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('category.update', category.id));
        data.name = category.name;
    }

    return (
        <form onSubmit={handleCategorySubmit}>
            <DialogHeader>
                <DialogTitle>Rename a category</DialogTitle>
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
    );
}
