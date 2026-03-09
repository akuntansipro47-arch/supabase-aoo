'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MenuPanel from '@/components/MenuPanel'
import BengkelDynamicForm from '@/components/BengkelDynamicForm'
import DataTable from '@/components/DataTable'
import PWAInstall from '@/components/PWAInstall'
import OfflineIndicator from '@/components/OfflineIndicator'

interface TableData {
  [tableName: string]: any[]
}

export default function Home() {
  const [tableData, setTableData] = useState<TableData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingData, setEditingData] = useState<Record<string, any> | null>(null)
  const [user, setUser] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
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

  async function fetchTableData(tableName: string) {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🔍 Fetching data for table: ${tableName}`)
      
      const response = await fetch(`/api/${tableName}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`Failed to fetch data: ${errorText}`)
      }
      
      const data = await response.json()
      console.log(`✅ Fetched ${data.length} records for ${tableName}:`, data.slice(0, 2))
      
      // Ensure data is an array
      const dataArray = Array.isArray(data) ? data : []
      
      setTableData(prev => ({
        ...prev,
        [tableName]: dataArray
      }))
      
      console.log(`💾 Stored ${dataArray.length} records in state for ${tableName}`)
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError(`Gagal memuat data ${tableName}: ${(err as Error).message}`)
      setTableData(prev => ({
        ...prev,
        [tableName]: []
      }))
    } finally {
      setLoading(false)
    }
  }

  async function handleFormSubmit(formData: Record<string, any>) {
    if (!selectedTable) return

    try {
      const response = await fetch(`/api/${selectedTable}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save data')
      }

      // Refresh data and close form
      await fetchTableData(selectedTable)
      setShowForm(false)
      setEditingData(null)
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  async function handleDelete(id: any) {
    if (!selectedTable) {
      console.error('❌ No table selected for delete')
      return
    }
    
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return
    }

    try {
      console.log(`🗑️ Deleting record with ID: ${id} from table: ${selectedTable}`)
      
      const response = await fetch(`/api/${selectedTable}?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete data')
      }

      console.log('✅ Delete successful')
      // Refresh data
      await fetchTableData(selectedTable)
    } catch (err) {
      console.error('❌ Delete error:', err)
      alert('Error: ' + (err as Error).message)
    }
  }

  function handleEdit(row: any) {
    console.log('📝 Edit function called with:', row)
    setEditingData(row)
    setShowForm(true)
  }

  function handleAddNew() {
    setEditingData(null)
    setShowForm(true)
  }

  function handleTableSelect(tableName: string) {
    setSelectedTable(tableName)
    setShowMenu(false)
    fetchTableData(tableName)
  }

  function handleBackToMenu() {
    setShowMenu(true)
    setSelectedTable(null)
    setShowForm(false)
    setEditingData(null)
  }

  function getTableColumns(data: any[]): string[] {
    if (!data || data.length === 0) {
      console.log('❌ No data available for column extraction')
      return ['id', 'name', 'created_at'] // Default columns
    }
    
    const firstRow = data[0]
    const columns = Object.keys(firstRow)
    
    console.log(`📊 Extracted columns from first row:`, columns)
    
    return columns
  }

  function formatTableName(tableName: string): string {
    return tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // If not authenticated, show loading
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <OfflineIndicator />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  🏭 Sistem Bengkel
                </h1>
                {selectedTable && (
                  <div className="ml-6 flex items-center">
                    <button
                      onClick={handleBackToMenu}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      ← Kembali ke Menu
                    </button>
                    <span className="ml-3 text-sm text-gray-500">
                      / {formatTableName(selectedTable)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  👤 {user.name || user.email || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showMenu ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Panel */}
              <div className="lg:col-span-1">
                <MenuPanel
                  onTableSelect={handleTableSelect}
                  selectedTable={null}
                />
              </div>
              
              {/* Welcome Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4">🏭</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Selamat Datang di Sistem Bengkel
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Sistem manajemen lengkap untuk bengkel Anda. Pilih menu di kiri untuk memulai mengelola data.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">📊 Database Master</h3>
                      <p className="text-sm text-blue-600">
                        Kelola data kendaraan, mekanik, supplier, barang/jasa.
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">📋 Transaksi</h3>
                      <p className="text-sm text-green-600">
                        Kelola kendaraan masuk, work order, purchasing.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">🔧 Service</h3>
                      <p className="text-sm text-purple-600">
                        Estimasi service dan tracking pekerjaan.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">📦 Inventory</h3>
                      <p className="text-sm text-orange-600">
                        Pantau stok sparepart dan barang.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Table Header */}
              {selectedTable && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        📋 {formatTableName(selectedTable)}
                      </h2>
                      <p className="text-gray-600">
                        Kelola data {formatTableName(selectedTable).toLowerCase()}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => fetchTableData(selectedTable)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              {showForm && (
                <BengkelDynamicForm
                  tableName={selectedTable!}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingData(null)
                  }}
                  initialData={editingData || {}}
                  isEditing={!!editingData}
                />
              )}

              {/* Loading State */}
              {loading && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-6xl mb-4">⏳</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Data...</h2>
                  <p className="text-gray-600">Mengambil data dari server</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">⚠️</div>
                    <div>
                      <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {!loading && !error && !showForm && selectedTable && tableData[selectedTable] && (
                <DataTable
                  tableName={selectedTable}
                  data={tableData[selectedTable]}
                  columns={getTableColumns(tableData[selectedTable])}
                  onRefresh={() => fetchTableData(selectedTable)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}

              {/* Empty State */}
              {!loading && !error && !showForm && selectedTable && (!tableData[selectedTable] || tableData[selectedTable].length === 0) && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Belum Ada Data</h2>
                  <p className="text-gray-600 mb-6">
                    Belum ada data di {formatTableName(selectedTable).toLowerCase()}. 
                    Silakan refresh untuk memuat ulang data.
                  </p>
                  <button
                    onClick={() => fetchTableData(selectedTable)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Refresh Data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <PWAInstall />
    </>
  )
}
