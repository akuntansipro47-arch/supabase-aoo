import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For demo purposes - accept demo credentials
    if (email === 'demo@bengkel.com' && password === 'demo123') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'demo-user',
          email: 'demo@bengkel.com',
          name: 'Demo User',
          role: 'admin'
        },
        message: 'Login successful'
      })
    }
    
    // For now, only accept demo credentials
    return NextResponse.json(
      { error: 'Invalid credentials. Use demo@bengkel.com / demo123' },
      { status: 401 }
    )
    
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
