// GNews API integration with server-side caching
// Free tier: 100 requests/day

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
  thumbnail?: string;
  source: string;
  category: string;
}

// Category-specific TTL configuration (in milliseconds)
const CATEGORY_TTL: Record<string, number> = {
  general: 1 * 60 * 60 * 1000,        // 1 hour
  technology: 2 * 60 * 60 * 1000, // 2 hours
  sports: 90 * 60 * 1000,         // 1.5 hours
  science: 5 * 60 * 60 * 1000,    // 5 hours
  business: 2.5 * 60 * 60 * 1000, // 2.5 hours
  world: 3.5 * 60 * 60 * 1000,    // 3.5 hours
  nation: 3.5 * 60 * 60 * 1000,   // 3.5 hours
  entertainment: 3.5 * 60 * 60 * 1000, // 3.5 hours
  health: 5 * 60 * 60 * 1000,     // 5 hours
};

// Valid GNews categories
export const GNEWS_CATEGORIES = [
  'general',
  'world',
  'nation',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
] as const;

export type GNewsCategory = typeof GNEWS_CATEGORIES[number];

// Cache storage
interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
  category: string;
}

const cache = new Map<string, CacheEntry>();

// Normalize GNews article to our NewsItem format
function normalizeArticle(article: GNewsArticle, category: string): NewsItem {
  return {
    title: article.title,
    link: article.url,
    pubDate: article.publishedAt,
    contentSnippet: article.description,
    content: article.content,
    thumbnail: article.image,
    source: article.source.name,
    category: category,
  };
}

// Check if category is valid
export function isValidCategory(category: string): category is GNewsCategory {
  return GNEWS_CATEGORIES.includes(category as GNewsCategory);
}

// Get TTL for a specific category
function getTTL(category: string): number {
  return CATEGORY_TTL[category] || CATEGORY_TTL.general;
}

// Main function to fetch top headlines with caching
export async function getTopHeadlines(category: GNewsCategory): Promise<NewsItem[]> {
  const cacheKey = `gnews_${category}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  const now = Date.now();
  const ttl = getTTL(category);
  
  if (cached && (now - cached.timestamp) < ttl) {
    console.log(`[GNews] Cache HIT for ${category} (age: ${Math.round((now - cached.timestamp) / 1000 / 60)}min)`);
    return cached.data;
  }
  
  console.log(`[GNews] Cache MISS for ${category} - Fetching from API`);
  
  // Fetch from GNews API
  const apiKey = process.env.GNEWS_API_KEY;
  
  if (!apiKey) {
    throw new Error('GNEWS_API_KEY environment variable is not set');
  }
  
  const url = new URL('https://gnews.io/api/v4/top-headlines');
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('category', category);
  url.searchParams.set('lang', 'en');
  url.searchParams.set('max', '100'); // Get maximum articles
  
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: Math.floor(ttl / 1000) }, // Next.js revalidation
    });
    
    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response from GNews API');
    }
    
    // Normalize articles
    const newsItems: NewsItem[] = data.articles.map((article: GNewsArticle) =>
      normalizeArticle(article, category)
    );
    
    // Filter to last 1 week
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const recentNews = newsItems.filter(item => 
      new Date(item.pubDate).getTime() > oneWeekAgo
    );
    
    // Sort by date (newest first)
    recentNews.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    // Update cache
    cache.set(cacheKey, {
      data: recentNews,
      timestamp: now,
      category: category,
    });
    
    console.log(`[GNews] Cached ${recentNews.length} articles for ${category}`);
    
    return recentNews;
  } catch (error) {
    console.error(`[GNews] Error fetching ${category}:`, error);
    
    // Return stale cache if available
    if (cached) {
      console.log(`[GNews] Returning stale cache for ${category}`);
      return cached.data;
    }
    
    throw error;
  }
}

// Get all headlines (for homepage)
export async function getAllHeadlines(): Promise<NewsItem[]> {
  return getTopHeadlines('general');
}

// Get cache statistics (for monitoring)
export function getCacheStats() {
  const stats: Record<string, any> = {};
  
  cache.forEach((entry, key) => {
    const age = Date.now() - entry.timestamp;
    const ttl = getTTL(entry.category);
    stats[key] = {
      category: entry.category,
      articles: entry.data.length,
      ageMinutes: Math.round(age / 1000 / 60),
      ttlMinutes: Math.round(ttl / 1000 / 60),
      isStale: age > ttl,
    };
  });
  
  return stats;
}
