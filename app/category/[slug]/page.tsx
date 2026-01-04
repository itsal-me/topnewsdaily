import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
    getTopHeadlines,
    GNEWS_CATEGORIES,
    type GNewsCategory,
} from "@/lib/gnews";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all GNews categories
export async function generateStaticParams() {
    return GNEWS_CATEGORIES.map((category) => ({
        slug: category,
    }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        title: `${category} News - TopNewsDaily`,
        description: `Today's top ${category.toLowerCase()} news from trusted sources around the world`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    // Check if category exists in GNews categories
    if (!GNEWS_CATEGORIES.includes(slug as GNewsCategory)) {
        notFound();
    }

    // Fetch the news for this category from GNews
    let newsItems: Awaited<ReturnType<typeof getTopHeadlines>>;
    try {
        newsItems = await getTopHeadlines(slug as GNewsCategory);
    } catch (error) {
        console.error(`Error fetching ${slug} headlines:`, error);
        newsItems = [];
    }

    return (
        <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid items={newsItems} title={`${slug} News`} />
        </Suspense>
    );
}
