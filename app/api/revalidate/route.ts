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
  } catch (error) {
    console.error('Revalidate error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
