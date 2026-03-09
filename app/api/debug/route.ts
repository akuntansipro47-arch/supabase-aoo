import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const debug = {
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      supabaseKeyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    }
    
    return NextResponse.json(debug)
  } catch (err) {
    return NextResponse.json({ 
      error: (err as Error).message 
    }, { status: 500 })
  }
}
