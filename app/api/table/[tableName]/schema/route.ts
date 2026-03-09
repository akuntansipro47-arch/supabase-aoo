import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    // Return default schema for all tables
    const defaultColumns = [
      { name: 'id', type: 'integer', required: true, label: 'ID' },
      { name: 'name', type: 'text', required: true, label: 'Name' },
      { name: 'created_at', type: 'datetime', required: true, label: 'Created At' }
    ]
    
    return NextResponse.json({ columns: defaultColumns })
  } catch (err) {
    console.error('Error fetching schema:', err)
    return NextResponse.json(
      { error: 'Failed to fetch schema' },
      { status: 500 }
    )
  }
}
