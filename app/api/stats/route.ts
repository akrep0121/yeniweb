import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'data', 'stats.json');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('slug');
    const action = searchParams.get('action');

    if (!fs.existsSync(STATS_FILE)) {
      return NextResponse.json({
        totalViews: 0,
        blogViews: {}
      });
    }

    const statsData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));

    if (action === 'view' && blogSlug) {
      statsData.totalViews = (statsData.totalViews || 0) + 1;
      statsData.blogViews[blogSlug] = (statsData.blogViews[blogSlug] || 0) + 1;
      statsData.lastUpdated = new Date().toISOString();

      fs.writeFileSync(STATS_FILE, JSON.stringify(statsData, null, 2));

      return NextResponse.json({
        success: true,
        views: statsData.blogViews[blogSlug]
      });
    }

    return NextResponse.json(statsData);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
