import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // For demo purposes - just return success
  // In production, you would clear session or invalidate token
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}
