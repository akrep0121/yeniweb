import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(BLOGS_FILE)) {
      return NextResponse.json([]);
    }

    const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
    return NextResponse.json(blogsData);
  } catch (error) {
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

    if (!fs.existsSync(BLOGS_FILE)) {
      const initialData = [newBlog];
      fs.writeFileSync(BLOGS_FILE, JSON.stringify(initialData, null, 2));
      return NextResponse.json({ success: true, blog: newBlog });
    }

    const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
    const updatedBlogs = [...blogsData, newBlog];
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(updatedBlogs, null, 2));

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
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

    if (!fs.existsSync(BLOGS_FILE)) {
      return NextResponse.json(
        { error: 'Blogs file not found' },
        { status: 404 }
      );
    }

    const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
    const index = blogsData.findIndex((blog: any) => blog.id === updatedBlog.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    blogsData[index] = updatedBlog;
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogsData, null, 2));

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Blogs PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(BLOGS_FILE)) {
      return NextResponse.json(
        { error: 'Blogs file not found' },
        { status: 404 }
      );
    }

    const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
    const filteredBlogs = blogsData.filter((blog: any) => blog.id !== parseInt(id));

    fs.writeFileSync(BLOGS_FILE, JSON.stringify(filteredBlogs, null, 2));

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Blogs DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
