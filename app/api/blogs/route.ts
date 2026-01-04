import { NextRequest, NextResponse } from 'next/server';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Blogs GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== API BLOGS POST CALLED ===');
    const newBlog = await request.json();
    console.log('Received blog data:', JSON.stringify(newBlog, null, 2));
    console.log('Blog ID:', newBlog.id);
    console.log('Blog title:', newBlog.title);
    console.log('Blog keys:', Object.keys(newBlog));

    const createdBlog = await createBlog(newBlog);
    console.log('Created blog result:', JSON.stringify(createdBlog, null, 2));

    return NextResponse.json({ success: true, blog: createdBlog });
  } catch (error: any) {
    console.error('=== BLOGS POST ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedBlog = await request.json();

    const updated = await updateBlog(updatedBlog.id, updatedBlog);

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    console.error('Blogs PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const id = searchParams.get('id');

    console.log('DELETE request - ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    await deleteBlog(id);

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Blogs DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
