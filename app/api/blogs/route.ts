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
    console.log('=== API BLOGS DELETE CALLED ===');
    const { searchParams } = new URL(request.nextUrl);
    const id = searchParams.get('id');

    console.log('URL:', request.nextUrl);
    console.log('URL searchParams:', searchParams.toString());
    console.log('DELETE request - ID:', id);
    console.log('ID type:', typeof id);
    console.log('ID length:', id?.length);
    console.log('ID value:', id ? `"${id}"` : 'undefined');

    if (!id) {
      console.error('Blog ID is missing or empty');
      return NextResponse.json(
        { error: 'Blog ID is required', debug: { url: request.nextUrl, id } },
        { status: 400 }
      );
    }

    console.log('Calling deleteBlog function with ID:', id);
    const result = await deleteBlog(id);
    console.log('deleteBlog result:', result);

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error: any) {
    console.error('=== BLOGS DELETE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message, code: error.code },
      { status: 500 }
    );
  }
}
