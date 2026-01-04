import { NextRequest, NextResponse } from 'next/server';
import { getTopHeadlines, getAllHeadlines, isValidCategory, type GNewsCategory } from '@/lib/gnews';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    // If no category specified, return general headlines (homepage)
    if (!category) {
      const articles = await getAllHeadlines();
      return NextResponse.json({ 
        success: true, 
        articles,
        category: 'general',
        count: articles.length 
      });
    }
    
    // Validate category
    if (!isValidCategory(category)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid category',
          validCategories: ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health']
        },
        { status: 400 }
      );
    }
    
    // Fetch headlines for the specified category
    const articles = await getTopHeadlines(category as GNewsCategory);
    
    return NextResponse.json({ 
      success: true, 
      articles,
      category,
      count: articles.length 
    });
    
  } catch (error) {
    console.error('[API] Error fetching news:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}

// Enable caching at the route level
export const dynamic = 'force-dynamic';
export const revalidate = 2160; // 36 minutes (matches general category TTL)
