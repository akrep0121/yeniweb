import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    console.log('=== MESSAGES GET CALLED ===');
    
    const messagesRef = collection(db, 'messages');
    const querySnapshot = await getDocs(messagesRef);
    const messages: any[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Loaded messages:', messages.length);
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Messages GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== MESSAGES POST CALLED ===');
    const newMessage = await request.json();
    console.log('Received message data:', JSON.stringify(newMessage, null, 2));

    const cleanedMessage: any = {};
    Object.keys(newMessage).forEach(key => {
      if (newMessage[key] !== undefined && newMessage[key] !== null && newMessage[key] !== '') {
        cleanedMessage[key] = newMessage[key];
      }
    });

    cleanedMessage.createdAt = new Date().toISOString();
    cleanedMessage.read = false;

    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, cleanedMessage);
    
    console.log('=== FIREBASE MESSAGE CREATED ===');
    console.log('Message ID:', docRef.id);

    return NextResponse.json({ success: true, message: { id: docRef.id, ...cleanedMessage } });
  } catch (error: any) {
    console.error('=== MESSAGES POST ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedMessage = await request.json();

    const messageRef = doc(db, 'messages', updatedMessage.id);
    await updateDoc(messageRef, updatedMessage);

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error: any) {
    console.error('Messages PUT error:', error);
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

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const messageRef = doc(db, 'messages', id);
    await deleteDoc(messageRef);

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error: any) {
    console.error('Messages DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
