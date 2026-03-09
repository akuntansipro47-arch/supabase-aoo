'use client'

import { useState } from 'react'

interface DataTableProps {
  tableName: string
  data: any[]
  columns: string[]
  onRefresh: () => void
  onEdit?: (row: any) => void
  onDelete?: (id: any) => void
}

export default function DataTable({ tableName, data, columns, onRefresh, onEdit, onDelete }: DataTableProps) {
  const [editRow, setEditRow] = useState<any>(null)
  const [showEditForm, setShowEditForm] = useState(false)

  async function handleEdit(row: any) {
    console.log('📝 Edit button clicked for:', row)
    console.log('📝 Available onEdit function:', !!onEdit)
    
    if (onEdit) {
      setEditRow(row)
      setShowEditForm(true)
      onEdit(row)
    } else {
      console.error('❌ onEdit function not provided!')
      alert('Fungsi edit tidak tersedia untuk modul ini')
    }
  }

  async function handleDelete(id: any) {
    console.log('🗑️ Delete button clicked for ID:', id)
    console.log('🗑️ Available onDelete function:', !!onDelete)
    
    if (onDelete) {
      if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        onDelete(id)
      }
    } else {
      console.error('❌ onDelete function not provided!')
      alert('Fungsi hapus tidak tersedia untuk modul ini')
    }
  }

  function formatFieldName(fieldName: string): string {
    return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  function formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  function getCellValue(row: any, column: string): string {
    const value = row[column]
    
    if (column.includes('created_at') || column.includes('updated_at') || column.includes('tanggal') || column.includes('date')) {
      return formatDate(value)
    }
    
    if (value === null || value === undefined) {
      return '-'
    }
    
    return String(value)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          📋 {formatFieldName(tableName)} Data ({data.length} records)
        </h3>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2">🔍 Debug Info:</h4>
          <div className="text-sm text-yellow-700">
            <p><strong>Table:</strong> {tableName}</p>
            <p><strong>Data Length:</strong> {data.length}</p>
            <p><strong>Columns:</strong> {columns.join(', ')}</p>
            <p><strong>onEdit Available:</strong> {!!onEdit ? '✅ Yes' : '❌ No'}</p>
            <p><strong>onDelete Available:</strong> {!!onDelete ? '✅ Yes' : '❌ No'}</p>
            <p><strong>First Row Data:</strong> {data.length > 0 ? JSON.stringify(data[0], null, 2) : 'No data'}</p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && editRow && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <h4 className="font-semibold mb-4 text-blue-800">
            ✏️ Edit {formatFieldName(tableName.slice(0, -1))}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at').map(column => (
              <div key={column}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formatFieldName(column)}
                </label>
                <input
                  type="text"
                  value={editRow[column] || ''}
                  onChange={(e) => setEditRow(prev => ({ ...prev, [column]: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Edit ${formatFieldName(column)}`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                console.log('💾 Saving edit for:', editRow)
                setShowEditForm(false)
                setEditRow(null)
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              💾 Simpan
            </button>
            <button
              onClick={() => {
                setShowEditForm(false)
                setEditRow(null)
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ❌ Batal
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800">
              📊 Data {formatFieldName(tableName)}
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                    >
                      {formatFieldName(column)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    🔧 Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => (
                  <tr key={row.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map(column => (
                      <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100">
                        {getCellValue(row, column)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Edit data ini"
                        >
                          ✏️ Edit
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Hapus data ini"
                          >
                            🗑️ Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="text-yellow-800">
            <div className="text-4xl mb-2">📭</div>
            <h4 className="text-lg font-semibold mb-2">Tidak Ada Data</h4>
            <p className="text-yellow-600 mb-4">
              Belum ada data di {formatFieldName(tableName)}. 
              Silakan refresh untuk memuat ulang data dari database.
            </p>
            <div className="space-y-2">
              <button
                onClick={onRefresh}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={() => {
                    console.log('🔍 Debug: Current state:', {
                      tableName,
                      dataLength: data.length,
                      columns,
                      hasOnEdit: !!onEdit,
                      hasOnDelete: !!onDelete
                    })
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  🔍 Debug Console
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
