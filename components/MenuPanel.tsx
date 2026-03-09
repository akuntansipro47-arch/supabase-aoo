'use client'

import { useState, useEffect } from 'react'

interface MenuItem {
  table_name: string
  label: string
  icon: string
  description: string
  category: string
}

interface MenuPanelProps {
  onTableSelect: (tableName: string) => void
  selectedTable: string | null
}

export default function MenuPanel({ onTableSelect, selectedTable }: MenuPanelProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  useEffect(() => {
    fetchMenuItems()
  }, [])

  async function fetchMenuItems() {
    try {
      setLoading(true)
      const response = await fetch('/api/tables')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMenuItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching menu items')
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category).filter(Boolean)))]

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
        <h2 className="text-2xl font-bold mb-2">🏭 Menu Bengkel</h2>
        <p className="text-blue-100">Pilih modul untuk mengelola data</p>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔍 Cari Menu
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik nama menu..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📂 Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📁</span>
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {items.map(item => (
                <div
                  key={item.table_name}
                  onClick={() => onTableSelect(item.table_name)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedTable === item.table_name
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        Table: {item.table_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          📊 Total {filteredItems.length} modul tersedia
        </div>
      </div>
    </div>
  )
}
