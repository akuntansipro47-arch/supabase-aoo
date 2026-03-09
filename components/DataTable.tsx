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
  async function handleEdit(row: any) {
    if (onEdit) {
      console.log('📝 Edit button clicked for:', row)
      onEdit(row)
    }
  }

  async function handleDelete(id: any) {
    if (onDelete) {
      if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return
      
      console.log('🗑️ Delete button clicked for ID:', id)
      onDelete(id)
    }
  }

  function formatFieldName(fieldName: string): string {
    return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
          � Refresh
        </button>
      </div>

      {/* Data Table */}
      {data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800">
              � Data {formatFieldName(tableName)}
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
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map(column => (
                      <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100">
                        {column.includes('created_at') || column.includes('updated_at') || column.includes('tanggal')
                          ? new Date(row[column]).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : String(row[column] || '')}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-100">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => handleEdit(row)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            title="Delete"
                          >
                            🗑️ Delete
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
            <p>Belum ada data {formatFieldName(tableName)}. Silakan refresh untuk memuat ulang data.</p>
            <div className="mt-4">
              <button
                onClick={onRefresh}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
