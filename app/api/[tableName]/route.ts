import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo purposes
const mockData: Record<string, any[]> = {
  'app_users': [
    { id: 1, name: 'Admin User', email: 'admin@bengkel.com', role: 'admin', created_at: '2024-01-01' },
    { id: 2, name: 'Demo User', email: 'demo@bengkel.com', role: 'user', created_at: '2024-01-02' }
  ],
  'mechanics': [
    { id: 1, name: 'Ahmad Budi', specialization: 'Engine', phone: '08123456789', created_at: '2024-01-01' },
    { id: 2, name: 'Siti Aminah', specialization: 'Electrical', phone: '08123456790', created_at: '2024-01-02' }
  ],
  'goods': [
    { id: 1, name: 'Oli Mesin', code: 'OLI001', price: 50000, stock: 100, created_at: '2024-01-01' },
    { id: 2, name: 'Filter Udara', code: 'FLT001', price: 25000, stock: 50, created_at: '2024-01-02' }
  ]
}

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    // Return mock data atau empty array
    const data = mockData[tableName] || []
    
    return NextResponse.json(data)
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
    
    // Mock create - return the data with ID
    const newItem = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json([newItem])
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
    
    // Mock delete - just return success
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
