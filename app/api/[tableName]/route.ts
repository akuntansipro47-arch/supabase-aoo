import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    // Return empty array for all tables
    return NextResponse.json([])
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    const body = await request.json()
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: `Data berhasil ditambahkan ke ${tableName}`,
      data: { id: Date.now(), ...body }
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Failed to save data' },
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
    
    // Return success message
    return NextResponse.json({
      success: true,
      message: `Data berhasil dihapus dari ${tableName}`
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    )
  }
}
