import { useMarket } from '../store/MarketContext'
import { Stock } from '../types/types'

export default function Trading() {
  const {
    stocks,
    selectedStock,
    setSelectedStock,
    quantity,
    setQuantity,
    handleTrade,
    loading
  } = useMarket()

  const handleStockClick = (stock: Stock) => () => {
    if (selectedStock?.id === stock.id) {
      setSelectedStock(null)
    } else {
      setSelectedStock(stock)
    }
  }

  if (loading.stocks) {
    return <div className="border border-gray-800 rounded-lg overflow-hidden p-4">
      <div>Loading stocks...</div>
    </div>
  }

  return (
    <div className='p-4 border border-gray-800 rounded-lg overflow-hidden'>
      <h2 className='text-2xl font-bold mb-4'>Stock Trading</h2>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <h3 className='text-xl font-semibold mb-2'>Available Stocks</h3>
          <div className='space-y-0'>
            {stocks.map((stock) => (
              <div key={stock.id}>
                <div
                  className={`p-3 ps-0 cursor-pointer text-white ${selectedStock?.id === stock.id ? 'border-blue-500 bg-gray-700' : 'hover:bg-gray-700'}`}
                  onClick={handleStockClick(stock)}
                >
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{stock.name}</span>
                    <span className='text-gray-50'>₹{stock.price.toFixed(2)}</span>
                  </div>
                </div>
                {selectedStock?.id === stock.id && (
                  <div className='border p-4 rounded'>
                    <h3 className='text-xl font-semibold mb-4'>Trade {selectedStock.name}</h3>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-500'>Quantity</label>
                        <input
                          type='number'
                          value={quantity}
                          required
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2'
                        />
                      </div>
                      <div>
                        <p className='text-sm text-gray-400'>Total Value: ₹{(selectedStock.price * quantity).toFixed(2)}</p>
                      </div>
                      <div className='flex space-x-2'>
                        <button onClick={() => handleTrade('buy')} className='flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'>
                          Buy
                        </button>
                        <button onClick={() => handleTrade('sell')} className='flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'>
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
