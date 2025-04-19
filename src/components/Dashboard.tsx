import { useMarket } from '../store/MarketContext'
import Trading from './Trading'
import Holdings from './Holdings'

export default function Dashboard() {
  const { leaderboard } = useMarket()

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-20">
      {/* Header */}
      <div className="max-w-8xl mx-auto">

        {/* User Stats */}
        <div className="flex gap-8 mb-12 border border-gray-800 rounded-lg p-4">
          <div className="">
            <span className="text-gray-400">My Rank: </span>
            <span className="text-white">{leaderboard.myRank}</span>
          </div>
          <div className="">
            <span className="text-gray-400">My Profit: </span>
            <span className={leaderboard.myProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
              ₹{leaderboard.myProfit?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 border-b border-gray-800">Leaderboard</h2>
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left p-4 text-gray-400">Rank</th>
                  <th className="text-left p-4 text-gray-400">Name</th>
                  <th className="text-right p-4 text-gray-400">Profit</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.top10?.map((entry, index) => (
                  <tr 
                    key={entry.userId}
                    className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{entry.name}</td>
                    <td className={`p-4 text-right ${
                      entry.profit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ₹{entry.profit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trading Section */}
          <Trading />
          <Holdings />

        </div>
      </div>
    </div>
  )
}
