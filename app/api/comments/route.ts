import { NextRequest, NextResponse } from 'next/server';
import { getComments, getCommentsByBlogId, createComment, updateComment, deleteComment } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl);
    const blogId = searchParams.get('blogId');

    if (blogId) {
      const comments = await getCommentsByBlogId(blogId);
      return NextResponse.json(comments);
    }

    const comments = await getComments();
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('Comments GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== COMMENTS POST CALLED ===');
    const newComment = await request.json();
    console.log('Received comment data:', JSON.stringify(newComment, null, 2));

    const createdComment = await createComment(newComment);
    console.log('Created comment result:', createdComment);

    return NextResponse.json({ success: true, comment: createdComment });
  } catch (error: any) {
    console.error('=== COMMENTS POST ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedComment = await request.json();

    const updated = await updateComment(updatedComment.id, updatedComment);

    return NextResponse.json({ success: true, comment: updated });
  } catch (error: any) {
    console.error('Comments PUT error:', error);
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

    console.log('DELETE comment request - ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }

    await deleteComment(id);

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Comments DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
