import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { SearchForm } from './search-form';
import { AArrowUp, AArrowDown, ChevronDown, CalendarArrowUp, CalendarArrowDown, Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group"
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useForm } from '@inertiajs/react';
import InputError from './input-error';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {

    const { data, setData, post, errors } = useForm({
        url: '',
    })

    const submitUrl = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('research-item.store'));
    }

    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <Select>
                    <SelectTrigger className="w-[160px] cursor-pointer">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dateAsc"><CalendarArrowUp />Date (asc)</SelectItem>
                        <SelectItem value="dateDesc"><CalendarArrowDown />Date (desc)</SelectItem>
                        <SelectItem value="nameAsc"><AArrowUp />Name (asc)</SelectItem>
                        <SelectItem value="nameDesc"><AArrowDown />Name (desc)</SelectItem>
                    </SelectContent>
                </Select>
                <SearchForm />
                <Dialog>
                    <DialogTrigger>
                        <Button className="w-20 cursor-pointer" ><Plus />Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={submitUrl}>
                            <DialogHeader>
                                <DialogTitle>Add a research item</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <DialogDescription>URL:</DialogDescription>
                                <Input className="mt-1"
                                    type="text"
                                    placeholder="https://"
                                    value={data.url} onChange={(e) => setData('url', e.target.value)}
                                />
                                <InputError
                                    message={errors.url}
                                />
                            </div>
                            <Separator />
                            <div>
                                <DialogDescription>or Upload a file:</DialogDescription>
                                <Input className="mt-1" type="file" />
                            </div>
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
            </div>
        </header>
    );
}
