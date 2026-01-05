# TopNewsDaily

A modern news aggregator built with Next.js 14+ that displays top headlines from the last 24 hours from world-class news sources.

## Features

-   **Multiple News Sources**: Aggregates news from New York Times, The Guardian, BBC News, Al Jazeera, and GNews API
-   **Real-time News**: Fetches top headlines from 9 different categories
-   **24-Hour Feed**: Shows only news from the last 24 hours
-   **Smart Caching**: Server-side caching to optimize performance
-   **Search Functionality**: Real-time search across titles, descriptions, and sources
-   **Responsive Design**: Beautiful masonry grid layout with mobile support
-   **Dark/Light Mode**: Theme switching with smooth transitions
-   **Modern UI**: Built with Tailwind CSS, shadcn/ui, and Newsreader font

## News Sources

### RSS Feeds (No API Key Required)

-   **New York Times**: World, Business, Technology, Science, Health, Sports, Arts
-   **The Guardian**: World, Business, Technology, Science, Health, Sports, Culture
-   **BBC News**: World, Business, Technology, Science, Health, Sports, Entertainment
-   **Al Jazeera**: General, Middle East, Business, Technology, Science, Health, Sports, Culture

### API

-   **GNews API**: Provides additional top headlines (requires free API key)

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
-   **News Sources**: RSS Feeds + GNews API
-   **RSS Parser**: rss-parser
-   **Fonts**: Newsreader (serif), Inter (sans-serif)

## How It Works

The application combines news from multiple sources:

1. **RSS Feeds**: Fetches from 4 major news organizations (10+ feeds per category)
2. **GNews API**: Adds top headlines from their API (10 articles per category)
3. **Deduplication**: Removes duplicate articles based on URL
4. **24-Hour Filter**: Shows only articles from the last 24 hours
5. **Caching**: Caches results for 10 minutes to reduce load

## Getting Started

### Prerequisites

-   Node.js 18+ installed
-   A GNews API key (get it free at [gnews.io](https://gnews.io/)) - Optional but recommended

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
