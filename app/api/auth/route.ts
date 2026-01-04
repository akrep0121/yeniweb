import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    console.log('Environment check - ADMIN_PASSWORD exists:', !!adminPassword);
    console.log('Environment check - JWT_SECRET exists:', !!jwtSecret);

    if (!adminPassword || !jwtSecret) {
      return NextResponse.json(
        { error: 'Server configuration error', debug: { hasPassword: !!adminPassword, hasSecret: !!jwtSecret } },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      const token = jwt.sign(
        { isAdmin: true, timestamp: Date.now() },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return NextResponse.json({ success: true, token, authenticated: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password', authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error', authenticated: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const jwtSecret = process.env.JWT_SECRET;

    console.log('GET auth - Token exists:', !!token);
    console.log('GET auth - JWT_SECRET exists:', !!jwtSecret);

    if (!token || !jwtSecret) {
      return NextResponse.json({ authenticated: false, error: 'No token or secret' }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      console.log('Token decoded successfully:', decoded);
      return NextResponse.json({ authenticated: true, isAdmin: decoded.isAdmin });
    } catch (err: any) {
      console.log('Token verification failed:', err.message);
      return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('GET auth error:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}
