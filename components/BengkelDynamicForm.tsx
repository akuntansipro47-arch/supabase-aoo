'use client'

import { useState, useEffect } from 'react'

interface FieldConfig {
  name: string
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox'
  label: string
  required?: boolean
  options?: string[]
  placeholder?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface BengkelDynamicFormProps {
  tableName: string
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  initialData?: Record<string, any>
  isEditing?: boolean
}

export default function BengkelDynamicForm({ 
  tableName, 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isEditing = false 
}: BengkelDynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<FieldConfig[]>([])

  useEffect(() => {
    fetchTableSchema()
  }, [tableName])

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  async function fetchTableSchema() {
    try {
      setLoading(true)
      const response = await fetch(`/api/table/${tableName}/schema`)
      if (!response.ok) throw new Error('Failed to fetch schema')
      const data = await response.json()
      
      // Set custom fields based on table name
      const customFields = getCustomFields(tableName)
      setFields(customFields)
    } catch (err) {
      console.error('Error fetching schema:', err)
    } finally {
      setLoading(false)
    }
  }

  function getCustomFields(tableName: string): FieldConfig[] {
    switch (tableName) {
      case 'kendaraan':
        return [
          { name: 'jenis_kendaraan', type: 'select', label: 'Jenis Kendaraan', required: true, options: ['R4', 'R2', 'R2 Kecil'] },
          { name: 'nama_kendaraan', type: 'text', label: 'Nama Kendaraan', required: true },
          { name: 'no_pol', type: 'text', label: 'NoPol', required: true },
          { name: 'no_rangka', type: 'text', label: 'No. Rangka', required: false },
          { name: 'no_mesin', type: 'text', label: 'No. Mesin', required: false },
          { name: 'no_lambung', type: 'text', label: 'No. Lambung', required: false }
        ]
      
      case 'mekanik':
        return [
          { name: 'nama_mekanik', type: 'text', label: 'Nama Mekanik', required: true },
          { name: 'no_nik', type: 'number', label: 'No. NIK', required: true, validation: { min: 1000000000000000, max: 9999999999999999 } },
          { name: 'no_hp', type: 'number', label: 'No. HP', required: true, validation: { min: 1000000000, max: 999999999999 } },
          { name: 'alamat', type: 'textarea', label: 'Alamat', required: false },
          { name: 'kategori_mekanik', type: 'select', label: 'Kategori Mekanik', required: true, options: ['R4', 'R2', 'R2 Kecil'] }
        ]
      
      case 'supplier':
        return [
          { name: 'nama_supplier', type: 'text', label: 'Nama Supplier', required: true },
          { name: 'alamat', type: 'textarea', label: 'Alamat', required: false },
          { name: 'no_telepon', type: 'text', label: 'No. Telepon', required: false }
        ]
      
      case 'barang_jasa':
        return [
          { name: 'kode_barang', type: 'text', label: 'Kode Barang', required: false, placeholder: 'Kosongkan untuk generate otomatis' },
          { name: 'nama_barang', type: 'text', label: 'Nama Barang', required: true },
          { name: 'satuan', type: 'text', label: 'Satuan', required: true },
          { name: 'harga_jual', type: 'number', label: 'Harga Jual', required: true, validation: { min: 0 } },
          { name: 'kategori_barang', type: 'select', label: 'Kategori Barang/Jasa', required: true, options: ['Persediaan', 'Non Persediaan', 'Peralatan Workshop', 'Inventaris Kantor'] },
          { name: 'group_sparepart', type: 'select', label: 'Group Sparepart', required: true, options: ['R4', 'R2', 'R2 Kecil'] }
        ]
      
      case 'pekerjaan_service':
        return [
          { name: 'kategori_kendaraan', type: 'select', label: 'Kategori Kendaraan', required: true, options: ['R4', 'R2', 'R2 Kecil'] },
          { name: 'kode_service', type: 'text', label: 'Kode Service', required: false, placeholder: 'Generate otomatis' },
          { name: 'pekerjaan_service', type: 'text', label: 'Pekerjaan/Jasa Service', required: true },
          { name: 'harga_jual', type: 'number', label: 'Harga Jual', required: true, validation: { min: 0 } },
          { name: 'hpp', type: 'number', label: 'HPP', required: true, validation: { min: 0 } }
        ]
      
      case 'profile_perusahaan':
        return [
          { name: 'nama_perusahaan', type: 'text', label: 'Nama Perusahaan/Bengkel', required: true },
          { name: 'alamat', type: 'textarea', label: 'Alamat', required: true },
          { name: 'npwp', type: 'text', label: 'NPWP', required: false },
          { name: 'pkp_status', type: 'select', label: 'Status PKP', required: false, options: ['PKP', 'NON PKP'] },
          { name: 'no_telepon', type: 'number', label: 'No. Telepon/HP', required: true },
          { name: 'email', type: 'email', label: 'Email', required: false },
          { name: 'ig', type: 'text', label: 'Instagram', required: false },
          { name: 'fb', type: 'text', label: 'Facebook', required: false },
          { name: 'twitter', type: 'text', label: 'Twitter', required: false }
        ]
      
      case 'kendaraan_masuk':
        return [
          { name: 'tanggal_masuk', type: 'date', label: 'Tanggal Masuk', required: true },
          { name: 'kendaraan_id', type: 'select', label: 'Kendaraan', required: true, options: [] }, // Will be populated dynamically
          { name: 'no_surat_jalan', type: 'text', label: 'No. Surat Jalan/Nota Dinas', required: true }
        ]
      
      case 'work_order':
        return [
          { name: 'no_wo', type: 'text', label: 'No. WO', required: false, placeholder: 'Generate otomatis' },
          { name: 'tanggal_wo', type: 'date', label: 'Tanggal WO', required: true },
          { name: 'kendaraan_masuk_id', type: 'select', label: 'Kendaraan/No Surat Jalan', required: true, options: [] }
        ]
      
      case 'purchase_order':
        return [
          { name: 'tanggal_po', type: 'date', label: 'Tanggal PO', required: true },
          { name: 'group_po', type: 'select', label: 'Group PO', required: true, options: ['WO (Project)', 'Gudang (Umum)'] },
          { name: 'supplier_id', type: 'select', label: 'Nama Supplier', required: true, options: [] }
        ]
      
      default:
        return [
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'created_at', type: 'date', label: 'Created At', required: false }
        ]
    }
  }

  function handleInputChange(name: string, value: any) {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Auto-generate codes if empty
      const submitData = { ...formData }
      
      if (tableName === 'barang_jasa' && !submitData.kode_barang) {
        submitData.kode_barang = `BRG${Date.now()}`
      }
      
      if (tableName === 'pekerjaan_service' && !submitData.kode_service) {
        submitData.kode_service = `SRV${Date.now()}`
      }
      
      if (tableName === 'work_order' && !submitData.no_wo) {
        submitData.no_wo = `WO${Date.now()}`
      }

      await onSubmit(submitData)
    } catch (err) {
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  function renderField(field: FieldConfig) {
    const value = formData[field.name] || ''
    
    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Pilih {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            rows={3}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        )
      
      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        )
      
      case 'email':
        return (
          <input
            type="email"
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        )
      
      default:
        return (
          <input
            type="text"
            id={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field.required}
            pattern={field.validation?.pattern}
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit' : 'Tambah'} {tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {fields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
          </button>
        </div>
      </form>
    </div>
  )
}
