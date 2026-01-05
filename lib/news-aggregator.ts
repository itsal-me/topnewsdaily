// Combined news aggregator: RSS feeds + GNews API
import { NewsItem } from './rss';
import { getFeed } from './rss';
import { getTopHeadlines, GNewsCategory, GNEWS_CATEGORIES } from './gnews';

// Map RSS categories to GNews categories
const CATEGORY_MAP: Record<string, GNewsCategory> = {
  general: 'general',
  world: 'world',
  nation: 'nation',
  business: 'business',
  technology: 'technology',
  science: 'science',
  health: 'health',
  sports: 'sports',
  entertainment: 'entertainment',
};

// Get combined news from both RSS feeds and GNews API
export async function getCombinedNews(category: string): Promise<NewsItem[]> {
  const normalizedCategory = category.toLowerCase();
  
  // Fetch from both sources in parallel
  const promises: Promise<NewsItem[]>[] = [];
  
  // Add RSS feed promise
  try {
    promises.push(getFeed(normalizedCategory));
  } catch (error) {
    console.warn(`RSS feed not available for ${category}`);
  }
  
  // Add GNews promise if category is supported
  const gnewsCategory = CATEGORY_MAP[normalizedCategory];
  if (gnewsCategory && GNEWS_CATEGORIES.includes(gnewsCategory)) {
    try {
      promises.push(getTopHeadlines(gnewsCategory));
    } catch (error) {
      console.warn(`GNews not available for ${category}`);
    }
  }
  
  try {
    // Wait for all promises to resolve
    const results = await Promise.allSettled(promises);
    
    // Combine all successful results
    const allNews: NewsItem[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allNews.push(...result.value);
      }
    });
    
    // Remove duplicates based on URL
    const uniqueNews = Array.from(
      new Map(allNews.map(item => [item.link, item])).values()
    );
    
    // Filter to last 24 hours
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentNews = uniqueNews.filter(item => 
      new Date(item.pubDate).getTime() > twentyFourHoursAgo
    );
    
    // Sort by date (newest first)
    recentNews.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    console.log(`[NewsAggregator] Combined ${recentNews.length} unique articles for ${category}`);
    
    return recentNews;
  } catch (error) {
    console.error(`Error fetching combined news for ${category}:`, error);
    return [];
  }
}

// Get all headlines for homepage (general category)
export async function getAllCombinedHeadlines(): Promise<NewsItem[]> {
  return getCombinedNews('general');
}

// Get all news from all categories for homepage
export async function getAllCategoriesNews(): Promise<NewsItem[]> {
  const categories = getAvailableCategories();
  
  console.log(`[NewsAggregator] Fetching news from ${categories.length} categories`);
  
  // Fetch all categories in parallel
  const promises = categories.map(category => getCombinedNews(category));
  const results = await Promise.allSettled(promises);
  
  // Combine all successful results
  const allNews: NewsItem[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      allNews.push(...result.value);
    } else {
      console.warn(`Failed to fetch ${categories[index]}`);
    }
  });
  
  // Remove duplicates based on URL
  const uniqueNews = Array.from(
    new Map(allNews.map(item => [item.link, item])).values()
  );
  
  // Filter to last 24 hours (double check)
  const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
  const recentNews = uniqueNews.filter(item => 
    new Date(item.pubDate).getTime() > twentyFourHoursAgo
  );
  
  // Sort by date (newest first)
  recentNews.sort((a, b) => 
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
  
  console.log(`[NewsAggregator] Homepage: ${recentNews.length} unique articles from all categories`);
  
  return recentNews;
}

// Get available categories
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_MAP);
}
