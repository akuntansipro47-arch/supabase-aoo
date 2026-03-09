import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(100)
    
    if (error) {
      console.error('Supabase error:', error)
      // Return empty array if table doesn't exist or has no data
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        return NextResponse.json([])
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const body = await request.json()
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([body])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createSupabaseClient()
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
