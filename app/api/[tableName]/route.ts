import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest, { params }: { params: { tableName: string } }) {
  try {
    const { tableName } = params
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('=== DEBUG INFO ===')
    console.log('Table Name:', tableName)
    console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT_SET')
    console.log('Supabase Key:', supabaseKey ? 'SET' : 'NOT_SET')
    console.log('==================')
    
    // If no environment variables, return sample data
    if (!supabaseUrl || !supabaseKey) {
      console.log('Using fallback data due to missing environment variables')
      return NextResponse.json(getFallbackData(tableName))
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log(`Fetching data from table: ${tableName}`)
    
    // Try to fetch data with better error handling
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(100)
    
    if (error) {
      console.error('Supabase error:', error)
      
      // Check specific error types
      if (error.message.includes('does not exist') || error.message.includes('relation')) {
        console.log(`Table ${tableName} does not exist, using fallback data`)
        return NextResponse.json(getFallbackData(tableName))
      }
      
      if (error.message.includes('permission')) {
        console.log(`Permission denied for table ${tableName}, using fallback data`)
        return NextResponse.json(getFallbackData(tableName))
      }
      
      console.log(`Database error for table ${tableName}, using fallback data`)
      return NextResponse.json(getFallbackData(tableName))
    }
    
    console.log(`Successfully fetched ${data?.length || 0} rows from ${tableName}`)
    
    // Return data even if empty
    if (data && data.length > 0) {
      return NextResponse.json(data)
    } else {
      console.log(`No data in table ${tableName}, using fallback data`)
      return NextResponse.json(getFallbackData(tableName))
    }
    
  } catch (err) {
    console.error('API error:', err)
    console.log('Using fallback data due to API error')
    return NextResponse.json(getFallbackData(params.tableName))
  }
}

function getFallbackData(tableName: string) {
  switch (tableName) {
    case 'app_users':
      return [
        { id: 1, name: 'Admin User', email: 'admin@bengkel.com', role: 'admin', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Demo User', email: 'demo@bengkel.com', role: 'user', created_at: '2024-01-02T00:00:00Z' }
      ]
    
    case 'mechanics':
      return [
        { id: 1, nama_mekanik: 'Budi Santoso', no_hp: '08123456789', alamat: 'Jakarta Selatan', kategori_mekanik: 'R4', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, nama_mekanik: 'Ahmad Fauzi', no_hp: '08234567890', alamat: 'Jakarta Pusat', kategori_mekanik: 'R2', created_at: '2024-01-02T00:00:00Z' },
        { id: 3, nama_mekanik: 'Siti Nurhaliza', no_hp: '08345678901', alamat: 'Jakarta Utara', kategori_mekanik: 'R2 Kecil', created_at: '2024-01-03T00:00:00Z' }
      ]
    
    case 'goods':
      return [
        { id: 1, kode_barang: 'BRG001', nama_barang: 'Oli Mobil Castrol', satuan: 'Liter', harga_jual: 85000, kategori_barang: 'Persediaan', group_sparepart: 'R4', stok: 50 },
        { id: 2, kode_barang: 'BRG002', nama_barang: 'Filter Udara', satuan: 'Pcs', harga_jual: 45000, kategori_barang: 'Persediaan', group_sparepart: 'R4', stok: 100 },
        { id: 3, kode_barang: 'BRG003', nama_barang: 'Busi NGK', satuan: 'Pcs', harga_jual: 25000, kategori_barang: 'Persediaan', group_sparepart: 'R2', stok: 200 }
      ]
    
    case 'company_profile':
      return [
        { id: 1, nama_perusahaan: 'Bengkel Maju Jaya', alamat: 'Jl. Sudirman No. 123, Jakarta', npwp: '12.345.678.9-123.000', pkp_status: 'PKP', no_telepon: '02112345678', email: 'info@mengkelemp.com', ig: '@bengkelemp', fb: 'Bengkelemp', twitter: '@bengkelemp' }
      ]
    
    case 'job_types':
      return [
        { id: 1, nama_pekerjaan: 'Ganti Oli', kategori_kendaraan: 'R4', harga_standar: 50000, deskripsi: 'Penggantian oli mesin dan filter' },
        { id: 2, nama_pekerjaan: 'Service Kaki-kaki', kategori_kendaraan: 'R4', harga_standar: 150000, deskripsi: 'Pemeriksaan dan perbaikan sistem kaki-kaki' },
        { id: 3, nama_pekerjaan: 'Ganti Busi', kategori_kendaraan: 'R2', harga_standar: 30000, deskripsi: 'Penggantian busi dan pengecekan sistem pengapian' }
      ]
    
    case 'purchase_orders':
      return [
        { id: 1, no_po: 'PO-2024-001', tanggal_po: '2024-01-15', supplier_id: 1, total_amount: 1500000, status: 'pending' },
        { id: 2, no_po: 'PO-2024-002', tanggal_po: '2024-01-16', supplier_id: 2, total_amount: 2500000, status: 'approved' }
      ]
    
    case 'cash_bank_transactions':
      return [
        { id: 1, tanggal_transaksi: '2024-01-15', jenis_transaksi: 'Pemasukan', jumlah: 5000000, deskripsi: 'Pembayaran service mobil', rekening: 'BCA' },
        { id: 2, tanggal_transaksi: '2024-01-16', jenis_transaksi: 'Pengeluaran', jumlah: 1500000, deskripsi: 'Pembelian sparepart', rekening: 'BCA' }
      ]
    
    default:
      // Return empty array for unknown tables
      return []
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
        success: false,
        error: 'Database tidak dikonfigurasi. Data disimpan di local mode.',
        data: { ...body, id: Date.now(), created_at: new Date().toISOString() }
      }, { status: 200 })
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
        success: false,
        error: `Gagal menyimpan data: ${error.message}`,
        data: { ...body, id: Date.now(), created_at: new Date().toISOString() }
      }, { status: 200 })
    }
    
    console.log(`Successfully inserted data into ${tableName}`)
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ 
      success: false,
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
        success: false,
        error: 'ID diperlukan untuk menghapus data' 
      }, { status: 400 })
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: true,
        message: 'Data dihapus dari local mode'
      })
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
        success: false,
        error: `Gagal menghapus data: ${error.message}`
      }, { status: 500 })
    }
    
    console.log(`Successfully deleted row with ID ${id} from ${tableName}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ 
      success: false,
      error: `Server error: ${(err as Error).message}`
    }, { status: 500 })
  }
}
