import AppLayout from '@/layouts/app-layout';
import { Separator } from "@/components/ui/separator"
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { FileX } from 'lucide-react';

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
                        <Item variant="outline" asChild>
                            <a href="#">
                                <ItemHeader>{item.title}</ItemHeader>
                                <ItemContent>
                                    <ItemTitle>{item.note}</ItemTitle>
                                    <ItemTitle>{item.tags.name}</ItemTitle>
                                </ItemContent>
                                <ItemFooter>
                                    <div className="flex h-2 items-center space-x-4 ">
                                        <ItemDescription>{item.research_info.category_name}</ItemDescription>
                                        <Separator orientation="vertical" />
                                        <ItemDescription>{item.research_info.website}</ItemDescription>
                                        <Separator orientation="vertical" />
                                        <ItemDescription>{item.research_info.date_created}</ItemDescription>
                                    </div>
                                </ItemFooter>
                            </a>
                        </Item>
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
        </AppLayout>
    );
}
