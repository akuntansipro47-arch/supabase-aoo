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
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRow, setNewRow] = useState<Record<string, any>>({})

  async function handleAdd() {
    try {
      const response = await fetch(`/api/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add record')
      }
      
      setShowAddForm(false)
      setNewRow({})
      onRefresh()
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  async function handleDelete(id: any) {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    try {
      const response = await fetch(`/api/${tableName}?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete record')
      }
      
      onRefresh()
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  function handleInputChange(field: string, value: any) {
    setNewRow(prev => ({ ...prev, [field]: value }))
  }

  // Generate appropriate input type based on field name
  function getInputType(fieldName: string): string {
    const lowerField = fieldName.toLowerCase()
    if (lowerField.includes('email')) return 'email'
    if (lowerField.includes('phone')) return 'tel'
    if (lowerField.includes('date') || lowerField.includes('created_at') || lowerField.includes('updated_at')) return 'date'
    if (lowerField.includes('price') || lowerField.includes('amount') || lowerField.includes('total') || lowerField.includes('cost')) return 'number'
    if (lowerField.includes('description') || lowerField.includes('notes') || lowerField.includes('address')) return 'textarea'
    return 'text'
  }

  function formatFieldName(fieldName: string): string {
    return fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {formatFieldName(tableName)} Management
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Add New {formatFieldName(tableName.slice(0, -1))}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold mb-4 text-blue-800">
            Add New {formatFieldName(tableName.slice(0, -1))}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at').map(column => (
              <div key={column}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formatFieldName(column)}
                </label>
                {getInputType(column) === 'textarea' ? (
                  <textarea
                    value={newRow[column] || ''}
                    onChange={(e) => handleInputChange(column, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder={`Enter ${formatFieldName(column)}`}
                  />
                ) : getInputType(column) === 'number' ? (
                  <input
                    type="number"
                    value={newRow[column] || ''}
                    onChange={(e) => handleInputChange(column, parseFloat(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${formatFieldName(column)}`}
                  />
                ) : (
                  <input
                    type={getInputType(column)}
                    value={newRow[column] || ''}
                    onChange={(e) => handleInputChange(column, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${formatFieldName(column)}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              💾 Save {formatFieldName(tableName.slice(0, -1))}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewRow({})
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {data.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h4 className="font-semibold text-gray-800">
              📋 {formatFieldName(tableName)} Data ({data.length} records)
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
                        {column.includes('created_at') || column.includes('updated_at') || column.includes('date')
                          ? new Date(row[column]).toLocaleDateString()
                          : String(row[column] || '')}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-100">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.id)}
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
            <h4 className="text-lg font-semibold mb-2">No Data Found</h4>
            <p>No {formatFieldName(tableName)} records found. Add your first {formatFieldName(tableName.slice(0, -1))} using the button above!</p>
          </div>
        </div>
      )}
    </div>
  )
}
