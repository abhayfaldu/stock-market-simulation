import { useState, useEffect } from 'react'
import { useAuth } from '../store/AuthContext'
import { User } from '@/types/types'

export default function UserSelection() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { selectUser } = useAuth()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data)
      })
      .catch(err => {
        console.error('Failed to fetch users:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading users...</div>
  }

  return (
    <div className="min-h-screen bg-black-100 flex items-center justify-center">
      <div className="bg-black-200 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Select Your User</h1>
        <div className="grid grid-cols-2 gap-4 text-black">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => selectUser(user)}
              className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <span className="font-medium">{user.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 
