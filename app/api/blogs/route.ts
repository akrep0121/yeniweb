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
    const newBlog = await request.json();

    const createdBlog = await createBlog(newBlog);

    return NextResponse.json({ success: true, blog: createdBlog });
  } catch (error: any) {
    console.error('Blogs POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
