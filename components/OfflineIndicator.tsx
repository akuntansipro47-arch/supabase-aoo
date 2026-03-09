'use client'

import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowOffline(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOffline(true)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-orange-500 text-white px-4 py-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-lg">📵</span>
          <span className="text-sm font-medium">
            Anda sedang offline - Beberapa fitur mungkin tidak tersedia
          </span>
        </div>
      </div>
    </div>
  )
}
