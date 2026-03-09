import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const supabase = createSupabaseClient()
    
    // Get sample data to infer schema
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Supabase error:', error)
      // Return default schema if table doesn't exist
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        return NextResponse.json({
          columns: [
            { name: 'id', type: 'integer', required: true, label: 'ID' },
            { name: 'name', type: 'text', required: true, label: 'Name' },
            { name: 'created_at', type: 'datetime', required: true, label: 'Created At' },
            { name: 'updated_at', type: 'datetime', required: false, label: 'Updated At' }
          ]
        })
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      // Return default schema if no data
      return NextResponse.json({
        columns: [
          { name: 'id', type: 'integer', required: true, label: 'ID' },
          { name: 'name', type: 'text', required: true, label: 'Name' },
          { name: 'created_at', type: 'datetime', required: true, label: 'Created At' },
          { name: 'updated_at', type: 'datetime', required: false, label: 'Updated At' }
        ]
      })
    }
    
    // Infer schema from data
    const sampleRow = data[0]
    const columns = Object.keys(sampleRow).map(key => {
      const value = sampleRow[key]
      let type = 'text'
      let required = false
      let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      // Infer type from value
      if (value === null || value === undefined) {
        type = 'text'
      } else if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'integer' : 'decimal'
      } else if (typeof value === 'boolean') {
        type = 'boolean'
      } else if (value instanceof Date || (typeof value === 'string' && value.includes('T'))) {
        type = 'datetime'
      } else if (typeof value === 'string') {
        if (value.includes('@')) {
          type = 'email'
        } else if (value.includes('http')) {
          type = 'url'
        } else if (value.length > 200) {
          type = 'textarea'
        } else {
          type = 'text'
        }
      }
      
      // Determine if field is required
      if (key === 'id' || key.includes('_id') || key === 'name' || key === 'email') {
        required = true
      }
      
      return {
        name: key,
        type,
        required,
        label
      }
    })
    
    return NextResponse.json({ columns })
    
  } catch (err) {
    console.error('Error fetching schema:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
