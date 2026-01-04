import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getFeed, getCategories } from "@/lib/rss";
import { NewsGrid } from "@/components/news-grid";
import { NewsGridSkeleton } from "@/components/news-skeleton";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
    const categories = getCategories();

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
        description: `Today's top ${category.toLowerCase()} news from trusted sources around the world`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;

    // Check if category exists
    const categories = getCategories();
    if (!categories.includes(slug.toLowerCase())) {
        notFound();
    }

    // Fetch the news feed for this category
    let newsItems: Awaited<ReturnType<typeof getFeed>>;
    try {
        newsItems = await getFeed(slug);
    } catch (error) {
        console.error(`Error fetching ${slug} feed:`, error);
        newsItems = [];
    }

    return (
        <Suspense fallback={<NewsGridSkeleton />}>
            <NewsGrid items={newsItems} title={`${slug} News`} />
        </Suspense>
    );
}
