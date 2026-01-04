import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getBlogs, syncToKV } from '@/lib/kv';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

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

    const blogs = await getBlogs();
    const updatedBlogs = [...blogs, newBlog];

    await syncToKV(updatedBlogs);

    return NextResponse.json({ success: true, blog: newBlog });
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

    const blogs = await getBlogs();
    const index = blogs.findIndex((blog: any) => blog.id === updatedBlog.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blogs[index] = updatedBlog;

    await syncToKV(blogs);

    return NextResponse.json({ success: true, blog: updatedBlog });
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

    const blogs = await getBlogs();
    const filteredBlogs = blogs.filter((blog: any) => String(blog.id) !== id);
    console.log('After delete blogs count:', filteredBlogs.length);

    await syncToKV(filteredBlogs);

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('Blogs DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
