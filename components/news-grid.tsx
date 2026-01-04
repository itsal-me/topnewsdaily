"use client";

import { NewsItem } from "@/lib/rss";
import { NewsCard } from "./news-card";
import { useSearch } from "@/contexts/search-context";

interface NewsGridProps {
    items: NewsItem[];
    title?: string;
}

export function NewsGrid({ items, title }: NewsGridProps) {
    const { searchQuery } = useSearch();

    // Filter items based on search query
    const filteredItems = searchQuery
        ? items.filter(
              (item) =>
                  item.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  item.contentSnippet
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  item.source.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : items;

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
            {searchQuery && (
                <p className="text-muted-foreground mb-6">
                    Found {filteredItems.length} article
                    {filteredItems.length !== 1 ? "s" : ""}
                </p>
            )}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredItems.map((item, index) => (
                    <div
                        key={`${item.link}-${index}`}
                        className="break-inside-avoid"
                    >
                        <NewsCard item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}
