import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('=== REVALIDATE SITEMAP CALLED ===');

    revalidatePath('/sitemap.xml');

    console.log('Sitemap revalidated successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap güncellendi' 
    });
  } catch (error: any) {
    console.error('Revalidate error:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: 'Revalidation failed', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

