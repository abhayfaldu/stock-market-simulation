"use client"

import { AuthProvider } from '../store/AuthContext'
import { useAuth } from '../store/AuthContext'
import { MarketProvider } from '../store/MarketContext'
import UserSelection from '../components/UserSelection'
import Dashboard from '../components/Dashboard'
import Navbar from '../components/Navbar'

function MainContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl font-bold">Loading...</div>
  }

  if (!user) {
    return <UserSelection />
  }

  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MarketProvider>
        <MainContent />
      </MarketProvider>
    </AuthProvider>
  )
}
