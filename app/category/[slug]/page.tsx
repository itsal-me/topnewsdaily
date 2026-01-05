import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCombinedNews, getAvailableCategories } from "@/lib/news-aggregator";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all available categories
export async function generateStaticParams() {
    const categories = getAvailableCategories();
    return categories.map((category) => ({
        slug: category,
    }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        title: `${category} News - TopNewsDaily`,
        description: `Today's top ${category.toLowerCase()} news from New York Times, The Guardian, BBC, Al Jazeera, and more trusted sources`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const availableCategories = getAvailableCategories();

    // Check if category exists
    if (!availableCategories.includes(slug)) {
        notFound();
    }

    // Fetch the news for this category from both RSS and GNews
    let newsItems: Awaited<ReturnType<typeof getCombinedNews>>;
    try {
        newsItems = await getCombinedNews(slug);
    } catch (error) {
        console.error(`Error fetching ${slug} headlines:`, error);
        newsItems = [];
    }

    const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

    return (
        <Suspense fallback={<NewsGridSkeleton count={20} />}>
            <NewsGrid items={newsItems} title={`${categoryTitle} News`} />
        </Suspense>
    );
}
