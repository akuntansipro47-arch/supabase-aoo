'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
    fetchAllTables()
  }, [])

  async function fetchAllTables() {
    try {
      setLoading(true)
      const data: TableData = {}
      
      for (const tableName of TABLES) {
        try {
          const { data: tableData, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(10) // Limit to 10 records for performance
          
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

  function getTableColumns(data: any[]): string[] {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Dashboard
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Database Tables</h2>
            <button
              onClick={fetchAllTables}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Data
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
                  Select Table:
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TABLES.map(table => (
                    <option key={table} value={table}>
                      {table} ({tableData[table]?.length || 0} records)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Table Data */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 font-medium">
                  {selectedTable} ({tableData[selectedTable]?.length || 0} records)
                </div>
                
                {tableData[selectedTable] && tableData[selectedTable].length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {getTableColumns(tableData[selectedTable]).map(column => (
                            <th
                              key={column}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData[selectedTable].map((row, index) => (
                          <tr key={index}>
                            {getTableColumns(tableData[selectedTable]).map(column => (
                              <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {String(row[column] || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No data found in {selectedTable}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {TABLES.map(table => (
                  <div key={table} className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-600">{table}</div>
                    <div className="text-lg font-semibold">
                      {tableData[table]?.length || 0} records
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
