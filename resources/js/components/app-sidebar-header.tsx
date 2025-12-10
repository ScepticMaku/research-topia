import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { SearchForm } from './search-form';
import { AArrowUp, AArrowDown, ChevronDown, CalendarArrowUp, CalendarArrowDown } from "lucide-react"
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

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light"><CalendarArrowUp />Date (asc)</SelectItem>
                        <SelectItem value="dark"><CalendarArrowDown />Date (desc)</SelectItem>
                        <SelectItem value="system"><AArrowUp />Name (asc)</SelectItem>
                        <SelectItem value="system"><AArrowDown />Name (desc)</SelectItem>
                    </SelectContent>
                </Select>
                <SearchForm />
                <ButtonGroup>
                    <Button variant="secondary">Add</Button>
                    <ButtonGroupSeparator />
                    <Button size="icon" variant="secondary">
                        <ChevronDown />
                    </Button>
                </ButtonGroup>
            </div>
        </header>
    );
}
