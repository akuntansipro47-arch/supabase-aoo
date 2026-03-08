'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DatabaseRow {
  id: number
  created_at: string
  [key: string]: any
}

export default function Home() {
  const [data, setData] = useState<DatabaseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('your_table_name')
        .select('*')
      
      if (error) throw error
      setData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Supabase Application
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Data dari Supabase</h2>
          
          {loading && (
            <div className="text-gray-600">Loading...</div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          )}
          
          {!loading && !error && (
            <div>
              <p className="text-gray-600 mb-4">
                Connected to Supabase successfully!
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
