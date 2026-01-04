# TopNewsDaily

A modern news aggregator built with Next.js 14+ that displays top headlines from the last 24 hours using the GNews API.

## Features

-   **Real-time News**: Fetches top headlines from 9 different categories
-   **Smart Caching**: Server-side caching with category-specific TTLs to respect API limits
-   **Search Functionality**: Real-time search across titles, descriptions, and sources
-   **Responsive Design**: Beautiful masonry grid layout with mobile support
-   **Dark/Light Mode**: Theme switching with smooth transitions
-   **Modern UI**: Built with Tailwind CSS, shadcn/ui, and Newsreader font

## Categories

-   General (Homepage)
-   World
-   Nation
-   Business
-   Technology
-   Entertainment
-   Sports
-   Science
-   Health

## Tech Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS v4
-   **UI Components**: shadcn/ui
-   **Icons**: Lucide React
-   **News API**: GNews API (Free Tier)
-   **Fonts**: Newsreader (serif), Inter (sans-serif)

## API Usage & Caching

The application uses the GNews API free tier (100 requests/day) with intelligent caching:

### Cache TTLs by Category

| Category           | Update Frequency | TTL       | Daily Requests |
| ------------------ | ---------------- | --------- | -------------- |
| General (Homepage) | Controlled       | 36 min    | ~40            |
| Technology         | Medium-fast      | 2 hours   | ~12            |
| Sports             | Fast             | 1.5 hours | ~16            |
| Science            | Slow             | 5 hours   | ~5             |
| Business           | Medium           | 2.5 hours | ~10            |
| World/Nation       | Medium           | 2.5 hours | ~10 each       |
| Entertainment      | Medium           | 3.5 hours | ~7             |
| Health             | Slow             | 5 hours   | ~5             |

**Total estimated daily requests: ~80-85** (safely under the 100 limit)

### How Caching Works

1. First request to a category fetches from GNews API
2. Subsequent requests within the TTL window use cached data
3. When cache expires, next request fetches fresh data
4. All users share the same cache (server-side)
5. Cache is maintained in-memory for optimal performance

## Getting Started

### Prerequisites

-   Node.js 18+ installed
-   A GNews API key (get it free at [gnews.io](https://gnews.io/))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/itsal-me/topnewsdaily.git
cd topnewsdaily/topnews
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

4. Add your GNews API key to `.env.local`:

```env
GNEWS_API_KEY=your_actual_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
topnews/
├── app/
│   ├── api/news/          # API route for news fetching
│   ├── category/[slug]/   # Dynamic category pages
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation with search
│   ├── news-card.tsx      # Individual news card
│   ├── news-grid.tsx      # Masonry grid layout
│   └── news-skeleton.tsx  # Loading skeletons
├── contexts/
│   └── search-context.tsx # Search state management
├── lib/
│   ├── gnews.ts           # GNews API integration
│   ├── rss.ts             # Legacy RSS (preserved)
│   ├── time.ts            # Time formatting utilities
│   └── utils.ts           # General utilities
└── next.config.ts         # Next.js configuration
```

## Environment Variables

Create a `.env.local` file with:

```env
GNEWS_API_KEY=your_gnews_api_key_here
```

## Features in Detail

### Search

-   Real-time filtering across all news articles
-   Searches through titles, descriptions, and source names
-   Works on both desktop and mobile
-   Displays result count and highlights active search

### Caching Strategy

The application implements a sophisticated caching strategy to maximize the free tier API limits:

1. **Category-Specific TTLs**: Each category has a TTL based on how frequently news changes
2. **Shared Cache**: All users benefit from cached data
3. **Stale-While-Revalidate**: Returns stale cache if API fails
4. **Monitoring**: Built-in cache statistics for debugging

### News Filtering

-   Automatically filters to articles from the last 24 hours
-   Sorts by publication date (newest first)
-   Graceful handling of missing data

## API Endpoints

### GET /api/news

Fetch news for a specific category or general headlines.

**Query Parameters:**

-   `category` (optional): One of `general`, `world`, `nation`, `business`, `technology`, `entertainment`, `sports`, `science`, `health`

**Response:**

```json
{
  "success": true,
  "articles": [...],
  "category": "technology",
  "count": 45
}
```

## Monitoring Cache Performance

The cache system logs helpful information in development:

-   `Cache HIT`: Data served from cache
-   `Cache MISS`: Fresh data fetched from API
-   Check the console for cache statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

-   News data provided by [GNews API](https://gnews.io/)
-   UI components from [shadcn/ui](https://ui.shadcn.com/)
-   Icons from [Lucide](https://lucide.dev/)
