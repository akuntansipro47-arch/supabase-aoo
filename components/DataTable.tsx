'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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
      const { error } = await supabase
        .from(tableName)
        .insert([newRow])
      
      if (!error) {
        setShowAddForm(false)
        setNewRow({})
        onRefresh()
      } else {
        alert('Error adding record: ' + error.message)
      }
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  async function handleDelete(id: any) {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
      
      if (!error) {
        onRefresh()
      } else {
        alert('Error deleting record: ' + error.message)
      }
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  function handleInputChange(field: string, value: any) {
    setNewRow(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{tableName}</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add New Record
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Add New {tableName.slice(0, -1)}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {columns.filter(col => col !== 'id' && col !== 'created_at' && col !== 'updated_at').map(column => (
              <div key={column}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column}
                </label>
                <input
                  type="text"
                  value={newRow[column] || ''}
                  onChange={(e) => handleInputChange(column, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${column}`}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewRow({})
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {data.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(row[column] || '')}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 border rounded-lg">
          No data found in {tableName}
        </div>
      )}
    </div>
  )
}
