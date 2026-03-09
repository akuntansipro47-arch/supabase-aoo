'use client'

import { useState, useEffect } from 'react'

interface SchemaField {
  name: string
  type: string
  required: boolean
  label: string
}

interface DynamicFormProps {
  tableName: string
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  initialData?: Record<string, any>
  isEditing?: boolean
}

export default function DynamicForm({ tableName, onSubmit, onCancel, initialData = {}, isEditing = false }: DynamicFormProps) {
  const [schema, setSchema] = useState<SchemaField[]>([])
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchema()
  }, [tableName])

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  async function fetchSchema() {
    try {
      const response = await fetch(`/api/table/${tableName}/schema`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setSchema(data.columns || [])
    } catch (err) {
      console.error('Error fetching schema:', err)
      setError(err instanceof Error ? err.message : 'Error fetching schema')
    }
  }

  function handleInputChange(fieldName: string, value: any) {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validate required fields
    const missingFields = schema
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label)
    
    if (missingFields.length > 0) {
      setError(`Field wajib diisi: ${missingFields.join(', ')}`)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting form')
    } finally {
      setLoading(false)
    }
  }

  function renderField(field: SchemaField) {
    const { name, type, required, label } = field
    const value = formData[name] || ''
    
    // Skip auto-generated fields
    if (name === 'id' || name === 'created_at' || name === 'updated_at') {
      return null
    }

    const fieldLabel = `${label}${required ? ' *' : ''}`

    switch (type) {
      case 'email':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📧 {fieldLabel}
            </label>
            <input
              type="email"
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Masukkan ${label.toLowerCase()}`}
            />
          </div>
        )

      case 'number':
      case 'integer':
      case 'decimal':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔢 {fieldLabel}
            </label>
            <input
              type="number"
              step={type === 'decimal' ? '0.01' : '1'}
              value={value}
              onChange={(e) => handleInputChange(name, parseFloat(e.target.value) || 0)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Masukkan ${label.toLowerCase()}`}
            />
          </div>
        )

      case 'datetime':
      case 'timestamp':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 {fieldLabel}
            </label>
            <input
              type="datetime-local"
              value={value ? new Date(value).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 'date':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📆 {fieldLabel}
            </label>
            <input
              type="date"
              value={value ? new Date(value).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 'boolean':
        return (
          <div key={name} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleInputChange(name, e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {fieldLabel}
              </span>
            </label>
          </div>
        )

      case 'textarea':
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📝 {fieldLabel}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Masukkan ${label.toLowerCase()}`}
            />
          </div>
        )

      default:
        return (
          <div key={name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📝 {fieldLabel}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(name, e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Masukkan ${label.toLowerCase()}`}
            />
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <h3 className="text-xl font-bold">
          {isEditing ? '✏️ Edit' : '➕ Tambah'} {tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex">
              <span className="text-sm">⚠️</span>
              <span className="ml-2 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schema.map(field => renderField(field))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ❌ Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 018 8 0 01-8 8v0a8 8 0 018-8 018 8 0 00-8-8z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                💾 {isEditing ? 'Update' : 'Simpan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
