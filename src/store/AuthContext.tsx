import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types/types'
import SocketClient from '../services/socket'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  selectUser: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const socketClient = SocketClient.getInstance()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setState(prev => ({
        ...prev,
        user,
        loading: false
      }))
      // Reconnect socket if user exists
      socketClient.identifyUser(user.id)
    } else {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  const selectUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    setState(prev => ({ ...prev, user, error: null }))
    socketClient.identifyUser(user.id)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setState(prev => ({ ...prev, user: null }))
    socketClient.removeIdentify()
  }

  return (
    <AuthContext.Provider value={{ ...state, selectUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
