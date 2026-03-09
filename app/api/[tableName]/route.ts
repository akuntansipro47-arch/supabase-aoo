import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey,
      tableName 
    })
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json({ 
        error: 'Database tidak dikonfigurasi. Silakan tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di environment variables.' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log(`Fetching data from table: ${tableName}`)
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(100)
    
    if (error) {
      console.error('Supabase error:', error)
      
      // Check specific error types
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        return NextResponse.json({ 
          error: `Table '${tableName}' tidak ditemukan di database. Silakan buat table terlebih dahulu.` 
        }, { status: 404 })
      }
      
      if (error.message.includes('permission')) {
        return NextResponse.json({ 
          error: `Tidak memiliki akses ke table '${tableName}'. Silakan cek permission di Supabase.` 
        }, { status: 403 })
      }
      
      return NextResponse.json({ 
        error: `Database error: ${error.message}` 
      }, { status: 500 })
    }
    
    console.log(`Successfully fetched ${data?.length || 0} rows from ${tableName}`)
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ 
      error: `Server error: ${(err as Error).message}` 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const body = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Database tidak dikonfigurasi' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log(`Inserting data into table: ${tableName}`, body)
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([body])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Gagal menyimpan data: ${error.message}` 
      }, { status: 500 })
    }
    
    console.log(`Successfully inserted data into ${tableName}`)
    return NextResponse.json(data)
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ 
      error: `Server error: ${(err as Error).message}` 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ 
        error: 'ID diperlukan untuk menghapus data' 
      }, { status: 400 })
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        error: 'Database tidak dikonfigurasi' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log(`Deleting row with ID ${id} from table: ${tableName}`)
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Gagal menghapus data: ${error.message}` 
      }, { status: 500 })
    }
    
    console.log(`Successfully deleted row with ID ${id} from ${tableName}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ 
      error: `Server error: ${(err as Error).message}` 
    }, { status: 500 })
  }
}
