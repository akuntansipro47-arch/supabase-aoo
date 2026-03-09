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
        { table_name: 'app_users', label: 'Pengguna', icon: '�', description: 'Manajemen pengguna sistem', category: 'Database Master' },
        { table_name: 'mechanics', label: 'Mekanik', icon: '👨‍🔧', description: 'Data mekanik bengkel', category: 'Database Master' },
        { table_name: 'goods', label: 'Barang/Sparepart', icon: '📦', description: 'Stok barang dan sparepart', category: 'Database Master' },
        { table_name: 'company_profile', label: 'Profil Perusahaan', icon: '🏢', description: 'Informasi perusahaan', category: 'Database Master' },
        { table_name: 'job_types', label: 'Jenis Pekerjaan', icon: '🛠️', description: 'Kategori pekerjaan bengkel', category: 'Database Master' },
        { table_name: 'chart_of_accounts', label: 'Akun', icon: '📊', description: 'Struktur akun keuangan', category: 'Database Master' },
        { table_name: 'periods', label: 'Periode', icon: '📅', description: 'Periode akuntansi', category: 'Database Master' },
        { table_name: 'budget_periods', label: 'Periode Anggaran', icon: '💰', description: 'Periode anggaran tahunan', category: 'Database Master' },
        { table_name: 'budget_allocations', label: 'Alokasi Anggaran', icon: '💸', description: 'Alokasi dana per departemen', category: 'Database Master' },
        
        // Transaksi
        { table_name: 'goods_receipts', label: 'Penerimaan Barang', icon: '📥', description: 'Transaksi penerimaan barang', category: 'Transaksi' },
        { table_name: 'goods_receipt_items', label: 'Item Penerimaan', icon: '📋', description: 'Detail item penerimaan barang', category: 'Transaksi' },
        { table_name: 'goods_issues', label: 'Pengeluaran Barang', icon: '📤', description: 'Transaksi pengeluaran barang', category: 'Transaksi' },
        { table_name: 'goods_issue_items', label: 'Item Pengeluaran', icon: '📝', description: 'Detail item pengeluaran barang', category: 'Transaksi' },
        { table_name: 'purchase_orders', label: 'Purchase Order', icon: '🛒', description: 'Order pembelian barang', category: 'Transaksi' },
        { table_name: 'purchase_order_items', label: 'Item Purchase Order', icon: '📄', description: 'Detail item purchase order', category: 'Transaksi' },
        { table_name: 'purchase_invoices', label: 'Invoice Pembelian', icon: '🧾', description: 'Invoice pembelian supplier', category: 'Transaksi' },
        { table_name: 'cash_bank_transactions', label: 'Transaksi Kas/Bank', icon: '💳', description: 'Transaksi keuangan kas dan bank', category: 'Transaksi' }
      ]
      
      return NextResponse.json(tables)
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection and get existing tables
    const existingTables = []
    const tableNames = ['app_users', 'mechanics', 'goods', 'company_profile', 'job_types', 'chart_of_accounts', 'periods', 'budget_periods', 'budget_allocations', 'goods_receipts', 'goods_receipt_items', 'goods_issues', 'goods_issue_items', 'purchase_orders', 'purchase_order_items', 'purchase_invoices', 'cash_bank_transactions']
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (!error) {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          let label, icon, description, category
          
          switch(tableName) {
            case 'app_users':
              label = 'Pengguna'
              icon = '�'
              description = 'Manajemen pengguna sistem'
              category = 'Database Master'
              break
            case 'mechanics':
              label = 'Mekanik'
              icon = '👨‍🔧'
              description = 'Data mekanik bengkel'
              category = 'Database Master'
              break
            case 'goods':
              label = 'Barang/Sparepart'
              icon = '📦'
              description = `Stok barang dan sparepart (${count} items)`
              category = 'Database Master'
              break
            case 'company_profile':
              label = 'Profil Perusahaan'
              icon = '🏢'
              description = 'Informasi perusahaan'
              category = 'Database Master'
              break
            case 'job_types':
              label = 'Jenis Pekerjaan'
              icon = '🛠️'
              description = 'Kategori pekerjaan bengkel'
              category = 'Database Master'
              break
            case 'chart_of_accounts':
              label = 'Akun'
              icon = '📊'
              description = 'Struktur akun keuangan'
              category = 'Database Master'
              break
            case 'periods':
              label = 'Periode'
              icon = '📅'
              description = 'Periode akuntansi'
              category = 'Database Master'
              break
            case 'budget_periods':
              label = 'Periode Anggaran'
              icon = '💰'
              description = 'Periode anggaran tahunan'
              category = 'Database Master'
              break
            case 'budget_allocations':
              label = 'Alokasi Anggaran'
              icon = '�'
              description = 'Alokasi dana per departemen'
              category = 'Database Master'
              break
            case 'goods_receipts':
              label = 'Penerimaan Barang'
              icon = '📥'
              description = `Transaksi penerimaan barang (${count} transaksi)`
              category = 'Transaksi'
              break
            case 'goods_receipt_items':
              label = 'Item Penerimaan'
              icon = '📋'
              description = 'Detail item penerimaan barang'
              category = 'Transaksi'
              break
            case 'goods_issues':
              label = 'Pengeluaran Barang'
              icon = '📤'
              description = `Transaksi pengeluaran barang (${count} transaksi)`
              category = 'Transaksi'
              break
            case 'goods_issue_items':
              label = 'Item Pengeluaran'
              icon = '📝'
              description = 'Detail item pengeluaran barang'
              category = 'Transaksi'
              break
            case 'purchase_orders':
              label = 'Purchase Order'
              icon = '🛒'
              description = `Order pembelian barang (${count} orders)`
              category = 'Transaksi'
              break
            case 'purchase_order_items':
              label = 'Item Purchase Order'
              icon = '📄'
              description = 'Detail item purchase order'
              category = 'Transaksi'
              break
            case 'purchase_invoices':
              label = 'Invoice Pembelian'
              icon = '🧾'
              description = `Invoice pembelian supplier (${count} invoices)`
              category = 'Transaksi'
              break
            case 'cash_bank_transactions':
              label = 'Transaksi Kas/Bank'
              icon = '💳'
              description = `Transaksi keuangan kas dan bank (${count} transaksi)`
              category = 'Transaksi'
              break
            default:
              label = tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              icon = '📋'
              description = `Data ${label} (${count} items)`
              category = 'Other'
          }
          
          existingTables.push({
            table_name: tableName,
            label,
            icon,
            description,
            category,
            count: count || 0
          })
        }
      } catch (err) {
        console.log(`Table ${tableName} not accessible:`, err)
      }
    }
    
    if (existingTables.length === 0) {
      // Return hardcoded tables if no tables found
      const fallbackTables = [
        { table_name: 'app_users', label: 'Pengguna', icon: '👥', description: 'Manajemen pengguna sistem', category: 'Database Master' },
        { table_name: 'mechanics', label: 'Mekanik', icon: '👨‍🔧', description: 'Data mekanik bengkel', category: 'Database Master' },
        { table_name: 'goods', label: 'Barang/Sparepart', icon: '📦', description: 'Stok barang dan sparepart', category: 'Database Master' },
        { table_name: 'company_profile', label: 'Profil Perusahaan', icon: '🏢', description: 'Informasi perusahaan', category: 'Database Master' }
      ]
      
      return NextResponse.json(fallbackTables)
    }
    
    return NextResponse.json(existingTables)
    
  } catch (err) {
    console.error('Error fetching tables:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
