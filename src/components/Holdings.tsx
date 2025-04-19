import { Stock } from '@/types/types'
import { useAuth } from '../store/AuthContext'
import { useMarket } from '../store/MarketContext'

export default function Holdings() {
  const { user } = useAuth()
  const { holdings, stocks, loading, setSelectedStock, selectedStock } = useMarket()

  if (loading.holdings) {
    return <div className="border border-gray-800 rounded-lg overflow-hidden p-4">
      <div>Loading holdings...</div>
    </div>
  }

  const userHoldings = holdings.filter((h) => h.userId === user?.id)

  if (userHoldings.length === 0) {
    return (
      <div className="p-4 border border-gray-800 rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-white">My Holdings</h2>
        <p className="text-gray-400">No holdings found. Start trading to build your portfolio!</p>
      </div>
    )
  }

  const handleStockClick = (stock: Stock) => () => {
    if (selectedStock?.id === stock.id) {
      setSelectedStock(null)
    } else {
      setSelectedStock(stock)
    }
  }

  return (
    <div className="p-4 border border-gray-800 rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-white">My Holdings</h2>
      <div className="space-y-4">
        {userHoldings.map((holding) => {
          const stock = stocks.find((s) => s.id === holding.stockId)
          if (!stock) return null

          const currentValue = stock.price * holding.quantity
          const investedValue = holding.averagePrice * holding.quantity
          const profit = currentValue - investedValue
          const profitPercentage = ((profit / investedValue) * 100).toFixed(2)

          return (
            <div key={holding.id} onClick={handleStockClick(stock)} className="bg-gray-800 rounded-lg p-4 cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{stock.name}</h3>
                  <p className="text-sm text-gray-400">
                    Quantity: {holding.quantity} | Avg Price: ₹{holding.averagePrice?.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">₹{currentValue.toFixed(2)}</p>
                  <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}{profitPercentage}% ({profit >= 0 ? '+' : ''}₹{profit.toFixed(2)})
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Current Price: ₹{stock.price.toFixed(2)}</span>
                <span>Invested: ₹{investedValue.toFixed(2)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
