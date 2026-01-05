import Parser from 'rss-parser';

// Define the NewsItem interface for normalized RSS data
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

// Map of categories to multiple RSS feed URLs
const RSS_FEEDS: Record<string, Array<{ url: string; source: string }>> = {
  general: [
    {
      url: 'https://www.aljazeera.com/xml/rss/all.xml',
      source: 'Al Jazeera',
    },
  ],
  world: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/world/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/middleeast.xml',
      source: 'Al Jazeera',
    },
  ],
  nation: [
    // Using general US/UK news feeds for nation category
    {
      url: 'http://feeds.bbci.co.uk/news/uk/rss.xml',
      source: 'BBC News',
    },
  ],
  business: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/business/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/business.xml',
      source: 'Al Jazeera',
    },
  ],
  technology: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/technology/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/technology/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/technology.xml',
      source: 'Al Jazeera',
    },
  ],
  science: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/science/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/science.xml',
      source: 'Al Jazeera',
    },
  ],
  health: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/society/health/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/health/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/health.xml',
      source: 'Al Jazeera',
    },
  ],
  sports: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/sport/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/sport/rss.xml',
      source: 'BBC Sport',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/sports.xml',
      source: 'Al Jazeera',
    },
  ],
  entertainment: [
    {
      url: 'https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml',
      source: 'New York Times',
    },
    {
      url: 'https://www.theguardian.com/culture/rss',
      source: 'The Guardian',
    },
    {
      url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
      source: 'BBC News',
    },
    {
      url: 'https://www.aljazeera.com/xml/rss/culture.xml',
      source: 'Al Jazeera',
    },
  ],
};

// Cache storage with timestamp
interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Helper function to extract thumbnail from RSS item
function extractThumbnail(item: any): string | undefined {
  // Try different common RSS thumbnail formats
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  if (item['media:content']?.$?.url) {
    return item['media:content'].$.url;
  }
  if (item['media:thumbnail']?.$?.url) {
    return item['media:thumbnail'].$.url;
  }
  if (item.content && item.content.includes('<img')) {
    // Extract first image from content
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  return undefined;
}

// Main function to fetch and normalize RSS feeds from multiple sources
export async function getFeed(category: string): Promise<NewsItem[]> {
  const normalizedCategory = category.toLowerCase();

  // Check if category exists
  if (!RSS_FEEDS[normalizedCategory]) {
    throw new Error(`Category "${category}" not found`);
  }

  // Check cache first
  const cachedEntry = cache[normalizedCategory];
  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
    return cachedEntry.data;
  }

  const parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'media:content'],
        ['media:thumbnail', 'media:thumbnail'],
        ['enclosure', 'enclosure'],
        ['content:encoded', 'contentEncoded'],
      ],
    },
  });

  const feedConfigs = RSS_FEEDS[normalizedCategory];
  const allNewsItems: NewsItem[] = [];

  // Fetch all feeds for this category in parallel
  const feedPromises = feedConfigs.map(async (feedConfig) => {
    try {
      const feed = await parser.parseURL(feedConfig.url);

      // Normalize the feed items
      const newsItems: NewsItem[] = feed.items.map((item: any) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet || item.summary || '',
        content: item.content || item.contentEncoded || '',
        thumbnail: extractThumbnail(item),
        source: feedConfig.source,
        category: normalizedCategory,
      }));

      return newsItems;
    } catch (error) {
      console.error(`Error fetching RSS feed from ${feedConfig.source}:`, error);
      return []; // Return empty array for failed feeds
    }
  });

  try {
    // Wait for all feeds to complete
    const feedResults = await Promise.all(feedPromises);
    
    // Flatten and merge all results
    feedResults.forEach(items => {
      allNewsItems.push(...items);
    });

    // Filter to last 24 hours only
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentNews = allNewsItems.filter(item => 
      new Date(item.pubDate).getTime() > twentyFourHoursAgo
    );

    // Sort by publication date (newest first)
    recentNews.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    // Update cache
    cache[normalizedCategory] = {
      data: recentNews,
      timestamp: Date.now(),
    };

    return recentNews;
  } catch (error) {
    console.error(`Error fetching RSS feeds for ${category}:`, error);
    
    // Return cached data if available, even if expired
    if (cachedEntry) {
      return cachedEntry.data;
    }
    
    throw error;
  }
}

// Helper function to get all available categories
export function getCategories(): string[] {
  return Object.keys(RSS_FEEDS);
}

// Helper function to get feeds from multiple categories
export async function getMultipleFeeds(
  categories: string[]
): Promise<NewsItem[]> {
  const feedPromises = categories.map((cat) => getFeed(cat));
  const feeds = await Promise.all(feedPromises);
  
  // Merge and sort by publication date
  return feeds
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

// Helper function to get all feeds
export async function getAllFeeds(): Promise<NewsItem[]> {
  return getMultipleFeeds(getCategories());
}
