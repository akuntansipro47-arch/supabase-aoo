import { NextRequest, NextResponse } from 'next/server'

// Mock schema untuk demo purposes
const mockSchemas: Record<string, any[]> = {
  'app_users': [
    { name: 'id', type: 'integer', required: true, label: 'ID' },
    { name: 'name', type: 'text', required: true, label: 'Name' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'role', type: 'text', required: true, label: 'Role' },
    { name: 'created_at', type: 'datetime', required: true, label: 'Created At' }
  ],
  'mechanics': [
    { name: 'id', type: 'integer', required: true, label: 'ID' },
    { name: 'name', type: 'text', required: true, label: 'Name' },
    { name: 'specialization', type: 'text', required: true, label: 'Specialization' },
    { name: 'phone', type: 'text', required: false, label: 'Phone' },
    { name: 'created_at', type: 'datetime', required: true, label: 'Created At' }
  ],
  'goods': [
    { name: 'id', type: 'integer', required: true, label: 'ID' },
    { name: 'name', type: 'text', required: true, label: 'Name' },
    { name: 'code', type: 'text', required: true, label: 'Code' },
    { name: 'price', type: 'decimal', required: true, label: 'Price' },
    { name: 'stock', type: 'integer', required: true, label: 'Stock' },
    { name: 'created_at', type: 'datetime', required: true, label: 'Created At' }
  ]
}

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    // Return mock schema atau default schema
    const columns = mockSchemas[tableName] || [
      { name: 'id', type: 'integer', required: true, label: 'ID' },
      { name: 'name', type: 'text', required: true, label: 'Name' },
      { name: 'created_at', type: 'datetime', required: true, label: 'Created At' }
    ]
    
    return NextResponse.json({ columns })
  } catch (err) {
    console.error('Error fetching schema:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
