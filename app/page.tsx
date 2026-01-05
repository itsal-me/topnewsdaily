import { Suspense } from "react";
import { getAllCategoriesNews } from "@/lib/news-aggregator";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";

export const metadata = {
    title: "TopNewsDaily - Today's Top News from Around the World",
    description:
        "Stay updated with today's top news stories from world-class sources including New York Times, The Guardian, BBC, Al Jazeera, and more. Fresh daily updates across all categories.",
};

export default async function Home() {
    // Fetch all news from all categories (RSS feeds + GNews API)
    let newsItems: any[] = [];
    try {
        newsItems = await getAllCategoriesNews();
    } catch (error) {
        console.error("Error fetching news headlines:", error);
        newsItems = [];
    }

    return (
        <Suspense fallback={<NewsGridSkeleton count={50} />}>
            <NewsGrid items={newsItems} title="Today's Top Stories" />
        </Suspense>
    );
}
