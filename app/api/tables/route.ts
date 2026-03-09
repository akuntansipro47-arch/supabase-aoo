import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      // Return hardcoded tables for bengkel system
      const tables = [
        // Database Master
        { table_name: 'kendaraan', label: 'Data Kendaraan', icon: '🚗', description: 'Data kendaraan pelanggan', category: 'Database Master' },
        { table_name: 'mekanik', label: 'Nama Mekanik', icon: '�‍�🔧', description: 'Data mekanik bengkel', category: 'Database Master' },
        { table_name: 'supplier', label: 'Supplier', icon: '�', description: 'Data supplier barang', category: 'Database Master' },
        { table_name: 'barang_jasa', label: 'Barang/Jasa', icon: '�', description: 'Data barang dan jasa service', category: 'Database Master' },
        { table_name: 'pekerjaan_service', label: 'Pekerjaan/Jasa Service', icon: '⚙️', description: 'Data pekerjaan service', category: 'Database Master' },
        { table_name: 'profile_perusahaan', label: 'Profile Perusahaan', icon: '🏢', description: 'Profil perusahaan/bengkel', category: 'Database Master' },
        
        // Transaksi
        { table_name: 'kendaraan_masuk', label: 'Entry Kendaraan Masuk', icon: '�', description: 'Penerimaan kendaraan masuk', category: 'Transaksi' },
        { table_name: 'work_order', label: 'Work Order (WO)', icon: '�', description: 'Data Work Order', category: 'Transaksi' },
        { table_name: 'purchase_order', label: 'Purchasing (PO)', icon: '�', description: 'Purchase Order barang', category: 'Transaksi' },
        { table_name: 'estimasi', label: 'Estimasi', icon: '�', description: 'Data estimasi service', category: 'Transaksi' }
      ]
      
      return NextResponse.json(tables)
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try to get actual tables from Supabase
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations')
      .order('table_name')
    
    if (error) {
      console.error('Supabase error:', error)
      // Return hardcoded bengkel tables
      const fallbackTables = [
        // Database Master
        { table_name: 'kendaraan', label: 'Data Kendaraan', icon: '🚗', description: 'Data kendaraan pelanggan', category: 'Database Master' },
        { table_name: 'mekanik', label: 'Nama Mekanik', icon: '👨‍🔧', description: 'Data mekanik bengkel', category: 'Database Master' },
        { table_name: 'supplier', label: 'Supplier', icon: '�', description: 'Data supplier barang', category: 'Database Master' },
        { table_name: 'barang_jasa', label: 'Barang/Jasa', icon: '�', description: 'Data barang dan jasa service', category: 'Database Master' },
        { table_name: 'pekerjaan_service', label: 'Pekerjaan/Jasa Service', icon: '⚙️', description: 'Data pekerjaan service', category: 'Database Master' },
        { table_name: 'profile_perusahaan', label: 'Profile Perusahaan', icon: '🏢', description: 'Profil perusahaan/bengkel', category: 'Database Master' },
        
        // Transaksi
        { table_name: 'kendaraan_masuk', label: 'Entry Kendaraan Masuk', icon: '�', description: 'Penerimaan kendaraan masuk', category: 'Transaksi' },
        { table_name: 'work_order', label: 'Work Order (WO)', icon: '�', description: 'Data Work Order', category: 'Transaksi' },
        { table_name: 'purchase_order', label: 'Purchasing (PO)', icon: '�', description: 'Purchase Order barang', category: 'Transaksi' },
        { table_name: 'estimasi', label: 'Estimasi', icon: '📝', description: 'Data estimasi service', category: 'Transaksi' }
      ]
      
      return NextResponse.json(fallbackTables)
    }
    
    // Enhance table information with metadata
    const enhancedTables = tables?.map(table => {
      const tableName = table.table_name
      let label, icon, description, category
      
      switch(tableName) {
        case 'kendaraan':
          label = 'Data Kendaraan'
          icon = '�'
          description = 'Data kendaraan pelanggan'
          category = 'Database Master'
          break
        case 'mekanik':
          label = 'Nama Mekanik'
          icon = '�‍�🔧'
          description = 'Data mekanik bengkel'
          category = 'Database Master'
          break
        case 'supplier':
          label = 'Supplier'
          icon = '�'
          description = 'Data supplier barang'
          category = 'Database Master'
          break
        case 'barang_jasa':
          label = 'Barang/Jasa'
          icon = '�'
          description = 'Data barang dan jasa service'
          category = 'Database Master'
          break
        case 'pekerjaan_service':
          label = 'Pekerjaan/Jasa Service'
          icon = '⚙️'
          description = 'Data pekerjaan service'
          category = 'Database Master'
          break
        case 'profile_perusahaan':
          label = 'Profile Perusahaan'
          icon = '🏢'
          description = 'Profil perusahaan/bengkel'
          category = 'Database Master'
          break
        case 'kendaraan_masuk':
          label = 'Entry Kendaraan Masuk'
          icon = '�'
          description = 'Penerimaan kendaraan masuk'
          category = 'Transaksi'
          break
        case 'work_order':
          label = 'Work Order (WO)'
          icon = '�'
          description = 'Data Work Order'
          category = 'Transaksi'
          break
        case 'purchase_order':
          label = 'Purchasing (PO)'
          icon = '�'
          description = 'Purchase Order barang'
          category = 'Transaksi'
          break
        case 'estimasi':
          label = 'Estimasi'
          icon = '�'
          description = 'Data estimasi service'
          category = 'Transaksi'
          break
        default:
          label = tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          icon = '📋'
          description = `Data ${label}`
          category = 'Other'
      }
      
      return {
        table_name: tableName,
        label,
        icon,
        description,
        category
      }
    }) || []
    
    return NextResponse.json(enhancedTables)
    
  } catch (err) {
    console.error('Error fetching tables:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
