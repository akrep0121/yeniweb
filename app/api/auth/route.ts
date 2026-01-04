import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

export async function GET(request: NextRequest) {
  try {
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    const token = await user.getIdToken();

    return NextResponse.json({ authenticated: true, user: { email: user.email } });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);

    const user = userCredential.user;
    const token = await user.getIdToken();

    return NextResponse.json({ success: true, token, user: { email: user.email } });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed', message: error.message });
  }
}
