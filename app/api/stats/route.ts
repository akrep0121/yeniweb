import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('slug');
    const action = searchParams.get('action');

    console.log('=== STATS GET CALLED ===');
    console.log('Slug:', blogSlug);
    console.log('Action:', action);

    if (action === 'view' && blogSlug) {
      try {
        const statsRef = doc(db, 'stats', 'global');
        const statsDoc = await getDoc(statsRef);

        if (!statsDoc.exists()) {
          const newStats = {
            totalViews: 1,
            blogViews: { [blogSlug]: 1 },
            lastUpdated: new Date().toISOString()
          };
          await setDoc(statsRef, newStats);
          console.log('New stats created:', newStats);
          return NextResponse.json({
            success: true,
            views: 1,
            totalViews: 1
          });
        }

        const currentStats = statsDoc.data();
        const newTotalViews = (currentStats?.totalViews || 0) + 1;
        const blogViews = currentStats?.blogViews || {};
        const newBlogViews = (blogViews[blogSlug] || 0) + 1;

        await updateDoc(statsRef, {
          totalViews: newTotalViews,
          [`blogViews.${blogSlug}`]: newBlogViews,
          lastUpdated: new Date().toISOString()
        });

        console.log('Stats updated:', { totalViews: newTotalViews, blogSlug, blogViews: newBlogViews });
        return NextResponse.json({
          success: true,
          views: newBlogViews,
          totalViews: newTotalViews
        });
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        return NextResponse.json(
          { error: 'Firestore error' },
          { status: 500 }
        );
      }
    }

    try {
      const statsRef = doc(db, 'stats', 'global');
      const statsDoc = await getDoc(statsRef);

      if (!statsDoc.exists()) {
        return NextResponse.json({
          totalViews: 0,
          blogViews: {}
        });
      }

      const statsData = statsDoc.data();
      console.log('Stats fetched:', statsData);
      return NextResponse.json(statsData);
    } catch (error) {
      console.error('Stats fetch error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

