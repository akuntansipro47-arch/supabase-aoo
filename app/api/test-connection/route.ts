import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('=== CONNECTION TEST ===')
    console.log('URL:', supabaseUrl ? 'SET' : 'NOT_SET')
    console.log('Key:', supabaseKey ? 'SET' : 'NOT_SET')
    console.log('====================')
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false,
        error: 'Environment variables not set',
        tables: []
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('app_users')
      .select('count')
      .limit(1)
    
    if (testError && !testError.message.includes('does not exist')) {
      return NextResponse.json({ 
        success: false,
        error: testError.message,
        tables: []
      })
    }
    
    // Try to get actual tables
    const tables = []
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
          
          tables.push({
            name: tableName,
            exists: true,
            count: count || 0,
            sample: data?.[0] || null
          })
        } else {
          tables.push({
            name: tableName,
            exists: false,
            error: error.message
          })
        }
      } catch (err) {
        tables.push({
          name: tableName,
          exists: false,
          error: (err as Error).message
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      tables: tables
    })
    
  } catch (err) {
    console.error('Connection test error:', err)
    return NextResponse.json({
      success: false,
      error: (err as Error).message,
      tables: []
    })
  }
}
