import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        prefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...' || ''
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
        prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50) + '...' || ''
      }
    }

    const allSet = envVars.NEXT_PUBLIC_SUPABASE_URL.set && envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.set

    return NextResponse.json({
      success: allSet,
      message: allSet ? 'Environment variables are properly configured' : 'Environment variables are missing',
      environment: process.env.NODE_ENV,
      variables: envVars,
      instructions: !allSet ? {
        step1: "Go to Vercel Dashboard → Your Project → Settings → Environment Variables",
        step2: "Add these variables:",
        variables: [
          {
            name: "NEXT_PUBLIC_SUPABASE_URL",
            value: "https://efkkdeoheekcxwirungu.supabase.co",
            description: "Your Supabase project URL"
          },
          {
            name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
            value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            description: "Your Supabase anonymous key (full key needed)"
          }
        ],
        step3: "Redeploy your application after adding variables"
      } : null
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: (err as Error).message
    })
  }
}
