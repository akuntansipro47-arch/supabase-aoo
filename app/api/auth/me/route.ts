import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // For demo purposes - return demo user
  // In production, you would verify JWT token or session
  return NextResponse.json({
    success: true,
    user: {
      id: 'demo-user',
      email: 'demo@bengkel.com',
      name: 'Demo User',
      role: 'admin'
    }
  })
}
