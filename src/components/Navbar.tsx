import React from 'react'
import { useAuth } from '../store/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-white">Stock Market</div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
