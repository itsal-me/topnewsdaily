"use client";

import { useState, useMemo } from "react";
import { NewsItem } from "@/lib/rss";
import { NewsCard } from "./news-card";
import { useSearch } from "@/contexts/search-context";
import { Pagination } from "./pagination";

interface NewsGridProps {
    items: NewsItem[];
    title?: string;
}

const ITEMS_PER_PAGE = 50;

export function NewsGrid({ items, title }: NewsGridProps) {
    const { searchQuery } = useSearch();
    const [currentPage, setCurrentPage] = useState(1);

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        return searchQuery
            ? items.filter(
                  (item) =>
                      item.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      item.contentSnippet
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      item.source
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
              )
            : items;
    }, [items, searchQuery]);

    // Reset to page 1 when search query changes
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    // Scroll to top when page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (filteredItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                {title && (
                    <h1 className="text-4xl font-bold mb-8 font-serif">
                        {title}
                    </h1>
                )}
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        {searchQuery
                            ? `No news articles found matching "${searchQuery}"`
                            : "No news articles found in the last 24 hours."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {title && (
                <h1 className="text-4xl font-bold mb-10 font-serif tracking-tight">
                    {searchQuery
                        ? `Search results for "${searchQuery}"`
                        : title}
                </h1>
            )}
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                    {searchQuery ? (
                        <>
                            Found {filteredItems.length} article
                            {filteredItems.length !== 1 ? "s" : ""}
                        </>
                    ) : (
                        <>
                            Showing {startIndex + 1}-
                            {Math.min(endIndex, filteredItems.length)} of{" "}
                            {filteredItems.length} articles
                        </>
                    )}
                </p>
                {totalPages > 1 && (
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                )}
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {currentItems.map((item, index) => (
                    <div
                        key={`${item.link}-${index}`}
                        className="break-inside-avoid"
                    >
                        <NewsCard item={item} />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
