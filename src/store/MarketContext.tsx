import React, { createContext, useContext, useState, useEffect } from 'react'
import { Leaderboard, Stock, Holding } from '../types/types'
import SocketClient from '../services/socket'
import { useAuth } from './AuthContext'

interface MarketContextType {
  leaderboard: Leaderboard
  stocks: Stock[]
  holdings: Holding[]
  selectedStock: Stock | null
  quantity: number
  loading: {
    stocks: boolean
    holdings: boolean
  }
  setSelectedStock: (stock: Stock | null) => void
  setQuantity: (quantity: number) => void
  handleTrade: (type: 'buy' | 'sell') => Promise<void>
}

const MarketContext = createContext<MarketContextType | null>(null)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<Leaderboard>({
    top10: [],
    myRank: 0,
    myProfit: 0
  })
  const [stocks, setStocks] = useState<Stock[]>([])
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState({
    stocks: true,
    holdings: true
  })

  useEffect(() => {
    const socketClient = SocketClient.getInstance()

    // Setup leaderboard updates
    socketClient.onLeaderboardUpdate((data) => {
      setLeaderboard(data.leaderboard)
      setHoldings(data.holdings)
      setStocks(data.stocks)
      setLoading(prev => ({ ...prev, stocks: false, holdings: false }))
    })
  }, [user?.id])

  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!selectedStock || !user) return
    if (quantity <= 0) {
      alert('Quantity must be greater than 0')
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        stockId: selectedStock.id,
        quantity,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setQuantity(1)
          setSelectedStock(null)
        } else {
          console.error('Error trading stock:', data.error)
          alert('Error: ' + data.error)
        }
      })
      .catch(err => {
        console.error('Error trading stock:', err)
        alert('Error: ' + err)
      })
  }

  const value = {
    leaderboard,
    stocks,
    holdings,
    selectedStock,
    quantity,
    loading,
    setSelectedStock,
    setQuantity,
    handleTrade
  }

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarket() {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider')
  }
  return context
} 
