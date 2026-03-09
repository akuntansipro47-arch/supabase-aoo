'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          fetchAllTables()
        } else {
          // Redirect to login if not authenticated
          router.push('/login')
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/login')
      }
    }

    checkAuth()
  }, [])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  async function fetchAllTables() {
    try {
      setLoading(true)
      const data: TableData = {}
      
      for (const tableName of TABLES) {
        try {
          const response = await fetch(`/api/${tableName}`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const tableData = await response.json()
          data[tableName] = tableData || []
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
    try {
      const response = await fetch(`/api/${tableName}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTableData(prev => ({ ...prev, [tableName]: data || [] }))
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  function getTableColumns(data: any[]): string[] {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }

  function formatTableName(tableName: string): string {
    return tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🏭 Supabase Bengkel System
              </h1>
              <span className="ml-4 text-sm text-gray-500">
                Complete Workshop Management
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    👤 {user.name || user.email || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    � Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Database...</h2>
            <p className="text-gray-600">Please wait while we fetch all your data</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <div className="text-4xl mr-4">⚠️</div>
              <div>
                <h2 className="text-xl font-semibold text-red-800 mb-2">Connection Error</h2>
                <p className="text-red-600">{error}</p>
                <p className="text-sm text-red-500 mt-2">Please check your environment variables and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        {!loading && !error && user && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Table Selector */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📊 Select Table to Manage:
              </label>
              <select
                value={selectedTable}
                onChange={(e) => {
                  setSelectedTable(e.target.value)
                  fetchSingleTable(e.target.value)
                }}
                className="block w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                {TABLES.map(table => (
                  <option key={table} value={table}>
                    📋 {formatTableName(table)} ({tableData[table]?.length || 0} records)
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Table */}
            {selectedTable && (
              <DataTable
                tableName={selectedTable}
                data={tableData[selectedTable] || []}
                columns={getTableColumns(tableData[selectedTable] || [])}
                onRefresh={() => fetchSingleTable(selectedTable)}
                onEdit={(row) => {
                  alert('Edit functionality coming soon! Record: ' + JSON.stringify(row, null, 2))
                }}
                onDelete={(id) => {
                  // Delete is handled in DataTable component
                }}
              />
            )}

            {/* Summary Cards */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Database Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {TABLES.map(table => (
                  <div 
                    key={table} 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTable === table 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedTable(table)
                      fetchSingleTable(table)
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600">
                        {formatTableName(table)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tableData[table]?.length || 0} items
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {tableData[table]?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      Records
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
