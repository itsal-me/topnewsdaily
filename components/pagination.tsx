"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
        // Show all pages if total is less than showPages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        // Show pages around current page
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        // Always show last page
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-muted-foreground"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => onPageChange(page as number)}
                        className="min-w-10"
                    >
                        {page}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
