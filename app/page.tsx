import { Suspense } from "react";
import { getAllFeeds, NewsItem } from "@/lib/rss";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";

export const metadata = {
    title: "TopNewsDaily - Today's Top News from Tech, Sports & Science",
    description:
        "Stay updated with today's top news stories from technology, sports, and science. Fresh daily updates from trusted sources.",
};

export default async function Home() {
    // Fetch all news from all categories
    let newsItems: NewsItem[] = [];
    try {
        newsItems = await getAllFeeds();
    } catch (error) {
        console.error("Error fetching news feeds:", error);
        newsItems = [];
    }

    return (
        <Suspense fallback={<NewsGridSkeleton count={9} />}>
            <NewsGrid items={newsItems} title="Today's Top Stories" />
        </Suspense>
    );
}
