import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Environment variables not configured' },
      { status: 500 }
    )
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Get all tables information
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'schema_migrations')
      .order('table_name')
    
    if (error) {
      // Fallback to hardcoded tables if information_schema not accessible
      const fallbackTables = [
        { table_name: 'app_users', label: 'Pengguna', icon: '👥', description: 'Manajemen pengguna sistem' },
        { table_name: 'company_profile', label: 'Profil Perusahaan', icon: '🏢', description: 'Informasi perusahaan' },
        { table_name: 'mechanics', label: 'Mekanik', icon: '🔧', description: 'Data mekanik bengkel' },
        { table_name: 'job_types', label: 'Jenis Pekerjaan', icon: '🛠️', description: 'Kategori pekerjaan bengkel' },
        { table_name: 'goods', label: 'Barang/Sparepart', icon: '📦', description: 'Stok barang dan sparepart' },
        { table_name: 'chart_of_accounts', label: 'Akun', icon: '📊', description: 'Struktur akun keuangan' },
        { table_name: 'periods', label: 'Periode', icon: '📅', description: 'Periode akuntansi' },
        { table_name: 'budget_periods', label: 'Periode Anggaran', icon: '💰', description: 'Periode anggaran tahunan' },
        { table_name: 'budget_allocations', label: 'Alokasi Anggaran', icon: '💸', description: 'Alokasi dana per departemen' },
        { table_name: 'goods_receipts', label: 'Penerimaan Barang', icon: '📥', description: 'Transaksi penerimaan barang' },
        { table_name: 'goods_receipt_items', label: 'Item Penerimaan', icon: '📋', description: 'Detail item penerimaan barang' },
        { table_name: 'goods_issues', label: 'Pengeluaran Barang', icon: '📤', description: 'Transaksi pengeluaran barang' },
        { table_name: 'goods_issue_items', label: 'Item Pengeluaran', icon: '📝', description: 'Detail item pengeluaran barang' },
        { table_name: 'purchase_orders', label: 'Purchase Order', icon: '🛒', description: 'Order pembelian barang' },
        { table_name: 'purchase_order_items', label: 'Item Purchase Order', icon: '📄', description: 'Detail item purchase order' },
        { table_name: 'purchase_invoices', label: 'Invoice Pembelian', icon: '🧾', description: 'Invoice pembelian supplier' },
        { table_name: 'cash_bank_transactions', label: 'Transaksi Kas/Bank', icon: '💳', description: 'Transaksi keuangan kas dan bank' }
      ]
      
      return NextResponse.json(fallbackTables)
    }
    
    // Enhance table information with metadata
    const enhancedTables = tables?.map(table => {
      const tableName = table.table_name
      let label, icon, description, category
      
      switch(tableName) {
        case 'app_users':
          label = 'Pengguna'
          icon = '👥'
          description = 'Manajemen pengguna sistem'
          category = 'Master Data'
          break
        case 'company_profile':
          label = 'Profil Perusahaan'
          icon = '🏢'
          description = 'Informasi perusahaan'
          category = 'Master Data'
          break
        case 'mechanics':
          label = 'Mekanik'
          icon = '🔧'
          description = 'Data mekanik bengkel'
          category = 'Master Data'
          break
        case 'job_types':
          label = 'Jenis Pekerjaan'
          icon = '🛠️'
          description = 'Kategori pekerjaan bengkel'
          category = 'Master Data'
          break
        case 'goods':
          label = 'Barang/Sparepart'
          icon = '📦'
          description = 'Stok barang dan sparepart'
          category = 'Inventory'
          break
        case 'chart_of_accounts':
          label = 'Akun'
          icon = '📊'
          description = 'Struktur akun keuangan'
          category = 'Accounting'
          break
        case 'periods':
          label = 'Periode'
          icon = '📅'
          description = 'Periode akuntansi'
          category = 'Accounting'
          break
        case 'budget_periods':
          label = 'Periode Anggaran'
          icon = '💰'
          description = 'Periode anggaran tahunan'
          category = 'Accounting'
          break
        case 'budget_allocations':
          label = 'Alokasi Anggaran'
          icon = '💸'
          description = 'Alokasi dana per departemen'
          category = 'Accounting'
          break
        case 'goods_receipts':
          label = 'Penerimaan Barang'
          icon = '📥'
          description = 'Transaksi penerimaan barang'
          category = 'Inventory'
          break
        case 'goods_receipt_items':
          label = 'Item Penerimaan'
          icon = '📋'
          description = 'Detail item penerimaan barang'
          category = 'Inventory'
          break
        case 'goods_issues':
          label = 'Pengeluaran Barang'
          icon = '📤'
          description = 'Transaksi pengeluaran barang'
          category = 'Inventory'
          break
        case 'goods_issue_items':
          label = 'Item Pengeluaran'
          icon = '📝'
          description = 'Detail item pengeluaran barang'
          category = 'Inventory'
          break
        case 'purchase_orders':
          label = 'Purchase Order'
          icon = '🛒'
          description = 'Order pembelian barang'
          category = 'Purchasing'
          break
        case 'purchase_order_items':
          label = 'Item Purchase Order'
          icon = '📄'
          description = 'Detail item purchase order'
          category = 'Purchasing'
          break
        case 'purchase_invoices':
          label = 'Invoice Pembelian'
          icon = '🧾'
          description = 'Invoice pembelian supplier'
          category = 'Purchasing'
          break
        case 'cash_bank_transactions':
          label = 'Transaksi Kas/Bank'
          icon = '💳'
          description = 'Transaksi keuangan kas dan bank'
          category = 'Accounting'
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
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    )
  }
}
