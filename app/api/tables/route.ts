import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return hardcoded tables list
    const tables = [
      { table_name: 'app_users', label: 'Pengguna', icon: '👥', description: 'Manajemen pengguna sistem', category: 'Master Data' },
      { table_name: 'company_profile', label: 'Profil Perusahaan', icon: '🏢', description: 'Informasi perusahaan', category: 'Master Data' },
      { table_name: 'mechanics', label: 'Mekanik', icon: '🔧', description: 'Data mekanik bengkel', category: 'Master Data' },
      { table_name: 'job_types', label: 'Jenis Pekerjaan', icon: '🛠️', description: 'Kategori pekerjaan bengkel', category: 'Master Data' },
      { table_name: 'goods', label: 'Barang/Sparepart', icon: '📦', description: 'Stok barang dan sparepart', category: 'Inventory' },
      { table_name: 'chart_of_accounts', label: 'Akun', icon: '📊', description: 'Struktur akun keuangan', category: 'Accounting' },
      { table_name: 'periods', label: 'Periode', icon: '📅', description: 'Periode akuntansi', category: 'Accounting' },
      { table_name: 'budget_periods', label: 'Periode Anggaran', icon: '💰', description: 'Periode anggaran tahunan', category: 'Accounting' },
      { table_name: 'budget_allocations', label: 'Alokasi Anggaran', icon: '💸', description: 'Alokasi dana per departemen', category: 'Accounting' },
      { table_name: 'goods_receipts', label: 'Penerimaan Barang', icon: '📥', description: 'Transaksi penerimaan barang', category: 'Inventory' },
      { table_name: 'goods_receipt_items', label: 'Item Penerimaan', icon: '📋', description: 'Detail item penerimaan barang', category: 'Inventory' },
      { table_name: 'goods_issues', label: 'Pengeluaran Barang', icon: '📤', description: 'Transaksi pengeluaran barang', category: 'Inventory' },
      { table_name: 'goods_issue_items', label: 'Item Pengeluaran', icon: '📝', description: 'Detail item pengeluaran barang', category: 'Inventory' },
      { table_name: 'purchase_orders', label: 'Purchase Order', icon: '🛒', description: 'Order pembelian barang', category: 'Purchasing' },
      { table_name: 'purchase_order_items', label: 'Item Purchase Order', icon: '📄', description: 'Detail item purchase order', category: 'Purchasing' },
      { table_name: 'purchase_invoices', label: 'Invoice Pembelian', icon: '🧾', description: 'Invoice pembelian supplier', category: 'Purchasing' },
      { table_name: 'cash_bank_transactions', label: 'Transaksi Kas/Bank', icon: '💳', description: 'Transaksi keuangan kas dan bank', category: 'Accounting' }
    ]
    
    return NextResponse.json(tables)
  } catch (err) {
    console.error('Error fetching tables:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    )
  }
}
