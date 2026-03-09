'use client'

import { useState, useEffect } from 'react'
// Dynamic import to avoid build-time errors
import { supabase } from '@/lib/supabase'
import DataTable from '@/components/DataTable'

interface TableData {
  [tableName: string]: any[]
}

const TABLES = [
  'app_users',
  'budget_allocations', 
  'budget_periods',
  'cash_bank_transactions',
  'chart_of_accounts',
  'company_profile',
  'goods',
  'goods_issue_items',
  'goods_issues',
  'goods_receipt_items',
  'goods_receipts',
  'job_types',
  'mechanics',
  'periods',
  'purchase_invoices',
  'purchase_order_items',
  'purchase_orders'
]

export default function Home() {
  const [tableData, setTableData] = useState<TableData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string>('app_users')

  useEffect(() => {
    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchAllTables()
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchAllTables() {
    // Check if supabase is available
    if (!supabase) {
      setError('Supabase client not available. Please check environment variables.')
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const data: TableData = {}
      
      for (const tableName of TABLES) {
        try {
          const { data: tableData, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(50) // Increased limit for better editing
          
          if (!error) {
            data[tableName] = tableData || []
          } else {
            console.warn(`Error fetching ${tableName}:`, error)
            data[tableName] = []
          }
        } catch (err) {
          console.warn(`Failed to fetch ${tableName}:`, err)
          data[tableName] = []
        }
      }
      
      setTableData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  async function fetchSingleTable(tableName: string) {
    // Check if supabase is available
    if (!supabase) {
      alert('Supabase client not available. Please check environment variables.')
      return
    }
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(50)
      
      if (!error) {
        setTableData(prev => ({ ...prev, [tableName]: data || [] }))
      } else {
        alert('Error fetching data: ' + error.message)
      }
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  function getTableColumns(data: any[]): string[] {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase CRUD Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Database Tables</h2>
            <button
              onClick={fetchAllTables}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh All
            </button>
          </div>
          
          {loading && (
            <div className="text-center py-8 text-gray-600">
              Loading all tables...
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && (
            <div>
              {/* Table Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Table to Manage:
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => {
                    setSelectedTable(e.target.value)
                    fetchSingleTable(e.target.value)
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TABLES.map(table => (
                    <option key={table} value={table}>
                      {table} ({tableData[table]?.length || 0} records)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Table with CRUD */}
              {selectedTable && (
                <DataTable
                  tableName={selectedTable}
                  data={tableData[selectedTable] || []}
                  columns={getTableColumns(tableData[selectedTable] || [])}
                  onRefresh={() => fetchSingleTable(selectedTable)}
                  onEdit={(row) => {
                    // TODO: Implement edit modal
                    alert('Edit functionality coming soon! Record: ' + JSON.stringify(row))
                  }}
                  onDelete={(id) => {
                    // Delete is handled in DataTable component
                  }}
                />
              )}

              {/* Summary */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Table Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TABLES.map(table => (
                    <div 
                      key={table} 
                      className={`bg-gray-50 p-4 rounded cursor-pointer hover:bg-gray-100 ${selectedTable === table ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedTable(table)
                        fetchSingleTable(table)
                      }}
                    >
                      <div className="text-sm text-gray-600">{table}</div>
                      <div className="text-lg font-semibold">
                        {tableData[table]?.length || 0} records
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
